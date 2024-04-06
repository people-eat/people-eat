import { PEButton, PECheckbox, PETextField } from '@people-eat/web-core-components';
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
                    placeholder="+49"
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
