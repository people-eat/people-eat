import { useMutation } from '@apollo/client';
import { LoadingDialog } from '@people-eat/web-components';
import { PEAlert, PEButton } from '@people-eat/web-core-components';
import { DeleteOneUserAddressDocument, UpdateCookLocationDocument } from '@people-eat/web-domain';
import { Home, Pin, Trash } from 'lucide-react';
import { useState } from 'react';
import { CreateAddressDialog } from './CreateAddressDialog';
import { PEProfileCard } from './PEProfileCard';

interface Address {
    addressId: string;
    title: string;
    country: string;
    city: string;
    postCode: string;
    street: string;
    houseNumber: string;
    createdAt: Date;
    location: {
        latitude: number;
        longitude: number;
    };
}

export interface PEProfileAddressesCardProps {
    userId: string;
    addresses: Address[];
    pinnedLocation?: {
        latitude: number;
        longitude: number;
    };
    onFetchUpdated: () => void;
}

interface AddressPreviewCardProps {
    address: Address;
    onDelete: () => void;
    onPin: () => void;
    isPinned: boolean;
}

function AddressPreviewCard({ address, onDelete, onPin, isPinned }: AddressPreviewCardProps) {
    return (
        <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
                <Home />
                <div>
                    <div className="text-lg font-semibold">{address.title}</div>
                    <div>
                        {address.postCode} {address.city}, {address.street} {address.houseNumber}, {address.country}
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                {!isPinned && (
                    <button onClick={onDelete}>
                        <Trash />
                    </button>
                )}
                <button onClick={onPin}>
                    <Pin fill={isPinned ? 'black' : 'none'} />
                </button>
            </div>
        </div>
    );
}

export function PEProfileAddressesCard({ userId, addresses, pinnedLocation, onFetchUpdated }: PEProfileAddressesCardProps) {
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();
    const [showCreateAddress, setShowCreateAddress] = useState(false);
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(false);
    const [showPinConfirmation, setShowPinConfirmation] = useState(false);

    const [deleteAddress, { loading: deleteLoading }] = useMutation(DeleteOneUserAddressDocument);
    const [updateCookLocation, { loading: updateLocationLoading }] = useMutation(UpdateCookLocationDocument);

    const loading = deleteLoading || updateLocationLoading;

    return (
        <PEProfileCard title="Adressen" className="flex flex-col gap-8">
            {addresses.map((address) => (
                <AddressPreviewCard
                    key={address.addressId}
                    address={address}
                    isPinned={
                        pinnedLocation
                            ? pinnedLocation.latitude === address.location.latitude &&
                              pinnedLocation.longitude === address.location.longitude
                            : false
                    }
                    onDelete={() => {
                        setShowDeletionConfirmation(true);
                        setSelectedAddress(address);
                    }}
                    onPin={() => {
                        setShowPinConfirmation(true);
                        setSelectedAddress(address);
                    }}
                />
            ))}

            {addresses.length < 1 && (
                <div className="flex flex-col gap-4">
                    <p>Wie es aussieht hast noch keine Adressen in deinem Profil hinterlegt.</p>
                    <p>Füge jetzt deine erste Adresse hinzu.</p>
                </div>
            )}

            <div>
                <PEButton title="Adresse anlegen" onClick={() => setShowCreateAddress(true)} />
            </div>

            <CreateAddressDialog
                userId={userId}
                open={showCreateAddress}
                onAbort={() => setShowCreateAddress(false)}
                onComplete={() => {
                    onFetchUpdated();
                    setShowCreateAddress(false);
                }}
            />

            <PEAlert
                open={showDeletionConfirmation}
                type="DELETION"
                title="Adresse löschen?"
                subtitle="Diese Aktion kann nicht umgekehrt werden."
                primaryButton={{
                    title: 'Löschen',
                    onClick: () =>
                        deleteAddress({ variables: { userId, addressId: selectedAddress!.addressId } }).then(({ data }) => {
                            if (data?.users.addresses.success) {
                                onFetchUpdated();
                                setShowDeletionConfirmation(false);
                            }
                        }),
                }}
                secondaryButton={{
                    title: 'Abbrechen',
                    onClick: () => {
                        setShowDeletionConfirmation(false);
                        setSelectedAddress(undefined);
                    },
                }}
            />

            <PEAlert
                open={showPinConfirmation}
                type="DELETION"
                title="Adresse als öffentlichen Standort verwenden?"
                subtitle="Mit dieser Aktion wird diese Adresse als Grundlage für die Berechnung deiner maximalen Reisestrecke zu Kunden verwendet."
                primaryButton={{
                    title: 'Ändern',
                    onClick: () =>
                        updateCookLocation({
                            variables: {
                                cookId: userId,
                                location: { latitude: selectedAddress!.location.latitude, longitude: selectedAddress!.location.longitude },
                            },
                        }).then(({ data }) => {
                            if (data?.cooks.success) {
                                onFetchUpdated();
                                setShowPinConfirmation(false);
                            }
                        }),
                }}
                secondaryButton={{
                    title: 'Abbrechen',
                    onClick: () => {
                        setShowPinConfirmation(false);
                        setSelectedAddress(undefined);
                    },
                }}
            />

            <LoadingDialog active={loading} />
        </PEProfileCard>
    );
}
