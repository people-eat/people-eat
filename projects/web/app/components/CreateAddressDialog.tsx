import { CreateAddressForm } from '@people-eat/web-components';
import { PEDialog } from '@people-eat/web-core-components';
import classNames from 'classnames';

export interface CreateAddressDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateAddressDialog({ open, onClose }: CreateAddressDialogProps) {
    return (
        <PEDialog open={open} onClose={onClose} className={classNames('flex flex-col gap-8 p-8', 'bg-white rounded-2xl')}>
            <h1 className="text-xl font-semibold">Adresse hinzufügen</h1>
            <CreateAddressForm onCreate={() => undefined} isLoadingSuggestions={false} />
        </PEDialog>
    );
}
