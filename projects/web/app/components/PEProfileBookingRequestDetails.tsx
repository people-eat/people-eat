import { CreateSupportRequestForm, CreateSupportRequestFormInputs, MealCard } from '@people-eat/web-components';
import { PETabSingleSelection } from '@people-eat/web-core-components';
import {
    GetProfileBookingsPageDataQuery,
    formatPrice,
    toTranslatedFormattedDate,
    translatedBookingRequestStatus,
} from '@people-eat/web-domain';
import { ArrowLeft, CookingPot, Headset, LucideIcon, MessageCircle, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProfileBookingRequestChat } from './ProfileBookingRequestChat';

const defaultProfileBookingRequestDetailsTab: ProfileBookingRequestDetailsTab = 'EVENT_DETAILS';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    userId: string;
    selectedTab: ProfileBookingRequestDetailsTab;
    bookingRequest: NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findOne']>;
    onRequireUpdate: () => void;
}

export function PEProfileBookingRequestDetails({
    userId,
    selectedTab,
    bookingRequest,
    onRequireUpdate,
}: PEProfileBookingRequestDetailsProps) {
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
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Gesamtpreis</dt>
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

            {selectedTab === 'CHAT' && (
                <div className="flex flex-col gap-8">
                    <ProfileBookingRequestChat userId={userId} bookingRequest={bookingRequest} onRequireUpdate={onRequireUpdate} />
                </div>
            )}

            {selectedTab === 'MENU' && bookingRequest.configuredMenu && (
                <div className="flex flex-col gap-8">
                    <h2 className="text-2xl font-bold">{bookingRequest.configuredMenu.title}</h2>
                    <h3>{bookingRequest.configuredMenu.description}</h3>
                    {bookingRequest.configuredMenu.greetingFromKitchen && bookingRequest.configuredMenu.greetingFromKitchen !== '' && (
                        <div>{bookingRequest.configuredMenu.greetingFromKitchen}</div>
                    )}
                    <div className="flex flex-col gap-4">
                        {bookingRequest.configuredMenu.courses.map((course) => (
                            <div key={course.index} className="flex flex-col gap-4">
                                <div>{course.title}</div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <MealCard
                                        key={course.index}
                                        type="SIMPLE"
                                        title={course.mealTitle}
                                        description={course.mealDescription}
                                        imageUrl={course.mealImageUrl}
                                        onInfoClick={() => undefined}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTab === 'SUPPORT' && (
                <div className="flex flex-col gap-8">
                    <h2 className="text-2xl font-bold">Support</h2>

                    <CreateSupportRequestForm
                        onCreate={function (data: CreateSupportRequestFormInputs): void {
                            throw new Error('Function not implemented.');
                        }}
                    />
                </div>
            )}
        </div>
    );
}
