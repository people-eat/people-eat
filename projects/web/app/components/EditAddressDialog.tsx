import { EditAddressForm, EditAddressFormInputs } from '@people-eat/web-components';
import { PEDialog } from '@people-eat/web-components';

export interface EditAddressDialogProps {
    open: boolean;
    onClose: () => void;
    current: EditAddressFormInputs;
}

export function EditAddressDialog({ open, onClose, current }: EditAddressDialogProps) {
    return (
        <PEDialog open={open} onClose={onClose} title="Adresse bearbeiten">
            <EditAddressForm onCreate={() => undefined} isLoadingSuggestions={false} current={current} />
        </PEDialog>
    );
}
