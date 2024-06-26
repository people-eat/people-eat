import { useMutation } from '@apollo/client';
import {
    BookingStatusInfoPopover,
    CreateSupportRequestForm,
    CreateSupportRequestFormInputs,
    LoadingDialog,
    MealCard,
} from '@people-eat/web-components';
import { PEAlert, PETabSingleSelection } from '@people-eat/web-core-components';
import {
    CreateOneUserSupportRequestDocument,
    GetProfileBookingsPageDataQuery,
    formatPrice,
    formatTime,
    toTranslatedFormattedDate,
    translatedBookingRequestStatus,
} from '@people-eat/web-domain';
import { ArrowLeft, CookingPot, Headset, LucideIcon, MessageCircle, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

    return (
        <div className="flex flex-col gap-8 flex-1">
            <div className="flex flex-col gap-8 p-8">
                <Link href="/profile/bookings" className="lg:hidden flex gap-2">
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
                <div className="overflow-y-auto pr-8 ml-8 pb-8">
                    <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Status</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="text-gray-900 flex justify-between w-full pr-4">
                                    <span>{translatedBookingRequestStatus[bookingRequest.status]}</span>
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
                <ProfileBookingRequestChat userId={userId} bookingRequest={bookingRequest} onRequireUpdate={onRequireUpdate} />
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
                                        imageUrl={course.mealImageUrl ?? undefined}
                                        onInfoClick={() => undefined}
                                    />
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTab === 'SUPPORT' && (
                <div className="flex flex-col gap-8">
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
