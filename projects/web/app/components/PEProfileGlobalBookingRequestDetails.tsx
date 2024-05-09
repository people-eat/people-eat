import { PETabSingleSelection } from '@people-eat/web-core-components';
import { GetProfileBookingsPageDataQuery, Unpacked, toTranslatedFormattedDate, translatedPriceClasses } from '@people-eat/web-domain';
import { ArrowLeft, Headset, LucideIcon, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const defaultProfileGlobalBookingRequestDetailsTab: ProfileGlobalBookingRequestDetailsTab = 'EVENT_DETAILS';

export function toProfileGlobalBookingRequestDetailsTab(value: any): ProfileGlobalBookingRequestDetailsTab {
    return profileGlobalBookingRequestDetailsTabs.includes(value) ? value : defaultProfileGlobalBookingRequestDetailsTab;
}

export type ProfileGlobalBookingRequestDetailsTab = 'EVENT_DETAILS' | 'SUPPORT';

const profileGlobalBookingRequestDetailsTabs: ProfileGlobalBookingRequestDetailsTab[] = ['EVENT_DETAILS', 'SUPPORT'];

const profileGlobalBookingRequestDetailsTabTranslations: Record<ProfileGlobalBookingRequestDetailsTab, string> = {
    EVENT_DETAILS: 'Veranstaltung',
    SUPPORT: 'Support',
};

const profileGlobalBookingRequestDetailsTabIcons: Record<ProfileGlobalBookingRequestDetailsTab, LucideIcon> = {
    EVENT_DETAILS: ReceiptText,
    SUPPORT: Headset,
};

export interface PEProfileGlobalBookingRequestDetailsProps {
    selectedTab: ProfileGlobalBookingRequestDetailsTab;
    globalBookingRequest: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['globalBookingRequests']['findMany']>>;
}

export function PEProfileGlobalBookingRequestDetails({ selectedTab, globalBookingRequest }: PEProfileGlobalBookingRequestDetailsProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-8">
            <Link href="/profile/bookings" className="lg:hidden flex gap-2">
                <ArrowLeft />
                Buchungsanfragen
            </Link>

            <PETabSingleSelection
                options={profileGlobalBookingRequestDetailsTabs}
                selectedOption={selectedTab}
                selectedOptionChanged={(tab) => tab && router.replace({ query: { ...router.query, tab } }, undefined, { scroll: false })}
                optionTitle={(o) => profileGlobalBookingRequestDetailsTabTranslations[o]}
                optionIdentifier={(o) => o}
                optionIcon={(o) => profileGlobalBookingRequestDetailsTabIcons[o]}
                optionNotificationCount={undefined}
            />

            {selectedTab === 'EVENT_DETAILS' && (
                <div>
                    <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Anlass</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{globalBookingRequest.occasion}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Erwachsene</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{globalBookingRequest.adultParticipants}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Kinder</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{globalBookingRequest.children}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Datum</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{toTranslatedFormattedDate(globalBookingRequest.dateTime)}</div>
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
                                <div className="text-gray-900">{globalBookingRequest.location.text}</div>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Preisklasse</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900">{translatedPriceClasses[globalBookingRequest.priceClass.type]}</div>
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

            {selectedTab === 'SUPPORT' && 'Support'}
        </div>
    );
}
