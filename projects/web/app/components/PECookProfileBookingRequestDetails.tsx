import { useMutation } from '@apollo/client';
import {
    ConfiguredMenuPanel,
    CreateSupportRequestForm,
    CreateSupportRequestFormInputs,
    LoadingDialog,
    PEAlert,
    PEBookingDetails,
    PETabSingleSelection,
} from '@people-eat/web-components';
import { CreateOneUserSupportRequestDocument, GetProfileBookingsPageDataQuery } from '@people-eat/web-domain';
import { ArrowLeft, CookingPot, Headset, LucideIcon, MessageCircle, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CookProfileBookingRequestChat } from './CookProfileBookingRequestChat';

const defaultProfileBookingRequestDetailsTab: CookProfileBookingRequestDetailsTab = 'CHAT';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCookProfileBookingRequestDetailsTab(value: any): CookProfileBookingRequestDetailsTab {
    return cookProfileBookingRequestDetailsTabs.includes(value) ? value : defaultProfileBookingRequestDetailsTab;
}

export type CookProfileBookingRequestDetailsTab = 'CHAT' | 'EVENT_DETAILS' | 'MENU' | 'SUPPORT';

const cookProfileBookingRequestDetailsTabs: CookProfileBookingRequestDetailsTab[] = ['EVENT_DETAILS', 'CHAT', 'MENU', 'SUPPORT'];

const cookProfileBookingRequestDetailsTabTranslations: Record<CookProfileBookingRequestDetailsTab, string> = {
    CHAT: 'Chat',
    EVENT_DETAILS: 'Veranstaltung',
    MENU: 'Menü',
    SUPPORT: 'Support',
};

const cookProfileBookingRequestDetailsTabIcons: Record<CookProfileBookingRequestDetailsTab, LucideIcon> = {
    CHAT: MessageCircle,
    EVENT_DETAILS: ReceiptText,
    MENU: CookingPot,
    SUPPORT: Headset,
};

export interface PECookProfileBookingRequestDetailsProps {
    userId: string;
    selectedTab: CookProfileBookingRequestDetailsTab;
    hasStripePayoutMethodActivated: boolean;
    bookingRequest: NonNullable<GetProfileBookingsPageDataQuery['cooks']['bookingRequests']['findOne']>;
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

    const [createSupportRequest, { data, loading, reset }] = useMutation(CreateOneUserSupportRequestDocument);
    const showSuccessAlert = data?.users.supportRequests.createOne ?? false;
    const showFailedAlert = data ? !data.users.supportRequests.createOne : false;

    return (
        <div className="flex flex-col flex-1">
            <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 8 }}>
                <Link href="/profile/bookings" className="lg:hidden flex gap-2 mb-8">
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
                    price={bookingRequest.totalPriceCustomer}
                    payoutPrice={bookingRequest.totalPriceCook}
                    // travelExpenses={bookingRequest.travelExpenses}
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
                <ConfiguredMenuPanel configuredMenu={bookingRequest.configuredMenu} />
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
