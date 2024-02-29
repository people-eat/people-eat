import { PEButton } from '@people-eat/web-core-components';
import { useState } from 'react';
import { CreateAddressDialog } from './CreateAddressDialog';
import { PEProfileCard } from './PEProfileCard';

export interface PEAddressesCardProps {
    addresses: any[];
}

export function PEAddressesCard({ addresses }: PEAddressesCardProps) {
    const [showCreateAddress, setShowCreateAddress] = useState(false);

    return (
        <PEProfileCard title="Adressen" className="flex flex-col gap-8">
            {addresses.length > 0 && <div>Alle Adressen anzeigen</div>}
            {addresses.length < 1 && (
                <div className="flex flex-col gap-4">
                    <p>Wie es aussieht hast noch keine Adressen in deinem Profil hinterlegt.</p>
                    <p>Füge jetzt deine erste Adress hinzu.</p>
                    <div>
                        <PEButton title="Adresse anlegen" onClick={() => setShowCreateAddress(true)} />
                    </div>
                </div>
            )}
            <CreateAddressDialog open={showCreateAddress} onClose={() => setShowCreateAddress(false)} />
        </PEProfileCard>
    );
}
