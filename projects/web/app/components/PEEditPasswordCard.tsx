import { PEButton, PETextField } from '@people-eat/web-core-components';
import { useForm } from 'react-hook-form';
import { PEProfileCard } from './PEProfileCard';

interface PEEditPasswordFormProps {
    password: string;
    passwordRepeat: string;
}

export function PEEditPasswordCard() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PEEditPasswordFormProps>({ defaultValues: { password: '', passwordRepeat: '' } });

    function onChange(data: PEEditPasswordFormProps) {}

    const { password, passwordRepeat } = watch();

    function resetForm() {
        setValue('password', '');
        setValue('passwordRepeat', '');
    }

    return (
        <PEProfileCard title="Passwort ändern" className="flex flex-col gap-8">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onChange)}>
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
                        <PEButton title="Verwerfen" type="secondary" onClick={resetForm} />
                        <PEButton title="Passwort ändern" type="submit" />
                    </div>
                )}
            </form>
        </PEProfileCard>
    );
}
