import { useMutation } from '@apollo/client';
import { LoadingDialog } from '@people-eat/web-components';
import { PEAlert, PEButton, PETextField } from '@people-eat/web-components';
import { UpdateUserPasswordDocument } from '@people-eat/web-domain';
import { useForm } from 'react-hook-form';
import { PEProfileCard } from './PEProfileCard';

export interface PEEditPasswordCard {
    userId: string;
}

interface PEEditPasswordFormProps {
    password: string;
    passwordRepeat: string;
}

export function PEEditPasswordCard({ userId }: PEEditPasswordCard) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PEEditPasswordFormProps>({ defaultValues: { password: '', passwordRepeat: '' } });

    const { password, passwordRepeat } = watch();

    function resetForm() {
        setValue('password', '');
        setValue('passwordRepeat', '');
    }

    const [updateUserPassword, { loading, data, reset }] = useMutation(UpdateUserPasswordDocument);
    const success = data?.users.success ?? false;
    const failed = data ? !data.users.success : false;

    return (
        <PEProfileCard title="Passwort ändern" className="flex flex-col gap-8">
            <LoadingDialog active={loading} />

            <PEAlert
                open={success}
                title="Passwort efolgreich geändert"
                primaryButton={{
                    title: 'Schließen',
                    onClick: () => {
                        reset();
                        resetForm();
                    },
                }}
            />
            <PEAlert
                open={failed}
                type="ERROR"
                title="Passwort konnte nicht geändert"
                primaryButton={{ title: 'Erneut versuchen', onClick: reset }}
            />

            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(({ password }) => updateUserPassword({ variables: { userId, password } }))}
            >
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
