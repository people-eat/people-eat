import { useMutation } from '@apollo/client';
import { LoadingDialog, PEHeader } from '@people-eat/web-components';
import {
    PEButton,
    PEDatePicker,
    PELabelButton,
    PELabelSingleSelection,
    PENumberTextField,
    PETextArea,
    PETextField,
} from '@people-eat/web-core-components';
import {
    ConfirmOneGiftCardDocument,
    CreateOneGiftCardDocument,
    GetGiftCardPageDataDocument,
    SignedInUser,
    formatPrice,
    toDBDateString,
} from '@people-eat/web-domain';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createApolloClient } from '../network/apolloClients';

const balances = [100, 150, 200, 300, 500];

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
        occasion: string;
        customOccasion: string;
        balance: number;
        customBalance: string;
        buyer: {
            firstName: string;
            lastName: string;
            emailAddress: string;
        };
        recipient: {
            firstName: string;
            lastName: string;
            deliveryInformation?: {
                date: Date;
                emailAddress: string;
            };
        };
    }>({
        defaultValues: {
            message: '',
            occasion: '',
            customOccasion: '',
            balance: 100,
            customBalance: '',
            buyer: {
                firstName: '',
                lastName: '',
                emailAddress: '',
            },
            recipient: {
                firstName: '',
                lastName: '',
                deliveryInformation: {
                    date: new Date(),
                    emailAddress: '',
                },
            },
        },
    });

    const { message, occasion, customOccasion, balance, customBalance, recipient, buyer } = watch();

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
                        src="/gift-cards/Privatkochgutschein.jpg"
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
                                            request: {
                                                userId: signedInUser ? signedInUser.userId : null,
                                                buyer,
                                                recipient: {
                                                    firstName: recipient.firstName,
                                                    lastName: recipient.lastName,
                                                    deliveryInformation: recipient.deliveryInformation
                                                        ? {
                                                              date: toDBDateString(recipient.deliveryInformation.date),
                                                              emailAddress: recipient.deliveryInformation.emailAddress,
                                                          }
                                                        : undefined,
                                                },
                                                balance: balance ?? customBalance,
                                                message,
                                                occasion: occasion ?? customOccasion,
                                            },
                                        },
                                    }),
                                )}
                            >
                                <div className="flex gap-4 flex-wrap">
                                    {['/gift-cards/orange.jpg'].map((imageUrl) => (
                                        <Image
                                            key={imageUrl}
                                            src={imageUrl}
                                            width={240}
                                            height={150}
                                            alt=""
                                            className={classNames('w-[240px] h-[150px] object-cover rounded-lg shadow-md', {
                                                'ring-orange-500 ring-2': true, // todo: only if selected
                                            })}
                                        />
                                    ))}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <legend className="text-lg font-medium text-gray-900">
                                        Für welchen Anlass möchtest du den Gutschein verschenken?
                                    </legend>

                                    <div className="flex flex-wrap gap-2">
                                        {['Geburtstag', 'Hochzeit', 'Candle Light Dinner', 'Abschlussfeier', 'Jahrestag'].map((o) => (
                                            <PELabelButton
                                                key={o}
                                                selected={o === occasion}
                                                title={o}
                                                onSelect={() => {
                                                    setValue('customOccasion', '');
                                                    setValue('occasion', o);
                                                }}
                                                onDeselect={() => setValue('occasion', '')}
                                            />
                                        ))}
                                    </div>

                                    <PETextField
                                        id="occasion"
                                        type="text"
                                        labelTitle="Einen anderen Anlass angeben"
                                        errorMessage={errors.customOccasion?.message}
                                        {...register('customOccasion', { onChange: () => setValue('occasion', '') })}
                                    />
                                </div>

                                <fieldset className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-4">
                                        <legend className="text-lg font-medium text-gray-900">
                                            Wem möchtest du den Gutschein schenken?
                                        </legend>

                                        <div className="flex gap-4">
                                            <PETextField
                                                id="recipient-first-name"
                                                labelTitle="Vorname"
                                                type="text"
                                                errorMessage={errors.recipient?.firstName?.message}
                                                {...register('recipient.firstName', { required: 'This field is required' })}
                                            />

                                            <PETextField
                                                id="recipient-last-name"
                                                labelTitle="Nachname"
                                                type="text"
                                                errorMessage={errors.recipient?.lastName?.message}
                                                {...register('recipient.lastName', { required: 'This field is required' })}
                                            />
                                        </div>
                                    </div>
                                </fieldset>

                                <div className="flex flex-col gap-4">
                                    <legend className="text-lg font-medium text-gray-900">
                                        Soll der Beschenkte den Gutschein zu einem gewünschten Datum per Email erhalten?
                                    </legend>
                                    <PELabelSingleSelection
                                        options={['Ja', 'Nein']}
                                        selectedOption={recipient.deliveryInformation ? 'Ja' : 'Nein'}
                                        selectedOptionChanged={(o) =>
                                            setValue(
                                                'recipient.deliveryInformation',
                                                o === 'Ja' ? { emailAddress: '', date: new Date() } : undefined,
                                            )
                                        }
                                        optionTitle={(o) => o}
                                        optionIdentifier={(o) => o}
                                    />
                                    {recipient.deliveryInformation && (
                                        <div className="flex flex-col gap-8">
                                            <div className="flex flex-col gap-4">
                                                <PETextField
                                                    labelTitle="Email Adresse"
                                                    placeholder="Email Adresse des Beschenkten"
                                                    id="email-address"
                                                    type="email"
                                                    errorMessage={errors.recipient?.deliveryInformation?.emailAddress?.message}
                                                    {...register('recipient.deliveryInformation.emailAddress', {
                                                        required: 'Bitte gib deine Email Adresse ein.',
                                                        pattern: {
                                                            value: /\S+@\S+\.\S+/,
                                                            message: 'Bitte eine gültige Email Adresse eingeben.',
                                                        },
                                                    })}
                                                />
                                            </div>

                                            <PEDatePicker
                                                labelTitle="Zustellungsdatum"
                                                date={recipient.deliveryInformation?.date}
                                                setDate={(d) => setValue('recipient.deliveryInformation.date', d)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <legend className="text-lg font-medium text-gray-900">Wähle einen Betrag aus</legend>

                                    <div className="flex gap-4 flex-wrap">
                                        {balances.map((b) => (
                                            <PELabelButton
                                                key={b}
                                                selected={b === balance}
                                                title={formatPrice({ amount: b * 100, currencyCode: '€' })}
                                                onSelect={() => {
                                                    setValue('customBalance', '');
                                                    setValue('balance', b);
                                                }}
                                                onDeselect={() => undefined}
                                            />
                                        ))}
                                    </div>

                                    <PENumberTextField
                                        labelTitle="Individueller Betrag"
                                        id="basePriceCustomers"
                                        errorMessage={errors.customBalance?.message}
                                        {...register(
                                            'customBalance',
                                            balance === 0
                                                ? {
                                                      required: 'Ungültig',
                                                      min: { value: 1, message: 'Ungültig' },
                                                      max: { value: 1000, message: 'Ungültig' },
                                                      valueAsNumber: true,
                                                      onChange: () => setValue('balance', 0),
                                                  }
                                                : { onChange: () => setValue('balance', 0) },
                                        )}
                                    />
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
                                                id="buyer-first-name"
                                                labelTitle="Vorname"
                                                type="text"
                                                autoComplete="given-name"
                                                errorMessage={errors.buyer?.firstName?.message}
                                                {...register('buyer.firstName', { required: 'This field is required' })}
                                            />

                                            <PETextField
                                                id="buyer-last-name"
                                                labelTitle="Nachname"
                                                type="text"
                                                autoComplete="family-name"
                                                errorMessage={errors.buyer?.lastName?.message}
                                                {...register('buyer.lastName', { required: 'This field is required' })}
                                            />
                                        </div>

                                        <PETextField
                                            id="buyer-email-address"
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
