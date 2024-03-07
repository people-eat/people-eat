import { PEButton, PETextField } from '@people-eat/web-core-components';
import { useForm } from 'react-hook-form';

export interface SignUpFormInputs {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    password: string;
    passwordRepeat: string;
    acceptedTermsAndConditions: boolean;
    acceptedPrivacyPolicy: boolean;
}

export interface SignUpFormProps {
    completeTitle: string;
    onSignUp: (formData: SignUpFormInputs) => void;
    onSignIn: () => void;
}

export function SignUpForm({ completeTitle, onSignUp, onSignIn }: SignUpFormProps) {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<SignUpFormInputs>();

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSignUp)}>
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
                    type="tel"
                    autoComplete="tel"
                    errorMessage={errors.phoneNumber?.message}
                    {...register('phoneNumber', {
                        required: 'This field is required',
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
                        validate: (value) => value === getValues('passwordRepeat') || 'Passwörter stimmen nicht miteinander überein',
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
                        validate: (value) => value === getValues('password') || 'Passwörter stimmen nicht miteinander überein',
                    })}
                />

                <fieldset>
                    <legend className="sr-only">Notifications</legend>
                    <div className="space-y-5">
                        <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    id="comments"
                                    aria-describedby="comments-description"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                                    {...register('acceptedTermsAndConditions', { required: 'This field is required' })}
                                />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                                <label htmlFor="comments" className="font-medium text-gray-900">
                                    Allgemeine Geschäftsbedingungen
                                </label>
                                <p id="comments-description" className="text-gray-500">
                                    Ich habe die allgemeinen Geschäftsbedingungen gelesen und akzeptiere sie
                                </p>
                                {errors.acceptedTermsAndConditions && (
                                    <span className="mt-1 text-sm font-semibold text-red-600">
                                        {errors.acceptedTermsAndConditions.message}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    id="candidates"
                                    aria-describedby="candidates-description"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                                    {...register('acceptedPrivacyPolicy', { required: 'This field is required' })}
                                />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                                <label htmlFor="candidates" className="font-medium text-gray-900">
                                    Datenschutzerklärung
                                </label>
                                <p id="candidates-description" className="text-gray-500">
                                    Ich habe die Datenschutzerklärung gelesen und akzeptiere sie
                                </p>
                                {errors.acceptedPrivacyPolicy && (
                                    <span className="mt-1 text-sm font-semibold text-red-600">{errors.acceptedPrivacyPolicy.message}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </fieldset>

                <PEButton title={completeTitle} type="submit" />
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
                Du hast bereits ein Profil?{' '}
                <button className="font-semibold leading-6 text-orange-600 hover:text-orange-500" onClick={onSignIn}>
                    Hier anmelden
                </button>
            </p>
        </div>
    );
}
