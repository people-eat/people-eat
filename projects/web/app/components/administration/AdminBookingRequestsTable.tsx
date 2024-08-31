import { ConfiguredMenuPanel, PEBookingDetails, PEDialog, PETabSingleSelection } from '@people-eat/web-components';
import { AdminGetBookingRequestsPageDataQuery, formatPrice, toTranslatedFormattedDate, Unpacked } from '@people-eat/web-domain';
import { useState } from 'react';

type BookingRequest = Unpacked<NonNullable<AdminGetBookingRequestsPageDataQuery['bookingRequests']['findMany']>>;

export interface AdminBookingRequestsTableProps {
    bookingRequests: BookingRequest[];
}

type AdminBookingRequestTab = 'EVENT_DETAILS' | 'MENU';

const adminBookingRequestTabs: AdminBookingRequestTab[] = ['EVENT_DETAILS', 'MENU'];
const adminBookingRequestTabsWithoutMenu: AdminBookingRequestTab[] = ['EVENT_DETAILS'];

const adminBookingRequestTabTranslation: Record<AdminBookingRequestTab, string> = {
    EVENT_DETAILS: 'Veranstaltung',
    MENU: 'Menü',
};

export function AdminBookingRequestsTable({ bookingRequests }: AdminBookingRequestsTableProps) {
    const [selectedBookingRequest, setSelectedBookingRequest] = useState<BookingRequest | undefined>();
    const [selectedTab, setSelectedTab] = useState<AdminBookingRequestTab>('EVENT_DETAILS');

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
                        Telefonnummer Kunde
                    </th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                        Telefonnummer Koch
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
                        Preis
                    </th>
                </tr>
            </thead>
            <tbody>
                {bookingRequests.map((bookingRequest) => (
                    <tr
                        key={bookingRequest.globalBookingRequestId}
                        role="button"
                        className="hover:bg-gray-200"
                        onClick={() => setSelectedBookingRequest(bookingRequest)}
                    >
                        <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                            {bookingRequest.user.firstName}
                            <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                            <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {bookingRequest.user.phoneNumber ??
                                (bookingRequest.user.phoneNumberUpdate?.phoneNumber
                                    ? `${bookingRequest.user.phoneNumberUpdate.phoneNumber}` //  (nicht bestätigt)
                                    : undefined) ??
                                'Keine Angabe'}
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {bookingRequest.cook.user.phoneNumber ??
                                (bookingRequest.cook.user.phoneNumberUpdate?.phoneNumber
                                    ? `${bookingRequest.cook.user.phoneNumberUpdate.phoneNumber}` //  (nicht bestätigt)
                                    : undefined) ??
                                'Keine Angabe'}
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {bookingRequest.adultParticipants + bookingRequest.children}
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {toTranslatedFormattedDate(bookingRequest.dateTime)}
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{bookingRequest.location.text}</td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{bookingRequest.occasion}</td>
                        <td className="px-3 py-4 text-sm text-gray-500">{toTranslatedFormattedDate(bookingRequest.createdAt)}</td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {formatPrice(bookingRequest.totalPriceCustomer, true)}
                        </td>
                    </tr>
                ))}
            </tbody>

            <PEDialog open={Boolean(selectedBookingRequest)} onClose={() => setSelectedBookingRequest(undefined)} title="Buchungsanfrage">
                {selectedBookingRequest && (
                    <>
                        <PETabSingleSelection
                            options={selectedBookingRequest.configuredMenu ? adminBookingRequestTabs : adminBookingRequestTabsWithoutMenu}
                            selectedOption={selectedTab}
                            selectedOptionChanged={(tab) => tab && setSelectedTab(tab)}
                            optionTitle={(o) => adminBookingRequestTabTranslation[o]}
                            optionIdentifier={(o) => o}
                        />

                        {selectedTab === 'EVENT_DETAILS' && (
                            <PEBookingDetails
                                status={selectedBookingRequest.status}
                                occasion={selectedBookingRequest.occasion}
                                adultParticipants={selectedBookingRequest.adultParticipants}
                                // eslint-disable-next-line react/no-children-prop
                                children={selectedBookingRequest.children}
                                dateTime={selectedBookingRequest.dateTime}
                                location={selectedBookingRequest.location}
                                price={selectedBookingRequest.totalPriceCustomer}
                                payoutPrice={selectedBookingRequest.totalPriceCook}
                                travelExpenses={selectedBookingRequest.travelExpenses}
                            />
                        )}

                        {selectedTab === 'MENU' && selectedBookingRequest.configuredMenu && (
                            <ConfiguredMenuPanel configuredMenu={selectedBookingRequest.configuredMenu} />
                        )}
                    </>
                )}
            </PEDialog>
        </table>
    );
}
