import { useMutation } from '@apollo/client';
import {
    CreateSupportRequestForm,
    CreateSupportRequestFormInputs,
    LoadingDialog,
    MealCard,
    MealDetailsDialog,
    PEBookingDetails,
} from '@people-eat/web-components';
import { PEAlert, PETabSingleSelection } from '@people-eat/web-components';
import { CreateOneUserSupportRequestDocument, GetProfileBookingsPageDataQuery } from '@people-eat/web-domain';
import { ArrowLeft, CookingPot, Headset, LucideIcon, MessageCircle, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ProfileBookingRequestChat } from './ProfileBookingRequestChat';

const defaultProfileBookingRequestDetailsTab: ProfileBookingRequestDetailsTab = 'CHAT';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toProfileBookingRequestDetailsTab(value: any): ProfileBookingRequestDetailsTab {
    return profileBookingRequestDetailsTabs.includes(value) ? value : defaultProfileBookingRequestDetailsTab;
}

export type ProfileBookingRequestDetailsTab = 'CHAT' | 'EVENT_DETAILS' | 'MENU' | 'SUPPORT';

const profileBookingRequestDetailsTabs: ProfileBookingRequestDetailsTab[] = ['EVENT_DETAILS', 'CHAT', 'MENU', 'SUPPORT'];
const profileBookingRequestDetailsTabsWithoutMenu: ProfileBookingRequestDetailsTab[] = ['EVENT_DETAILS', 'CHAT', 'SUPPORT'];

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

    const [createSupportRequest, { data, loading, reset }] = useMutation(CreateOneUserSupportRequestDocument);
    const showSuccessAlert = data?.users.supportRequests.createOne ?? false;
    const showFailedAlert = data ? !data.users.supportRequests.createOne : false;

    const [selectedMeal, setSelectedMeal] = useState<
        | undefined
        | {
              title: string;
              description: string;
              imageUrl?: string | null;
          }
    >(undefined);

    return (
        <div className="flex flex-col flex-1">
            <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 8 }}>
                <Link href="/profile/bookings" className="lg:hidden flex gap-2 mb-4">
                    <ArrowLeft />
                    Buchungsanfragen
                </Link>

                <PETabSingleSelection
                    options={bookingRequest.configuredMenu ? profileBookingRequestDetailsTabs : profileBookingRequestDetailsTabsWithoutMenu}
                    selectedOption={selectedTab}
                    selectedOptionChanged={(tab) =>
                        tab && router.replace({ query: { ...router.query, tab } }, undefined, { scroll: false })
                    }
                    optionTitle={(o) => profileBookingRequestDetailsTabTranslations[o]}
                    optionIdentifier={(o) => o}
                    optionIcon={(o) => profileBookingRequestDetailsTabIcons[o]}
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
                    price={bookingRequest.totalPriceCustomer}
                />
            )}

            {selectedTab === 'CHAT' && (
                <ProfileBookingRequestChat userId={userId} bookingRequest={bookingRequest} onRequireUpdate={onRequireUpdate} />
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
                                        imageUrl={course.mealImageUrl ?? undefined}
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

            {selectedTab === 'SUPPORT' && (
                <div className="flex flex-col gap-8 p-4">
                    <h2 className="text-2xl font-bold">Support</h2>

                    <CreateSupportRequestForm
                        onCreate={function ({ message, title }: CreateSupportRequestFormInputs): void {
                            createSupportRequest({
                                variables: {
                                    userId,
                                    request: {
                                        bookingRequestId: bookingRequest.bookingRequestId,
                                        message,
                                        subject: title,
                                    },
                                },
                            });
                        }}
                    />
                </div>
            )}

            <LoadingDialog active={loading} />

            <PEAlert
                open={showSuccessAlert}
                type="SUCCESS"
                title="Support Anfrage erfolgreich eingereicht"
                subtitle="Wir werden uns schnellstmöglich um dein Anliegen kümmern und treten mit dir in Kontakt."
                primaryButton={{
                    title: 'Fertig',
                    onClick: () => reset(),
                }}
            />

            <PEAlert
                open={showFailedAlert}
                type="ERROR"
                title="Leider konnte deine Support Anfrage nicht erfolgreich eingereicht werden"
                subtitle="Bitte versuche es erneut oder falls dies weiterhin fehlschlägt, versuche später noch einmal. Entuldigung für die Umstände - Dein PeopleEat Support Team."
                primaryButton={{
                    title: 'Erneut versuchen',
                    onClick: () => createSupportRequest(),
                }}
                secondaryButton={{
                    title: 'Abbrechen',
                    onClick: () => reset(),
                }}
            />
        </div>
    );
}
