import { AdminGetBookingRequestsPageDataQuery, toTranslatedFormattedDate, translatedPriceClasses, Unpacked } from '@people-eat/web-domain';
import { useState } from 'react';
import { AdminGlobalBookingRequestCooksDialog } from './AdminGlobalBookingRequestCooksDialog';
import { PEBookingDetails, PEButton, PEDialog } from '@people-eat/web-components';
import { PEChatMessage } from '../PEChatMessage';

type GlobalBookingRequest = Unpacked<NonNullable<AdminGetBookingRequestsPageDataQuery['globalBookingRequests']['findMany']>>;

export interface AdminGlobalBookingRequestsTableProps {
    globalBookingRequests: GlobalBookingRequest[];
}

export function AdminGlobalBookingRequestsTable({ globalBookingRequests }: AdminGlobalBookingRequestsTableProps) {
    // for details dialog
    const [selectedGlobalBookingRequest, setSelectedGlobalBookingRequest] = useState<GlobalBookingRequest | undefined>();

    // for matching
    const [selectedGlobalBookingRequestId, setSelectedGlobalBookingRequestId] = useState<string | undefined>();

    return (
        <table className="w-full text-left">
            <thead className="bg-white">
                <tr>
                    <th scope="col" className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                        Kunde
                        <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                        <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                    </th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                        Telefonnummer
                    </th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                        Teilnehmer
                    </th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                        Wann?
                    </th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                        Wo?
                    </th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                        Anlass
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Gesendet am
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Preisklasse
                    </th>
                </tr>
            </thead>
            <tbody>
                {globalBookingRequests.map((globalBookingRequest) => (
                    <tr
                        key={globalBookingRequest.globalBookingRequestId}
                        role="button"
                        className="hover:bg-gray-200"
                        onClick={() => setSelectedGlobalBookingRequest(globalBookingRequest)}
                    >
                        <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                            {globalBookingRequest.user.firstName}
                            <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                            <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {globalBookingRequest.user.phoneNumber ??
                                (globalBookingRequest.user.phoneNumberUpdate?.phoneNumber
                                    ? `${globalBookingRequest.user.phoneNumberUpdate.phoneNumber}` //  (nicht bestätigt)
                                    : undefined) ??
                                'Keine Angabe'}
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {globalBookingRequest.adultParticipants + globalBookingRequest.children}
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {toTranslatedFormattedDate(globalBookingRequest.dateTime)}
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{globalBookingRequest.location.text}</td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{globalBookingRequest.occasion}</td>
                        <td className="px-3 py-4 text-sm text-gray-500">{toTranslatedFormattedDate(globalBookingRequest.createdAt)}</td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {translatedPriceClasses[globalBookingRequest.priceClass.type]}
                        </td>
                    </tr>
                ))}
            </tbody>

            <PEDialog
                open={Boolean(selectedGlobalBookingRequest)}
                onClose={() => setSelectedGlobalBookingRequest(undefined)}
                title="Globale Buchungsanfrage"
            >
                {selectedGlobalBookingRequest && (
                    <>
                        <PEBookingDetails
                            occasion={selectedGlobalBookingRequest.occasion}
                            adultParticipants={selectedGlobalBookingRequest.adultParticipants}
                            // eslint-disable-next-line react/no-children-prop
                            children={selectedGlobalBookingRequest.children}
                            dateTime={selectedGlobalBookingRequest.dateTime}
                            location={selectedGlobalBookingRequest.location}
                            priceClass={selectedGlobalBookingRequest.priceClass}
                        />

                        {selectedGlobalBookingRequest.message && (
                            <PEChatMessage
                                chatMessage={{ message: selectedGlobalBookingRequest.message, generated: false }}
                                isAuthor={false}
                            />
                        )}

                        <PEButton
                            title="Anfrage matchen"
                            onClick={() => setSelectedGlobalBookingRequestId(selectedGlobalBookingRequest.globalBookingRequestId)}
                        />
                    </>
                )}
            </PEDialog>

            <AdminGlobalBookingRequestCooksDialog
                open={Boolean(selectedGlobalBookingRequestId)}
                onClose={() => setSelectedGlobalBookingRequestId(undefined)}
                globalBookingRequestId={selectedGlobalBookingRequestId!}
            />
        </table>
    );
}
