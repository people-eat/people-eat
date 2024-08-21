import { useMutation, useQuery } from '@apollo/client';
import { LoadingDialog } from '@people-eat/web-components';
import { PEAlert, PEButton, PEDialog } from '@people-eat/web-components';
import { AdminGetCooksDocument, CreateBookingRequestByGlobalBookingRequestIdDocument } from '@people-eat/web-domain';
import Router from 'next/router';
import { useState } from 'react';
import { AdminGlobalBookingRequestCookMenusDialog } from './AdminGlobalBookingRequestCookMenusDialog';

export interface AdminGlobalBookingRequestDialogProps {
    open: boolean;
    onClose: () => void;
    globalBookingRequestId: string;
}

export function AdminGlobalBookingRequestCooksDialog({ open, onClose, globalBookingRequestId }: AdminGlobalBookingRequestDialogProps) {
    const [selectedCookId, setSelectedCookId] = useState<string | undefined>();

    const { loading: getCooksLoading, data: getCooksData } = useQuery(AdminGetCooksDocument);
    const [createBookingRequest, { loading: createBookingRequestLoading, data: createBookingRequestData, reset }] = useMutation(
        CreateBookingRequestByGlobalBookingRequestIdDocument,
    );

    const loading = getCooksLoading || createBookingRequestLoading;

    const showSuccessAlert = createBookingRequestData?.cooks.bookingRequests.success ?? false;
    const showFailedAlert = createBookingRequestData ? !createBookingRequestData?.cooks.bookingRequests.success : false;

    return (
        <>
            <AdminGlobalBookingRequestCookMenusDialog
                open={Boolean(selectedCookId)}
                onClose={() => setSelectedCookId(undefined)}
                globalBookingRequestId={globalBookingRequestId}
                cookId={selectedCookId!}
            />

            <LoadingDialog active={loading} />

            <PEAlert
                open={showSuccessAlert}
                title="Anfrage erfolgreich gematcht"
                subtitle="Die Globale Buchungsanfrage verschwindet nun aus der Liste dieser Seite. Sie taucht in den normalen Buchungsanfragen auf."
                primaryButton={{ title: 'Fertig', onClick: () => Router.reload() }}
            />

            <PEAlert
                type="ERROR"
                open={showFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Bitte versuche es später erneut"
                primaryButton={{ title: 'Erneut versuchen', onClick: () => reset() }}
            />

            <PEDialog open={open} onClose={onClose} title="Globale Anfrage matchen">
                <table className="w-full text-left">
                    <thead className="bg-white">
                        <tr>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                Vorname
                            </th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                Nachname
                            </th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                Öffentlich
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Stadt
                            </th>
                            <th scope="col" className="px-3 py-3.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {getCooksData?.cooks.findMany?.map((cook) => (
                            <tr key={cook.cookId}>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{cook.user.firstName}</td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{cook.user.lastName}</td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{cook.isVisible ? 'Ja' : 'Nein'}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{cook.city}</td>
                                <td className="px-3 py-4 text-sm flex gap-4">
                                    <PEButton
                                        title="Match"
                                        type="primary"
                                        onClick={() =>
                                            createBookingRequest({
                                                variables: {
                                                    globalBookingRequestId,
                                                    cookId: cook.cookId,
                                                },
                                            })
                                        }
                                    />
                                    <PEButton title="Menüs" type="secondary" onClick={() => setSelectedCookId(cook.cookId)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </PEDialog>
        </>
    );
}
