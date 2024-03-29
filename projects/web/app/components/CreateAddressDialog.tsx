import { useMutation } from '@apollo/client';
import { CreateAddressForm, CreateAddressFormInputs, LoadingDialog } from '@people-eat/web-components';
import { PEDialog } from '@people-eat/web-core-components';
import { CreateOneUserAddressDocument } from '@people-eat/web-domain';
import classNames from 'classnames';

function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export interface CreateAddressDialogProps {
    userId: string;
    open: boolean;
    onAbort: () => void;
    onComplete: () => void;
}

export function CreateAddressDialog({ userId, open, onAbort, onComplete }: CreateAddressDialogProps) {
    const [create, { loading }] = useMutation(CreateOneUserAddressDocument);

    function onCreate({ title, postCode, city, street, houseNumber, country }: CreateAddressFormInputs) {
        create({
            variables: {
                userId,
                address: {
                    title,
                    postCode,
                    city,
                    street,
                    houseNumber,
                    country,
                    location: { latitude: randomIntFromInterval(40, 50), longitude: randomIntFromInterval(6, 9) },
                },
            },
        }).then(({ data }) => {
            if (data?.users.addresses.success) {
                onComplete();
            }
        });
    }

    return (
        <PEDialog open={open} onClose={onAbort} className={classNames('flex flex-col gap-8 p-8', 'bg-white rounded-2xl')}>
            <h1 className="text-xl font-semibold">Adresse hinzufügen</h1>
            <CreateAddressForm onCreate={onCreate} isLoadingSuggestions={false} />
            <LoadingDialog active={loading} />
        </PEDialog>
    );
}
