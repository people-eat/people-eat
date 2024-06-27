import { useMutation } from '@apollo/client';
import { CreateSupportRequestForm, CreateSupportRequestFormInputs, LoadingDialog } from '@people-eat/web-components';
import { PEAlert, PETabSingleSelection } from '@people-eat/web-core-components';
import {
    CreateOneUserSupportRequestDocument,
    GetProfileBookingsPageDataQuery,
    Unpacked,
    formatTime,
    toTranslatedFormattedDate,
    translatedPriceClasses,
} from '@people-eat/web-domain';
import { ArrowLeft, Headset, LucideIcon, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
        <div className="flex flex-col gap-8 flex-1 p-8">
            <Link href="/profile/bookings" className="lg:hidden flex gap-2">
                <ArrowLeft />
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
                <div className="overflow-y-scroll">
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
                                <div className="text-gray-900">{formatTime(globalBookingRequest.dateTime)}</div>
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

            {selectedTab === 'SUPPORT' && (
                <div className="flex flex-col gap-8">
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
