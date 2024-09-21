import { useMutation } from '@apollo/client';
import { EditPasswordForm, LoadingDialog, PEAlert } from '@people-eat/web-components';
import { UpdateUserPasswordDocument } from '@people-eat/web-domain';
import { PEProfileCard } from './PEProfileCard';

export interface PEEditPasswordCardProps {
    userId: string;
}

export function PEEditPasswordCard({ userId }: PEEditPasswordCardProps) {
    const [updateUserPassword, { loading, data, reset }] = useMutation(UpdateUserPasswordDocument);
    const success = data?.users.success ?? false;
    const failed = data ? !data.users.success : false;

    return (
        <PEProfileCard title="Passwort ändern" className="flex flex-col gap-8">
            <LoadingDialog active={loading} />

            <PEAlert
                open={success}
                title="Passwort erfolgreich geändert"
                primaryButton={{
                    title: 'Schließen',
                    onClick: () => {
                        reset();
                        // resetForm();
                    },
                }}
            />

            <PEAlert
                open={failed}
                type="ERROR"
                title="Passwort konnte nicht geändert"
                primaryButton={{ title: 'Erneut versuchen', onClick: reset }}
            />

            <EditPasswordForm onComplete={(password) => updateUserPassword({ variables: { password, userId } })} showAbort />
        </PEProfileCard>
    );
}
