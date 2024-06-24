import {
    PEButton,
    PECheckbox,
    PELabelMultiSelection,
    PELabelSingleSelection,
    PESlider,
    PETextField,
} from '@people-eat/web-core-components';
import { CookRank, LanguageOption, SignedInUser, cookRanks, translatedCookRanks } from '@people-eat/web-domain';
import { MinusIcon, PlusIcon, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';

export interface CookSignUpFormInputs {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    password: string;
    passwordRepeat: string;
    acceptedTermsAndConditions: boolean;
    acceptedPrivacyPolicy: boolean;

    city: string;
    postCode: string;
    street: string;
    houseNumber: string;
    country: string;

    travelExpenses: number;
    maximumTravelDistance: number;
    maximumParticipants: number;
}

export interface CookSignUpFormProps {
    signedInUser?: SignedInUser | null;

    completeTitle: string;
    onSignUpForExistingUser: (formData: CookSignUpFormInputs) => void;
    onSignUpForNewUser: (formData: CookSignUpFormInputs) => void;
    onSignIn: () => void;

    languages: {
        options: LanguageOption[];
        selectedOptions: LanguageOption[];
        onChange: (changedSelectedOptions: LanguageOption[]) => void;
    };
    rank: CookRank;
    setRank: (changedRank: CookRank) => void;
}

export function CookSignUpForm({
    signedInUser,
    completeTitle,
    onSignUpForExistingUser,
    onSignUpForNewUser,
    onSignIn,
    languages,
    rank,
    setRank,
}: CookSignUpFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CookSignUpFormInputs>({
        defaultValues: {
            phoneNumber: '+49',
            country: 'Deutschland',
            maximumParticipants: 12,
            travelExpenses: 50,
            maximumTravelDistance: 15,
        },
    });

    const { travelExpenses, maximumTravelDistance, maximumParticipants, password, passwordRepeat } = watch();

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(signedInUser ? onSignUpForExistingUser : onSignUpForNewUser)}>
                <div className="flex flex-col gap-4">
                    <span className="text-lg font-semibold">Rang</span>
                    <PELabelSingleSelection
                        options={cookRanks}
                        selectedOption={rank}
                        selectedOptionChanged={(changedRank) => {
                            if (changedRank) setRank(changedRank);
                        }}
                        optionTitle={(option) => translatedCookRanks[option]}
                        optionIdentifier={(option) => option}
                    />
                </div>

                {languages.options.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <span className="text-lg font-semibold">Sprachen</span>
                        <PELabelMultiSelection
                            options={languages.options}
                            selectedOptions={languages.selectedOptions}
                            selectedOptionsChanged={languages.onChange}
                            optionTitle={({ title }) => title}
                            optionIdentifier={({ languageId }) => languageId}
                        />
                    </div>
                )}

                <PESlider
                    id="travelExpenses"
                    labelTitle="Reisekosten je gefahrener Kilometer"
                    step={1}
                    min={0}
                    max={50}
                    {...register('travelExpenses', { min: 0, max: 70, valueAsNumber: true })}
                >
                    {(travelExpenses / 100).toFixed(2)} €
                </PESlider>

                <PESlider
                    id="maximumTravelDistance"
                    labelTitle="Maximale Reisestrecke"
                    step={5}
                    min={5}
                    max={100}
                    {...register('maximumTravelDistance', { min: 5, max: 200, valueAsNumber: true })}
                >
                    {maximumTravelDistance} km
                </PESlider>

                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <Users strokeWidth={1.5} />
                        Maximale Anzahl Teilnehmer pro Einsatz
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            type="button"
                            className="rounded-full text-gray-500 ring-gray-500 hover:ring-orange-500 focus:ring-orange-500 ring-1 ring-inset p-1 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 focus-visible:text-white focus-visible:bg-orange-500"
                            onClick={() => setValue('maximumParticipants', maximumParticipants - 1)}
                            disabled={maximumParticipants < 2}
                        >
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        <span className="w-4 text-center">{maximumParticipants}</span>
                        <button
                            type="button"
                            className="rounded-full  text-gray-500 ring-gray-500 hover:ring-orange-500 focus:ring-orange-500 ring-1 ring-inset p-1 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 focus-visible:text-white focus-visible:bg-orange-500"
                            onClick={() => setValue('maximumParticipants', maximumParticipants + 1)}
                            disabled={maximumParticipants > 19}
                        >
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 flex-col md:flex-row">
                    <PETextField
                        id="postCode"
                        placeholder="Postleitzahl"
                        type="text"
                        // autoComplete=""
                        errorMessage={errors.postCode?.message}
                        {...register('postCode', { required: 'This field is required' })}
                    />

                    <PETextField
                        id="city"
                        placeholder="Stadt"
                        type="text"
                        autoComplete="city"
                        errorMessage={errors.city?.message}
                        {...register('city', { required: 'This field is required' })}
                    />
                </div>

                <div className="flex gap-4 flex-col md:flex-row">
                    <PETextField
                        id="street"
                        placeholder="Straße"
                        type="text"
                        // autoComplete=""
                        errorMessage={errors.street?.message}
                        {...register('street', { required: 'This field is required' })}
                    />

                    <PETextField
                        id="houseNumber"
                        placeholder="Hausnummer"
                        type="text"
                        // autoComplete=""
                        errorMessage={errors.houseNumber?.message}
                        {...register('houseNumber', { required: 'This field is required' })}
                    />
                </div>

                <PETextField
                    id="country"
                    placeholder="Land"
                    type="text"
                    autoComplete="country"
                    errorMessage={errors.country?.message}
                    {...register('country', { required: 'This field is required' })}
                />

                {!signedInUser && (
                    <>
                        <div className="flex gap-4">
                            <PETextField
                                id="first-name"
                                labelTitle="Vorname"
                                type="text"
                                autoComplete="given-name"
                                errorMessage={errors.firstName?.message}
                                {...register('firstName', { required: 'This field is required' })}
                            />

                            <PETextField
                                id="last-name"
                                labelTitle="Nachname"
                                type="text"
                                autoComplete="family-name"
                                errorMessage={errors.lastName?.message}
                                {...register('lastName', { required: 'This field is required' })}
                            />
                        </div>

                        <PETextField
                            id="email-address"
                            labelTitle="E-Mail Adresse"
                            type="email"
                            autoComplete="email"
                            errorMessage={errors.emailAddress?.message}
                            {...register('emailAddress', { required: 'This field is required' })}
                        />

                        <PETextField
                            id="phone-number"
                            labelTitle="Telefonnummer"
                            placeholder="+49"
                            type="tel"
                            autoComplete="tel"
                            errorMessage={errors.phoneNumber?.message}
                            {...register('phoneNumber', {
                                required: 'This field is required',
                                pattern: {
                                    value: /\+49\d+/,
                                    message: 'Keine gültige Ländervorwahl (z.B +49).',
                                },
                                onChange: (event) => (event.target.value = event.target.value.replaceAll(' ', '')),
                            })}
                        />

                        <PETextField
                            id="password"
                            labelTitle="Passwort"
                            type="password"
                            autoComplete="new-password"
                            errorMessage={errors.password?.message}
                            {...register('password', {
                                required: 'This field is required',
                                validate: (value) => value === passwordRepeat || 'Passwörter stimmen nicht miteinander überein',
                            })}
                        />

                        <PETextField
                            id="password-repeat"
                            labelTitle="Passwort wiederholen"
                            type="password"
                            autoComplete=""
                            errorMessage={errors.passwordRepeat?.message}
                            {...register('passwordRepeat', {
                                required: 'This field is required',
                                validate: (value) => value === password || 'Passwörter stimmen nicht miteinander überein',
                            })}
                        />
                    </>
                )}

                <fieldset className="space-y-5">
                    <PECheckbox
                        id="accepted-terms-and-conditions"
                        label={{
                            title: 'Allgemeine Geschäftsbedingungen',
                            description: 'Ich habe die allgemeinen Geschäftsbedingungen gelesen und akzeptiere sie',
                        }}
                        errorMessage={errors.acceptedTermsAndConditions?.message}
                        {...register('acceptedTermsAndConditions', {
                            required: 'Die allgemeinen Geschäftsbedingungen müssen akzeptiert werden um fortzufahren',
                        })}
                    />
                    <PECheckbox
                        id="accepted-privacy-policy"
                        label={{
                            title: 'Datenschutzerklärung',
                            description: 'Ich habe die Datenschutzerklärung gelesen und akzeptiere sie',
                        }}
                        errorMessage={errors.acceptedPrivacyPolicy?.message}
                        {...register('acceptedPrivacyPolicy', {
                            required: 'Die Datenschutzerklärung muss akzeptiert werden um fortzufahren',
                        })}
                    />
                </fieldset>

                {/* {acceptedTermsAndConditions ? 'acceptedTermsAndConditions on' : 'acceptedTermsAndConditions off'}
                {acceptedPrivacyPolicy ? 'acceptedPrivacyPolicy on' : 'acceptedPrivacyPolicy off'} */}

                <PEButton title={completeTitle} type="submit" />
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
                Du hast bereits ein Profil?{' '}
                <button type="button" className="font-semibold leading-6 text-orange-600 hover:text-orange-500" onClick={onSignIn}>
                    Hier anmelden
                </button>
            </p>
        </div>
    );
}
