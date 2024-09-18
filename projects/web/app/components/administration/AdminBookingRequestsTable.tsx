import { ConfiguredMenuPanel, PEBookingDetails, PEDialog, PELabelMultiSelection, PETabSingleSelection } from '@people-eat/web-components';
import { AdminGetBookingRequestsPageDataQuery, formatPrice, toTranslatedFormattedDate, Unpacked } from '@people-eat/web-domain';
import classNames from 'classnames';
import { Copy } from 'lucide-react';
import { useState } from 'react';

type BookingRequest = Unpacked<NonNullable<AdminGetBookingRequestsPageDataQuery['bookingRequests']['findMany']>>;

export interface AdminBookingRequestsTableProps {
    bookingRequests: BookingRequest[];
}

type AdminBookingRequestTab = 'EVENT_DETAILS' | 'MENU' | 'CUSTOMER' | 'COOK';

const adminBookingRequestTabs: AdminBookingRequestTab[] = ['EVENT_DETAILS', 'MENU', 'CUSTOMER', 'COOK'];
const adminBookingRequestTabsWithoutMenu: AdminBookingRequestTab[] = ['EVENT_DETAILS', 'CUSTOMER', 'COOK'];

const adminBookingRequestTabTranslation: Record<AdminBookingRequestTab, string> = {
    EVENT_DETAILS: 'Veranstaltung',
    MENU: 'Menü',
    CUSTOMER: 'Kunde',
    COOK: 'Koch',
};

type BookingRequestColumn =
    | 'CUSTOMER_FIRST_NAME'
    | 'CUSTOMER_PHONE_NUMBER'
    | 'COOK_FIRST_NAME'
    | 'COOK_PHONE_NUMBER'
    | 'PARTICIPANTS_TOTAL'
    | 'PARTICIPANTS_CHILDREN'
    | 'PARTICIPANTS_ADULTS'
    | 'EVENT_DATE'
    | 'LOCATION'
    | 'OCCASION'
    | 'CREATED_AT'
    | 'PRICE';

const bookingRequestColumns: BookingRequestColumn[] = [
    'CUSTOMER_FIRST_NAME',
    'CUSTOMER_PHONE_NUMBER',
    'COOK_FIRST_NAME',
    'COOK_PHONE_NUMBER',
    'PARTICIPANTS_TOTAL',
    'PARTICIPANTS_CHILDREN',
    'PARTICIPANTS_ADULTS',
    'EVENT_DATE',
    'LOCATION',
    'OCCASION',
    'CREATED_AT',
    'PRICE',
];

const defaultBookingRequestColumns: BookingRequestColumn[] = [
    'CUSTOMER_FIRST_NAME',
    'COOK_FIRST_NAME',
    'PARTICIPANTS_TOTAL',
    'EVENT_DATE',
    'LOCATION',
    'OCCASION',
    'CREATED_AT',
    'PRICE',
];

const bookingRequestColumnTitles: Record<BookingRequestColumn, string> = {
    CUSTOMER_FIRST_NAME: 'Kunde',
    CUSTOMER_PHONE_NUMBER: 'Telefonnummer Kunde',
    COOK_FIRST_NAME: 'Koch',
    COOK_PHONE_NUMBER: 'Telefonnummer Koch',
    PARTICIPANTS_TOTAL: 'Teilnehmer',
    PARTICIPANTS_CHILDREN: 'Kinder',
    PARTICIPANTS_ADULTS: 'Erwachsene',
    EVENT_DATE: 'Wann?',
    LOCATION: 'Wo?',
    OCCASION: 'Anlass',
    CREATED_AT: 'Gesendet am',
    PRICE: 'Preis',
};

const bookingRequestColumnDisplayValues: Record<BookingRequestColumn, (bookingRequest: BookingRequest) => string> = {
    CUSTOMER_FIRST_NAME: (bookingRequest) => bookingRequest.user.firstName,
    CUSTOMER_PHONE_NUMBER: (bookingRequest) =>
        bookingRequest.user.phoneNumber ??
        (bookingRequest.user.phoneNumberUpdate?.phoneNumber
            ? `${bookingRequest.user.phoneNumberUpdate.phoneNumber}` //  (nicht bestätigt)
            : undefined) ??
        'Keine Angabe',
    COOK_FIRST_NAME: (bookingRequest) => bookingRequest.cook.user.firstName,
    COOK_PHONE_NUMBER: (bookingRequest) =>
        bookingRequest.cook.user.phoneNumber ??
        (bookingRequest.cook.user.phoneNumberUpdate?.phoneNumber
            ? `${bookingRequest.cook.user.phoneNumberUpdate.phoneNumber}` //  (nicht bestätigt)
            : undefined) ??
        'Keine Angabe',
    PARTICIPANTS_TOTAL: (bookingRequest) => String(bookingRequest.adultParticipants + bookingRequest.children),
    PARTICIPANTS_CHILDREN: (bookingRequest) => String(bookingRequest.children),
    PARTICIPANTS_ADULTS: (bookingRequest) => String(bookingRequest.adultParticipants),
    EVENT_DATE: (bookingRequest) => toTranslatedFormattedDate(bookingRequest.dateTime),
    LOCATION: (bookingRequest) => bookingRequest.location.text,
    OCCASION: (bookingRequest) => bookingRequest.occasion,
    CREATED_AT: (bookingRequest) => toTranslatedFormattedDate(bookingRequest.createdAt),
    PRICE: (bookingRequest) => formatPrice(bookingRequest.totalPriceCustomer, true),
};

export function AdminBookingRequestsTable({ bookingRequests }: AdminBookingRequestsTableProps) {
    const [selectedBookingRequest, setSelectedBookingRequest] = useState<BookingRequest | undefined>();
    const [selectedTab, setSelectedTab] = useState<AdminBookingRequestTab>('EVENT_DETAILS');

    const [visibleColumns, setVisibleColumns] = useState<BookingRequestColumn[]>(defaultBookingRequestColumns);

    const displayUserEmailAddress =
        selectedBookingRequest &&
        (selectedBookingRequest.user.emailAddress ??
            (selectedBookingRequest.user.emailAddressUpdate?.emailAddress
                ? `${selectedBookingRequest.user.emailAddress}` //  (nicht bestätigt)
                : undefined));

    const displayUserPhoneNumber =
        selectedBookingRequest &&
        (selectedBookingRequest.user.phoneNumber ??
            (selectedBookingRequest.user.phoneNumberUpdate?.phoneNumber
                ? `${selectedBookingRequest.user.phoneNumberUpdate.phoneNumber}` //  (nicht bestätigt)
                : undefined));

    const displayCookEmailAddress =
        selectedBookingRequest &&
        (selectedBookingRequest.cook.user.emailAddress ??
            (selectedBookingRequest.cook.user.emailAddressUpdate?.emailAddress
                ? `${selectedBookingRequest.cook.user.emailAddress}` //  (nicht bestätigt)
                : undefined));

    const displayCookPhoneNumber =
        selectedBookingRequest &&
        (selectedBookingRequest.cook.user.phoneNumber ??
            (selectedBookingRequest.cook.user.phoneNumberUpdate?.phoneNumber
                ? `${selectedBookingRequest.cook.user.phoneNumberUpdate.phoneNumber}` //  (nicht bestätigt)
                : undefined));

    return (
        <>
            <PELabelMultiSelection
                options={bookingRequestColumns}
                selectedOptions={visibleColumns}
                selectedOptionsChanged={setVisibleColumns}
                optionTitle={(o) => bookingRequestColumnTitles[o]}
                optionIdentifier={(o) => o}
            />
            <table className="w-full text-left mt-16">
                <thead>
                    <tr>
                        {visibleColumns.map((column, index) => (
                            <th
                                key={column}
                                scope="col"
                                className={classNames({
                                    'hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell': index !== 0,
                                    'relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900': index === 0,
                                })}
                            >
                                {bookingRequestColumnTitles[column]}
                                {index === 0 && (
                                    <>
                                        <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                                        <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                                    </>
                                )}
                            </th>
                        ))}
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
                            {visibleColumns.map((column, index) => (
                                <td
                                    key={column}
                                    className={classNames({
                                        'hidden px-3 py-4 text-sm text-gray-500 md:table-cell': index !== 0,
                                        'relative py-4 pr-3 text-sm font-medium text-gray-900': index === 0,
                                    })}
                                >
                                    {bookingRequestColumnDisplayValues[column](bookingRequest)}
                                    {index === 0 && (
                                        <>
                                            <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                            <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                                        </>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>

                <PEDialog
                    open={Boolean(selectedBookingRequest)}
                    onClose={() => setSelectedBookingRequest(undefined)}
                    title="Buchungsanfrage"
                >
                    {selectedBookingRequest && (
                        <>
                            <PETabSingleSelection
                                options={
                                    selectedBookingRequest.configuredMenu ? adminBookingRequestTabs : adminBookingRequestTabsWithoutMenu
                                }
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

                            {selectedTab === 'CUSTOMER' && (
                                <div className="overflow-y-auto sm:mb-4 pl-4 pr-4">
                                    <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
                                        <div className="pt-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Vorname</dt>
                                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                                <div className="text-gray-900">{selectedBookingRequest.user.firstName}</div>
                                            </dd>
                                        </div>
                                        <div className="pt-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Nachname</dt>
                                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                                <div className="text-gray-900">{selectedBookingRequest.user.lastName}</div>
                                            </dd>
                                        </div>
                                        <div className="pt-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email Adresse</dt>
                                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                                <div className="text-gray-900 flex justify-between w-full">
                                                    <span>{displayUserEmailAddress ?? 'Keine Angabe'}</span>
                                                    {displayUserEmailAddress && (
                                                        <button onClick={() => navigator.clipboard.writeText(displayUserEmailAddress)}>
                                                            <Copy />
                                                        </button>
                                                    )}
                                                </div>
                                            </dd>
                                        </div>
                                        {/* Last child has py instead of pb */}
                                        <div className="py-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Telefonnummer</dt>
                                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                                <div className="text-gray-900 flex justify-between w-full">
                                                    <span>{displayUserPhoneNumber ?? 'Keine Angabe'}</span>
                                                    {displayUserPhoneNumber && (
                                                        <button onClick={() => navigator.clipboard.writeText(displayUserPhoneNumber)}>
                                                            <Copy />
                                                        </button>
                                                    )}
                                                </div>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            )}

                            {selectedTab === 'COOK' && (
                                <div className="overflow-y-auto sm:mb-4 pl-4 pr-4">
                                    <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
                                        <div className="pt-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Vorname</dt>
                                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                                <div className="text-gray-900">{selectedBookingRequest.cook.user.firstName}</div>
                                            </dd>
                                        </div>
                                        <div className="pt-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Nachname</dt>
                                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                                <div className="text-gray-900">{selectedBookingRequest.cook.user.lastName}</div>
                                            </dd>
                                        </div>
                                        <div className="pt-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email Adresse</dt>
                                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                                <div className="text-gray-900 flex justify-between w-full">
                                                    <span>{displayCookEmailAddress ?? 'Keine Angabe'}</span>
                                                    {displayCookEmailAddress && (
                                                        <button onClick={() => navigator.clipboard.writeText(displayCookEmailAddress)}>
                                                            <Copy />
                                                        </button>
                                                    )}
                                                </div>
                                            </dd>
                                        </div>
                                        {/* Last child has py instead of pb */}
                                        <div className="py-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Telefonnummer</dt>
                                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                                <div className="text-gray-900 flex justify-between w-full">
                                                    <span>{displayCookPhoneNumber ?? 'Keine Angabe'}</span>
                                                    {displayCookPhoneNumber && (
                                                        <button onClick={() => navigator.clipboard.writeText(displayCookPhoneNumber)}>
                                                            <Copy />
                                                        </button>
                                                    )}
                                                </div>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            )}
                        </>
                    )}
                </PEDialog>
            </table>
        </>
    );
}
