import { useForm } from 'react-hook-form';
import { PEButton, PETextField } from '../_core';

export interface SignInFormInputs {
    emailAddress: string;
    password: string;
}

export interface SignInFormProps {
    completeTitle: string;
    onSignIn: (formData: SignInFormInputs) => void;
    onSignUp: () => void;
    onForgotPassword?: () => void;
}

export function SignInForm({ completeTitle, onSignIn, onSignUp, onForgotPassword }: SignInFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormInputs>();

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSignIn)}>
                <PETextField
                    id="email-address"
                    labelTitle="E-Mail Adresse"
                    type="email"
                    autoComplete="email"
                    errorMessage={errors.emailAddress?.message}
                    {...register('emailAddress', { required: 'This field is required' })}
                />

                <div className="flex flex-col">
                    <PETextField
                        id="password"
                        labelTitle="Passwort"
                        type="password"
                        autoComplete="current-password"
                        errorMessage={errors.emailAddress?.message}
                        {...register('password', { required: 'This field is required' })}
                    />
                    {onForgotPassword && (
                        <button
                            type="button"
                            className="text-end text-sm font-semibold text-orange-600 hover:text-orange-500"
                            onClick={onForgotPassword}
                        >
                            Passwort vergessen?
                        </button>
                    )}
                </div>

                <PEButton title={completeTitle} type="submit" />
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
                Du hast noch kein Profil?{' '}
                <button type="button" className="font-semibold leading-6 text-orange-600 hover:text-orange-500" onClick={onSignUp}>
                    Hier registrieren
                </button>
            </p>
        </div>
    );
}
