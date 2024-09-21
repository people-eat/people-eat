import { useForm } from 'react-hook-form';
import { PEButton, PETextField } from '../_core';

interface PEEditPasswordFormInputs {
    password: string;
    passwordRepeat: string;
}

export interface EditPasswordFormProps {
    onComplete: (password: string) => void;
    showAbort?: boolean;
}

export function EditPasswordForm({ onComplete, showAbort }: EditPasswordFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PEEditPasswordFormInputs>({ defaultValues: { password: '', passwordRepeat: '' } });

    const { password, passwordRepeat } = watch();

    function resetForm() {
        setValue('password', '');
        setValue('passwordRepeat', '');
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(({ password }) => onComplete(password))}>
            <div className="flex gap-4 justify-stretch items-end">
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
            </div>

            {(password.length > 0 || passwordRepeat.length > 0) && (
                <div className="flex justify-end gap-2">
                    {showAbort && <PEButton title="Verwerfen" type="secondary" onClick={resetForm} />}
                    <PEButton title="Passwort ändern" type="submit" />
                </div>
            )}
        </form>
    );
}
