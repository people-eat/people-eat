import { MealCard, MealDetailsDialog } from '@people-eat/web-components';
import { PETabSingleSelection } from '@people-eat/web-core-components';
import { GetCookProfileBookingsPageDataQuery } from '@people-eat/web-domain';
import { ArrowLeft, CookingPot, LucideIcon, MessageCircle, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CookProfileBookingRequestChat } from './CookProfileBookingRequestChat';
import { PEBookingDetails } from './PEBookingDetails';

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
                <PEBookingDetails
                    status={bookingRequest.status}
                    occasion={bookingRequest.occasion}
                    adultParticipants={bookingRequest.adultParticipants}
                    // eslint-disable-next-line react/no-children-prop
                    children={bookingRequest.children}
                    dateTime={bookingRequest.dateTime}
                    location={bookingRequest.location}
                    price={bookingRequest.price}
                />
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
                <div className="flex flex-col gap-8 overflow-y-auto p-4">
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
