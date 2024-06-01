import { useMutation } from '@apollo/client';
import { RadioGroup } from '@headlessui/react';
import { LoadingDialog, PEHeader } from '@people-eat/web-components';
import {
    PEButton,
    PEDatePicker,
    PELabelButton,
    PENumberTextField,
    PETextArea,
    PETextField,
    PETimePicker,
} from '@people-eat/web-core-components';
import {
    ConfirmOneGiftCardDocument,
    CreateOneGiftCardDocument,
    GetGiftCardPageDataDocument,
    SignedInUser,
    Time,
    formatPrice,
} from '@people-eat/web-domain';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import classNames from 'classnames';
import { CheckCircleIcon } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createApolloClient } from '../network/apolloClients';

const balances = [100, 150, 200, 300, 500];

type DeliveryMethod = 'EMAIL';
const deliveryMethods: DeliveryMethod[] = ['EMAIL'];
const deliveryMethodTranslations: Record<DeliveryMethod, string> = {
    EMAIL: 'Email',
};

interface PaymentFormProps {
    giftCardId: string;
}

function PaymentForm({ giftCardId }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [confirmGiftCard] = useMutation(ConfirmOneGiftCardDocument);

    async function pay(): Promise<void> {
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: 'if_required' });

        if (error && !paymentIntent) {
            if (error.type === 'card_error' || error.type === 'validation_error') setErrorMessage(error.message);
            else setErrorMessage('An unexpected error occurred.');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            const { data } = await confirmGiftCard({ variables: { giftCardId } });
            if (data?.giftCards.success) {
                alert(`Gutschein in Höhe von ${formatPrice({ amount: paymentIntent.amount, currencyCode: '€' })} erfolgreich gekauft!`);
            } else {
                alert('Leider ist im letzte Schritt noch ein Fehler aufgetreten.');
            }
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <PaymentElement id="payment-element" />

            <PEButton title="Jetzt kaufen" onClick={pay} />

            {errorMessage && <span className="text-red-400">{errorMessage}</span>}
        </div>
    );
}

const homePageRedirect = { redirect: { permanent: false, destination: '/' } };

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    stripePublishableKey: string;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetGiftCardPageDataDocument });

        return {
            props: {
                signedInUser: data.users.signedInUser ?? null,
                stripePublishableKey: data.stripePublishableKey!,
            },
        };
    } catch (error) {
        console.log(error);
        return homePageRedirect;
    }
};

export default function GiftCardsPage({ signedInUser, stripePublishableKey }: ServerSideProps) {
    const [createGiftCard, { loading, data }] = useMutation(CreateOneGiftCardDocument);
    const result = data?.giftCards.createOne;
    let successResult: { giftCardId: string; stripeClientSecret: string } | undefined;

    if (result && 'stripeClientSecret' in result) {
        successResult = result;
    }

    const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<{
        message: string;
        balance: number;
        showCustomBalance: boolean;
        deliveryMethod: DeliveryMethod;
        deliveryDate: Date;
        deliveryTime: Time;
        buyer: {
            firstName: string;
            lastName: string;
            emailAddress: string;
        };
        recipient: {
            firstName: string;
            lastName: string;
            emailAddress: string;
        };
    }>({
        defaultValues: {
            message: '',
            balance: 50,
            showCustomBalance: false,
            deliveryMethod: 'EMAIL',
            deliveryDate: new Date(),
            deliveryTime: {
                hours: 12,
                minutes: 0,
            },
            buyer: {
                firstName: '',
                lastName: '',
                emailAddress: '',
            },
            recipient: {
                firstName: '',
                lastName: '',
                emailAddress: '',
            },
        },
    });

    const { message, deliveryMethod, balance, showCustomBalance, deliveryDate, deliveryTime } = watch();

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading} />

            {successResult && (
                <Elements stripe={loadStripe(stripePublishableKey)} options={{ clientSecret: successResult.stripeClientSecret }}>
                    <PaymentForm giftCardId={successResult.giftCardId} />
                </Elements>
            )}

            <div className="relative bg-white">
                <div className="lg:absolute lg:inset-0 lg:left-1/2">
                    <Image
                        className="h-64 w-full bg-gray-50 object-cover sm:h-80 lg:absolute lg:h-full"
                        src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=2560&h=3413&&q=80"
                        width={600}
                        height={800}
                        alt=""
                    />
                </div>

                <div className="pb-24 pt-16 sm:pb-32 sm:pt-24 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:pt-32">
                    <div className="px-6 lg:px-8">
                        <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                Geschenkgutscheine für besondere Menschen in den eigenen vier Wänden
                            </h2>

                            <p className="mt-2 text-lg leading-8 text-gray-600">
                                Verschenke kulinarische Erlebnisse an deine Lieben. Egal ob ein romantisches Candle-Light dinner, ein
                                Familienesen, oder Genussmomente Zuhause. Der PeopleEat Gutschein ist flexibel einlösbar.
                            </p>

                            <form
                                className="mt-16 flex flex-col gap-16"
                                onSubmit={handleSubmit(() =>
                                    createGiftCard({
                                        variables: {
                                            // request: {
                                            //     userId: signed
                                            //     buyer: {},
                                            //     recipient: {},
                                            //     balance,
                                            //     message,
                                            // },
                                        },
                                    }),
                                )}
                            >
                                <fieldset className="flex flex-col gap-8">
                                    <legend className="text-lg font-medium text-gray-900">
                                        Wie möchtest du den Gutschein verschenken?
                                    </legend>

                                    <RadioGroup
                                        value={deliveryMethod}
                                        onChange={(v) => setValue('deliveryMethod', v)}
                                        className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
                                    >
                                        {deliveryMethods.map((deliveryMethod) => (
                                            <RadioGroup.Option
                                                key={deliveryMethod}
                                                value={deliveryMethod}
                                                aria-label={deliveryMethodTranslations[deliveryMethod]}
                                                className={({ checked, active }) =>
                                                    classNames(
                                                        checked ? 'border-transparent' : 'border-gray-300',
                                                        active ? 'ring-2 ring-orange-500' : '',
                                                        'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none',
                                                    )
                                                }
                                            >
                                                {({ checked, active }) => (
                                                    <>
                                                        <span className="flex-1 block text-sm font-medium text-gray-900">
                                                            {deliveryMethodTranslations[deliveryMethod]}
                                                        </span>

                                                        {checked && (
                                                            <CheckCircleIcon className="h-5 w-5 text-orange-600" aria-hidden="true" />
                                                        )}

                                                        <span
                                                            className={classNames(
                                                                checked ? 'border-orange-500' : 'border-transparent',
                                                                active ? 'border' : 'border-2',
                                                                'pointer-events-none absolute -inset-px rounded-lg',
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    </>
                                                )}
                                            </RadioGroup.Option>
                                        ))}
                                    </RadioGroup>

                                    <div className="flex flex-col gap-4">
                                        <legend className="text-lg font-medium text-gray-900">
                                            Wem möchtest du den Gutschein schenken?
                                        </legend>

                                        <div className="flex gap-4">
                                            <PETextField
                                                id="first-name"
                                                labelTitle="Vorname"
                                                type="text"
                                                autoComplete="given-name"
                                                errorMessage={errors.buyer?.firstName?.message}
                                                {...register('buyer.firstName', { required: 'This field is required' })}
                                            />

                                            <PETextField
                                                id="last-name"
                                                labelTitle="Nachname"
                                                type="text"
                                                autoComplete="family-name"
                                                errorMessage={errors.buyer?.lastName?.message}
                                                {...register('buyer.lastName', { required: 'This field is required' })}
                                            />
                                        </div>

                                        {deliveryMethod === 'EMAIL' && (
                                            <div className="flex flex-col gap-8">
                                                <div className="flex flex-col gap-4">
                                                    <PETextField
                                                        labelTitle="Email Adresse"
                                                        placeholder="Email Adresse des Beschenkten"
                                                        id="email-address"
                                                        type="email"
                                                        errorMessage={errors.recipient?.emailAddress?.message}
                                                        {...register('recipient.emailAddress', {
                                                            required: 'Bitte gib deine Email Adresse ein.',
                                                            pattern: {
                                                                value: /\S+@\S+\.\S+/,
                                                                message: 'Bitte eine gültige Email Adresse eingeben.',
                                                            },
                                                        })}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-4">
                                                    <legend className="text-lg font-medium text-gray-900">
                                                        Wann soll der Beschenkte den Gutschein erhalten?
                                                    </legend>
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <PEDatePicker
                                                            labelTitle="Zustellungsdatum"
                                                            date={deliveryDate}
                                                            setDate={(d) => setValue('deliveryDate', d)}
                                                        />
                                                        <PETimePicker
                                                            labelTitle="Zustellungsuhrzeit"
                                                            value={deliveryTime}
                                                            onChange={(t) => setValue('deliveryTime', t)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </fieldset>

                                <div className="flex flex-col gap-4">
                                    <legend className="text-lg font-medium text-gray-900">Wähle einen Betrag aus</legend>

                                    <div className="flex gap-4 flex-wrap">
                                        {balances.map((b) => (
                                            <PELabelButton
                                                key={b}
                                                selected={b === balance && !showCustomBalance}
                                                title={formatPrice({ amount: b * 100, currencyCode: '€' })}
                                                onSelect={() => {
                                                    setValue('showCustomBalance', false);
                                                    setValue('balance', b);
                                                }}
                                                onDeselect={() => undefined}
                                            />
                                        ))}
                                        <PELabelButton
                                            selected={showCustomBalance}
                                            title="Einen individuellen Betrag angeben"
                                            onSelect={() => setValue('showCustomBalance', true)}
                                            onDeselect={() => undefined}
                                            className="max-w-40"
                                        />
                                    </div>

                                    {showCustomBalance && (
                                        <PENumberTextField
                                            labelTitle="Individueller Betrag"
                                            id="basePriceCustomers"
                                            errorMessage={errors.balance?.message}
                                            {...register('balance', {
                                                required: 'Ungültig',
                                                min: { value: 1, message: 'Ungültig' },
                                                max: { value: 100, message: 'Ungültig' },
                                                valueAsNumber: true,
                                            })}
                                        />
                                    )}
                                </div>

                                <PETextArea
                                    id="description"
                                    labelTitle="Eine persönliche Nachricht an den Empfänger"
                                    errorMessage={errors.message?.message}
                                    {...register('message')}
                                />

                                {!signedInUser && (
                                    <div className="flex flex-col gap-4">
                                        <legend className="text-lg font-medium text-gray-900">Rechnungsinformationen</legend>

                                        <div className="flex gap-4">
                                            <PETextField
                                                id="first-name"
                                                labelTitle="Vorname"
                                                type="text"
                                                autoComplete="given-name"
                                                errorMessage={errors.buyer?.firstName?.message}
                                                {...register('buyer.firstName', { required: 'This field is required' })}
                                            />

                                            <PETextField
                                                id="last-name"
                                                labelTitle="Nachname"
                                                type="text"
                                                autoComplete="family-name"
                                                errorMessage={errors.buyer?.lastName?.message}
                                                {...register('buyer.lastName', { required: 'This field is required' })}
                                            />
                                        </div>

                                        <PETextField
                                            id="email-address"
                                            labelTitle="E-Mail Adresse"
                                            type="email"
                                            autoComplete="email"
                                            errorMessage={errors.buyer?.emailAddress?.message}
                                            {...register('buyer.emailAddress', { required: 'This field is required' })}
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <PEButton title="Gutschein kaufen" type="submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
