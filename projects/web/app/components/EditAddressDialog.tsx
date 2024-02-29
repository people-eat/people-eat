import { EditAddressForm, EditAddressFormInputs } from '@people-eat/web-components';
import { PEDialog } from '@people-eat/web-core-components';
import classNames from 'classnames';

export interface EditAddressDialogProps {
    open: boolean;
    onClose: () => void;
    current: EditAddressFormInputs;
}

export function EditAddressDialog({ open, onClose, current }: EditAddressDialogProps) {
    return (
        <PEDialog open={open} onClose={onClose} className={classNames('flex flex-col gap-8 p-8', 'bg-white rounded-2xl')}>
            <h1 className="text-xl font-semibold">Adresse bearbeiten</h1>
            <EditAddressForm onCreate={() => undefined} isLoadingSuggestions={false} current={current} />
        </PEDialog>
    );
}
