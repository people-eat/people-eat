import { useMutation } from '@apollo/client';
import { CreateAddressForm, CreateAddressFormInputs, LoadingDialog } from '@people-eat/web-components';
import { PEDialog } from '@people-eat/web-core-components';
import { CreateOneUserAddressDocument } from '@people-eat/web-domain';
import classNames from 'classnames';
import getLocationSuggestions from '../network/getLocationSuggestions';
import { useState } from 'react';

export interface CreateAddressDialogProps {
    userId: string;
    open: boolean;
    onAbort: () => void;
    onComplete: () => void;
}

export function CreateAddressDialog({ userId, open, onAbort, onComplete }: CreateAddressDialogProps) {
    const [create, { loading: createMutationLoading }] = useMutation(CreateOneUserAddressDocument);
    const [googleMapsLoading, setGoogleMapsLoading] = useState(false);
    const loading = createMutationLoading || googleMapsLoading;

    function onCreate({ title, postCode, city, street, houseNumber, country }: CreateAddressFormInputs) {
        setGoogleMapsLoading(true);
        getLocationSuggestions(`${postCode} ${city}, ${street} ${houseNumber}, ${country}`, ([firstResult]) => {
            setGoogleMapsLoading(false);
            console.log({ query: `${postCode} ${city}, ${street} ${houseNumber}, ${country}`, firstResult });
            if (!firstResult) return;

            const { latitude, longitude } = firstResult;

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
                        location: { latitude, longitude },
                    },
                },
            }).then(({ data }) => {
                if (data?.users.addresses.success) {
                    onComplete();
                }
            });
        });
    }

    return (
        <PEDialog
            open={open}
            onClose={onAbort}
            title="Adresse hinzufügen"
            className={classNames('flex flex-col gap-8 p-8', 'bg-white rounded-2xl')}
        >
            <CreateAddressForm onCreate={onCreate} isLoadingSuggestions={false} />
            <LoadingDialog active={loading} />
        </PEDialog>
    );
}
