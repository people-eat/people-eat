import { useMutation } from '@apollo/client';
import { CreateSupportRequestForm, CreateSupportRequestFormInputs, LoadingDialog } from '@people-eat/web-components';
import { PEAlert, PETabSingleSelection } from '@people-eat/web-core-components';
import { CreateOneUserSupportRequestDocument, GetProfileBookingsPageDataQuery, Unpacked } from '@people-eat/web-domain';
import { ArrowLeft, Headset, LucideIcon, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PEBookingDetails } from './PEBookingDetails';

const defaultProfileGlobalBookingRequestDetailsTab: ProfileGlobalBookingRequestDetailsTab = 'EVENT_DETAILS';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    userId: string;
    selectedTab: ProfileGlobalBookingRequestDetailsTab;
    globalBookingRequest: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['globalBookingRequests']['findMany']>>;
}

export function PEProfileGlobalBookingRequestDetails({
    userId,
    selectedTab,
    globalBookingRequest,
}: PEProfileGlobalBookingRequestDetailsProps) {
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
                    options={profileGlobalBookingRequestDetailsTabs}
                    selectedOption={selectedTab}
                    selectedOptionChanged={(tab) =>
                        tab && router.replace({ query: { ...router.query, tab } }, undefined, { scroll: false })
                    }
                    optionTitle={(o) => profileGlobalBookingRequestDetailsTabTranslations[o]}
                    optionIdentifier={(o) => o}
                    optionIcon={(o) => profileGlobalBookingRequestDetailsTabIcons[o]}
                    optionNotificationCount={undefined}
                />
            </div>

            {selectedTab === 'EVENT_DETAILS' && (
                <PEBookingDetails
                    occasion={globalBookingRequest.occasion}
                    adultParticipants={globalBookingRequest.adultParticipants}
                    // eslint-disable-next-line react/no-children-prop
                    children={globalBookingRequest.children}
                    dateTime={globalBookingRequest.dateTime}
                    location={globalBookingRequest.location}
                    priceClass={globalBookingRequest.priceClass}
                />
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
                                        bookingRequestId: undefined,
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
