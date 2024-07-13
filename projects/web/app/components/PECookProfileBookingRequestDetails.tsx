import { BookingStatusInfoPopover, MealCard, MealDetailsDialog } from '@people-eat/web-components';
import { PETabSingleSelection } from '@people-eat/web-core-components';
import {
    GetCookProfileBookingsPageDataQuery,
    formatPrice,
    formatTime,
    toTranslatedFormattedDate,
    translatedBookingRequestStatus,
} from '@people-eat/web-domain';
import { ArrowLeft, CookingPot, LucideIcon, MessageCircle, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CookProfileBookingRequestChat } from './CookProfileBookingRequestChat';
import { useState } from 'react';

const defaultProfileBookingRequestDetailsTab: CookProfileBookingRequestDetailsTab = 'CHAT';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCookProfileBookingRequestDetailsTab(value: any): CookProfileBookingRequestDetailsTab {
    return cookProfileBookingRequestDetailsTabs.includes(value) ? value : defaultProfileBookingRequestDetailsTab;
}

export type CookProfileBookingRequestDetailsTab = 'CHAT' | 'EVENT_DETAILS' | 'MENU';

const cookProfileBookingRequestDetailsTabs: CookProfileBookingRequestDetailsTab[] = ['EVENT_DETAILS', 'CHAT', 'MENU'];

const cookProfileBookingRequestDetailsTabTranslations: Record<CookProfileBookingRequestDetailsTab, string> = {
    CHAT: 'Chat',
    EVENT_DETAILS: 'Veranstaltung',
    MENU: 'Menü',
};

const cookProfileBookingRequestDetailsTabIcons: Record<CookProfileBookingRequestDetailsTab, LucideIcon> = {
    CHAT: MessageCircle,
    EVENT_DETAILS: ReceiptText,
    MENU: CookingPot,
};

export interface PECookProfileBookingRequestDetailsProps {
    userId: string;
    selectedTab: CookProfileBookingRequestDetailsTab;
    hasStripePayoutMethodActivated: boolean;
    bookingRequest: NonNullable<GetCookProfileBookingsPageDataQuery['cooks']['bookingRequests']['findOne']>;
    onRequireUpdate: () => void;
}

export function PECookProfileBookingRequestDetails({
    userId,
    selectedTab,
    hasStripePayoutMethodActivated,
    bookingRequest,
    onRequireUpdate,
}: PECookProfileBookingRequestDetailsProps) {
    const router = useRouter();

    const [selectedMeal, setSelectedMeal] = useState<
        | undefined
        | {
              title: string;
              description: string;
              imageUrl?: string | null;
          }
    >(undefined);

    return (
        <div className="flex flex-col gap-8 flex-1">
            <div className="flex flex-col gap-8 p-8">
                <Link href="/chef-profile/bookings" className="lg:hidden flex gap-2">
                    <ArrowLeft />
                    Buchungsanfragen
                </Link>

                <PETabSingleSelection
                    options={cookProfileBookingRequestDetailsTabs}
                    selectedOption={selectedTab}
                    selectedOptionChanged={(tab) =>
                        tab && router.replace({ query: { ...router.query, tab } }, undefined, { scroll: false })
                    }
                    optionTitle={(o) => cookProfileBookingRequestDetailsTabTranslations[o]}
                    optionIdentifier={(o) => o}
                    optionIcon={(o) => cookProfileBookingRequestDetailsTabIcons[o]}
                    optionNotificationCount={undefined}
                />
            </div>

            {selectedTab === 'EVENT_DETAILS' && (
                <div className="overflow-y-auto pr-8 ml-8 pb-8">
                    <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Status</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900 flex justify-between w-full pr-4">
                                    {translatedBookingRequestStatus[bookingRequest.status]}
                                    <BookingStatusInfoPopover currentBookingRequestStatus={bookingRequest.status} />
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
                                <div className="text-gray-900">{formatTime(bookingRequest.dateTime)}</div>
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
                                <div className="text-gray-900">{formatPrice(bookingRequest.price, true)}</div>
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
                <CookProfileBookingRequestChat
                    cookId={userId}
                    hasStripePayoutMethodActivated={hasStripePayoutMethodActivated}
                    bookingRequest={bookingRequest}
                    onRequireUpdate={onRequireUpdate}
                />
            )}

            {selectedTab === 'MENU' && bookingRequest.configuredMenu && (
                <div className="flex flex-col gap-8 overflow-y-auto pr-8 ml-8">
                    <h2 className="text-2xl font-bold">{bookingRequest.configuredMenu.title}</h2>
                    {bookingRequest.configuredMenu.description && <h3>{bookingRequest.configuredMenu.description}</h3>}
                    {bookingRequest.configuredMenu.greetingFromKitchen && bookingRequest.configuredMenu.greetingFromKitchen !== '' && (
                        <div>{bookingRequest.configuredMenu.greetingFromKitchen}</div>
                    )}
                    <div className="flex flex-col gap-4">
                        {bookingRequest.configuredMenu.courses.map((course) => (
                            <div key={course.index} className="flex flex-col gap-4 ml-2">
                                <div>{course.title}</div>
                                <ul className="grid grid-cols-1 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                                    <MealCard
                                        key={course.index}
                                        type="SIMPLE"
                                        title={course.mealTitle}
                                        description={course.mealDescription}
                                        imageUrl={course.mealImageUrl}
                                        onInfoClick={() =>
                                            setSelectedMeal({
                                                title: course.mealTitle,
                                                description: course.mealDescription,
                                                imageUrl: course.mealImageUrl ?? undefined,
                                            })
                                        }
                                    />
                                </ul>
                            </div>
                        ))}
                    </div>

                    {selectedMeal && <MealDetailsDialog onClose={() => setSelectedMeal(undefined)} meal={selectedMeal} />}
                </div>
            )}
        </div>
    );
}
