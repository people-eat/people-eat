import { useMutation } from '@apollo/client';
import { CreateMealForm, LoadingDialog } from '@people-eat/web-components';
import { PEAlert, PEDialog } from '@people-eat/web-core-components';
import { CreateMealDocument } from '@people-eat/web-domain';

export interface CreateMealDialogProps {
    cookId: string;
    open: boolean;
    onClose: (reloadMeals: boolean) => void;
}

export function CreateMealDialog({ cookId, open, onClose }: CreateMealDialogProps) {
    const [createOneCookMeal, { loading, data, reset }] = useMutation(CreateMealDocument);

    const showSuccessAlert = data?.cooks.meals.success ?? false;
    const showFailedAlert = data ? !data.cooks.meals.success : false;

    function afterSuccessfulCreation() {
        onClose(true);
        reset();
    }

    function afterFailedCreation() {
        reset();
    }

    return (
        <>
            <PEAlert
                open={showSuccessAlert}
                title="Gericht erfolgreich angelegt"
                subtitle="Füge es gleich einem neuen oder einem deiner bestehenden Menüs als Option hinzu."
                primaryButton={{
                    title: 'Fertig',
                    onClick: afterSuccessfulCreation,
                }}
            />

            <PEAlert
                open={showFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Bitte versuche es später erneut"
                primaryButton={{ title: 'Erneut versuchen', onClick: afterFailedCreation }}
            />

            <LoadingDialog active={loading} />

            <PEDialog open={open} onClose={() => onClose(false)} title="Gericht erstellen">
                <h1 className="font-bold text-3xl tracking-tight text-gray-900"></h1>

                <CreateMealForm
                    onCreate={({ title, description, type, image }) =>
                        createOneCookMeal({ variables: { cookId, meal: { title, description, type }, image } })
                    }
                />
            </PEDialog>
        </>
    );
}
