import { PETabSingleSelection } from '@people-eat/web-core-components';
import {
    GetProfileBookingsPageDataQuery,
    Unpacked,
    formatPrice,
    toTranslatedFormattedDate,
    translatedBookingRequestStatus,
} from '@people-eat/web-domain';
import { ArrowLeft, CookingPot, Headset, LucideIcon, MessageCircle, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const defaultProfileBookingRequestDetailsTab: ProfileBookingRequestDetailsTab = 'EVENT_DETAILS';

export function toProfileBookingRequestDetailsTab(value: any): ProfileBookingRequestDetailsTab {
    return profileBookingRequestDetailsTabs.includes(value) ? value : defaultProfileBookingRequestDetailsTab;
}

export type ProfileBookingRequestDetailsTab = 'CHAT' | 'EVENT_DETAILS' | 'MENU' | 'SUPPORT';

const profileBookingRequestDetailsTabs: ProfileBookingRequestDetailsTab[] = ['EVENT_DETAILS', 'CHAT', 'MENU', 'SUPPORT'];

const profileBookingRequestDetailsTabTranslations: Record<ProfileBookingRequestDetailsTab, string> = {
    CHAT: 'Chat',
    EVENT_DETAILS: 'Veranstaltung',
    MENU: 'Menü',
    SUPPORT: 'Support',
};

const profileBookingRequestDetailsTabIcons: Record<ProfileBookingRequestDetailsTab, LucideIcon> = {
    CHAT: MessageCircle,
    EVENT_DETAILS: ReceiptText,
    MENU: CookingPot,
    SUPPORT: Headset,
};

export interface PEProfileBookingRequestDetailsProps {
    selectedTab: ProfileBookingRequestDetailsTab;
    bookingRequest: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findMany']>>;
}

export function PEProfileBookingRequestDetails({ selectedTab, bookingRequest }: PEProfileBookingRequestDetailsProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-8">
            <Link href="/profile/bookings" className="lg:hidden flex gap-2">
                <ArrowLeft />
                Buchungsanfragen
            </Link>

            <PETabSingleSelection
                options={profileBookingRequestDetailsTabs}
                selectedOption={selectedTab}
                selectedOptionChanged={(tab) => tab && router.replace({ query: { ...router.query, tab } }, undefined, { scroll: false })}
                optionTitle={(o) => profileBookingRequestDetailsTabTranslations[o]}
                optionIdentifier={(o) => o}
                optionIcon={(o) => profileBookingRequestDetailsTabIcons[o]}
                optionNotificationCount={undefined}
            />

            {selectedTab === 'EVENT_DETAILS' && (
                <div>
                    <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Status</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">
                                    {translatedBookingRequestStatus[bookingRequest.status]} (TODO - explain)
                                </div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Anlass</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{bookingRequest.occasion}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Erwachsene</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{bookingRequest.adultParticipants}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Kinder</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{bookingRequest.children}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Datum</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{toTranslatedFormattedDate(bookingRequest.dateTime)}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Uhrzeit</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{'TODO'}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Wo</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{bookingRequest.location.text}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Presiklasse</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{formatPrice(bookingRequest.price)}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Allergien</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{'Keine'}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Kategorien</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{'Keine'}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Küche</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{'Keine'}</div>
                            </dd>
                        </div>
                    </dl>
                </div>
            )}

            {selectedTab === 'CHAT' && 'Chat'}

            {selectedTab === 'MENU' && bookingRequest.configuredMenu && (
                <div>
                    <h2>{bookingRequest.configuredMenu.title}</h2>
                </div>
            )}

            {selectedTab === 'SUPPORT' && 'Support'}
        </div>
    );
}