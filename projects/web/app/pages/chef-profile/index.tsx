import { useLazyQuery, useMutation } from '@apollo/client';
import { LoadingDialog, PECookProfileNavigation, PEHeader, PEImagePicker } from '@people-eat/web-components';
import { PEAlert, PEButton, PELabelMultiSelection, PELink, PESlider, PETextArea } from '@people-eat/web-core-components';
import {
    AddOneCookLanguageDocument,
    CookGetStripeDashboardUrlDocument,
    CookGetStripeOnboardingUrlDocument,
    GetCookProfilePersonalInformationDocument,
    GetCookProfilePersonalInformationPageDataDocument,
    GetCookProfilePersonalInformationPageDataQuery,
    GetSignedInUserDocument,
    RemoveOneCookLanguageDocument,
    SignedInUser,
    UpdateCookBiographyDocument,
    UpdateCookHasStripePayoutMethodActivatedDocument,
    UpdateCookIsVisibleDocument,
    UpdateCookMaximumParticipantsDocument,
    UpdateCookMaximumTravelDistanceDocument,
    UpdateCookTravelExpensesDocument,
    UpdateUserProfilePictureDocument,
    translatedCookRanks,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { MinusIcon, PlusIcon, Users } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEProfileAddressesCard } from '../../components/PEProfileAddressesCard';
import { PEProfileCard } from '../../components/PEProfileCard';
import { createApolloClient } from '../../network/apolloClients';
import { CookieSettings } from '../../components/analytics/CookieSettings';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

export interface EditCookProfileFormInputs {
    biography: string;
    travelExpenses: number;
    maximumTravelDistance: number;
    maximumParticipants: number;
}

interface ServerSideProps {
    signedInUser: SignedInUser;
    cookieSettings: CookieSettings | null;
    initialCookProfile: NonNullable<GetCookProfilePersonalInformationPageDataQuery['cooks']['findOne']>;
    languages: NonNullable<GetCookProfilePersonalInformationPageDataQuery['languages']['findAll']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;
        const cookId = signedInUser.userId;

        const { data } = await apolloClient.query({ query: GetCookProfilePersonalInformationPageDataDocument, variables: { cookId } });
        const initialCookProfile = data.cooks.findOne;
        if (!initialCookProfile) return signInPageRedirect;

        const languages = data.languages.findAll;

        return {
            props: {
                signedInUser,
                initialCookProfile,
                languages,
                cookieSettings: data.sessions.current?.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        return signInPageRedirect;
    }
};

export default function CookProfilePage({ signedInUser, initialCookProfile, languages }: ServerSideProps) {
    const router = useRouter();

    const cookId = initialCookProfile.cookId;
    const [cookProfile, setCookProfile] = useState(initialCookProfile);
    const [editLanguagesOn, setEditLanguagesOn] = useState(false);
    const [editBioOn, setEditBioOn] = useState(false);

    const [getUpdatedCookProfile, { loading: loadingUpdatedCookProfile }] = useLazyQuery(GetCookProfilePersonalInformationDocument, {
        variables: { cookId },
    });

    function updateCookProfile() {
        getUpdatedCookProfile().then(({ data }) => {
            const cook = data?.cooks.findOne;
            if (!cook) return;
            setCookProfile(cook);
        });
    }

    const [getStripeOnboardingUrl, { loading: loadingStripeOnboardingUrl }] = useLazyQuery(CookGetStripeOnboardingUrlDocument, {
        variables: { cookId },
    });
    const [getStripeDashboardUrl, { loading: loadingStripeDashboardUrl }] = useLazyQuery(CookGetStripeDashboardUrlDocument, {
        variables: { cookId },
    });

    const {
        register,
        // handleSubmit,
        watch,
        setValue,
    } = useForm<EditCookProfileFormInputs>({
        defaultValues: {
            biography: cookProfile.biography,
            travelExpenses: cookProfile.travelExpenses,
            maximumTravelDistance: cookProfile.maximumTravelDistance ?? 0,
            maximumParticipants: cookProfile.maximumParticipants ?? 2,
        },
    });

    const { biography, travelExpenses, maximumTravelDistance, maximumParticipants } = watch();

    const [requestBioUpdate, { loading: updateBioLoading }] = useMutation(UpdateCookBiographyDocument, {
        variables: { cookId, biography },
    });

    function updateBio() {
        requestBioUpdate().then(({ data }) => {
            if (!data?.cooks.success) return;
            setEditBioOn(false);
            updateCookProfile();
        });
    }

    const [requestTravelExpensesUpdate] = useMutation(UpdateCookTravelExpensesDocument, {
        variables: { cookId, travelExpenses: travelExpenses },
    });

    const [requestMaximumTravelDistanceUpdate] = useMutation(UpdateCookMaximumTravelDistanceDocument, {
        variables: { cookId, maximumTravelDistance: maximumTravelDistance },
    });

    const [requestMaximumParticipantsUpdate] = useMutation(UpdateCookMaximumParticipantsDocument, {
        variables: { cookId, maximumParticipants: maximumParticipants },
    });

    const [
        requestHasStripePayoutMethodActivatedUpdate,
        { loading: walletUpdateLoading, reset: resetUpdateWallet, data: updateWalletData },
    ] = useMutation(UpdateCookHasStripePayoutMethodActivatedDocument, { variables: { cookId } });

    function updateBookingDetails() {
        const updateRequests = [];

        if (travelExpenses !== cookProfile.travelExpenses) updateRequests.push(requestTravelExpensesUpdate());
        if (maximumTravelDistance !== cookProfile.maximumTravelDistance) updateRequests.push(requestMaximumTravelDistanceUpdate());
        if (maximumParticipants !== cookProfile.maximumParticipants) updateRequests.push(requestMaximumParticipantsUpdate());

        Promise.all(updateRequests).then(updateCookProfile);
    }

    const [removeOneCookLanguage] = useMutation(RemoveOneCookLanguageDocument);
    const [addOneCookLanguage] = useMutation(AddOneCookLanguageDocument);

    const bookingDetailsHasChangesApplied =
        travelExpenses !== cookProfile.travelExpenses ||
        maximumTravelDistance !== cookProfile.maximumTravelDistance ||
        maximumParticipants !== cookProfile.maximumParticipants;

    function resetBookingDetails() {
        setValue('travelExpenses', cookProfile.travelExpenses);
        setValue('maximumTravelDistance', cookProfile.maximumTravelDistance ?? 0);
        setValue('maximumParticipants', cookProfile.maximumParticipants ?? 2);
    }

    const biographyHasChangesApplied = biography !== cookProfile.biography;

    function resetBiography() {
        setValue('biography', cookProfile.biography);
    }

    const [updateProfilePicture, { loading: loadingUpdateProfilePicture }] = useMutation(UpdateUserProfilePictureDocument);

    function onUpdateProfilePicture(changedProfilePicture: File | undefined) {
        updateProfilePicture({ variables: { userId: cookId, profilePicture: changedProfilePicture } }).then(({ data }) => {
            if (data?.users.success) {
                updateCookProfile();
            }
        });
    }

    const [requestIsVisibleUpdate, { loading: loadingUpdateIsVisible }] = useMutation(UpdateCookIsVisibleDocument);

    async function updateIsVisible(changedIsVisible: boolean) {
        await requestIsVisibleUpdate({ variables: { cookId, isVisible: changedIsVisible } });
        updateCookProfile();
    }

    const loading =
        loadingUpdatedCookProfile ||
        loadingStripeOnboardingUrl ||
        loadingStripeDashboardUrl ||
        updateBioLoading ||
        loadingUpdateIsVisible ||
        loadingUpdateProfilePicture ||
        walletUpdateLoading;

    const updateWalletStatus = typeof router.query['update-wallet-status'] === 'string';

    function updateHasStripePayoutMethodActivated() {
        requestHasStripePayoutMethodActivatedUpdate()
            .then(() => router.replace({ query: {} }, undefined, { scroll: false }))
            .then(updateCookProfile);
    }

    useEffect(() => {
        if (updateWalletStatus) updateHasStripePayoutMethodActivated();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <LoadingDialog active={loading} />

            <PEAlert
                open={updateWalletData?.cooks.success ?? false}
                title="Wallet Einrichtung abgeschlossen"
                subtitle="Du hast die Einrichtung deiner Wallet erfolgreich abgeschlossen. Das ermöglicht es dir Buchungsanfragen zu akzeptieren."
                primaryButton={{ title: 'Okay', onClick: resetUpdateWallet }}
            />

            <PEAlert
                open={updateWalletData?.cooks.success === false}
                title="Wallet Einrichtung fehlgeschlagen"
                type="ERROR"
                subtitle="Bei dem Versuch deine Wallet einrichtung abzuschließen ist leider ein unerwarteter Fehler aufgetreten. Du kannst es erneut versuchen, sollte dies jedoch nicht funktionieren, setzte dich bitte mit unserem Support in Verbindung. Wir helfen gerne!"
                primaryButton={{ title: 'Erneut versuchen', onClick: updateHasStripePayoutMethodActivated }}
                secondaryButton={{ title: 'Fehler an Support melden', onClick: resetUpdateWallet }}
            />

            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PECookProfileNavigation current="PERSONAL_INFORMATION" />

                <div className="ml-8 flex justify-between items-start flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            Hallo {cookProfile.user.firstName}!
                        </span>
                        <span className="truncate text-sm font-medium text-gray-500">{translatedCookRanks[cookProfile.rank]}</span>
                    </div>
                    <PELink title="Zum Gastgeberprofil" type="secondary" href="/profile" />
                </div>

                <div className="flex gap-8 flex-col lg:flex-row">
                    <PEProfileCard className="flex flex-col gap-8 flex-1">
                        <h3 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">Profilbild</h3>

                        {/* <UserCircle width={64} height={64} strokeWidth={1} /> */}

                        <PEImagePicker
                            onPick={onUpdateProfilePicture}
                            defaultImage={cookProfile.user.profilePictureUrl ?? undefined}
                            onRemoveDefaultImage={() => onUpdateProfilePicture(undefined)}
                        />
                    </PEProfileCard>

                    <PEProfileCard title="Finanzen" className="flex flex-col gap-8 flex-1">
                        <div className="h-full flex flex-col gap-8 justify-between">
                            <div className="text-gray-600">
                                Deine Wallet ist der Ort an dem du die Überischt über all deine Einkünfte und ggf. Ausgaben finden kannst.
                                Ohne eine Wallet sind keine Auszahlungen auf dein privates Bankkonto möglich.
                            </div>
                            <div className="flex justify-end">
                                {!cookProfile.hasStripePayoutMethodActivated && (
                                    <PEButton
                                        title="Wallet hinzufügen"
                                        onClick={(): void => {
                                            const openEvent = window.open('', '_blank');
                                            void getStripeOnboardingUrl()
                                                .then(({ data: sData }) => {
                                                    if (sData?.cooks.getStripeOnboardingUrl)
                                                        openEvent!.location.href = sData.cooks.getStripeOnboardingUrl;
                                                })
                                                .catch((e) => console.error(e));
                                        }}
                                    />
                                )}
                                {cookProfile.hasStripePayoutMethodActivated && (
                                    <PEButton
                                        title="Transaktionen Anzeigen"
                                        onClick={(): void => {
                                            const openEvent = window.open('', '_blank');
                                            void getStripeDashboardUrl()
                                                .then(({ data: sData }) => {
                                                    if (sData?.cooks.getStripeDashboardUrl)
                                                        openEvent!.location.href = sData.cooks.getStripeDashboardUrl;
                                                })
                                                .catch((e) => console.error(e));
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </PEProfileCard>
                </div>

                <div className="flex gap-8 flex-col lg:flex-row">
                    <PEProfileCard title="Bio" className="flex flex-col gap-4 flex-1">
                        {!editBioOn && (
                            <>
                                {cookProfile.biography && (
                                    <span dangerouslySetInnerHTML={{ __html: cookProfile.biography.split('\n').join('<br />') }} />
                                )}
                                {!cookProfile.biography && (
                                    <span>
                                        Deine Bio ist noch leer. Füge eine Profilbeschreibung hinzu in der du über dich, deinen Werdegang
                                        und deine besonderen Talente erzählst um die Aufmerksamkeit von Kunden zu gewinnen.
                                    </span>
                                )}
                                <div className="flex justify-end">
                                    <PEButton title="Bearbeiten" type="secondary" onClick={() => setEditBioOn(true)} />
                                </div>
                            </>
                        )}
                        {editBioOn && (
                            <>
                                <PETextArea id="biography" {...register('biography')} />
                                <div className="flex gap-2 justify-end">
                                    <PEButton
                                        title="Verwerfen"
                                        type="secondary"
                                        onClick={() => {
                                            resetBiography();
                                            setEditBioOn(false);
                                        }}
                                    />
                                    {biographyHasChangesApplied && <PEButton title="Speichern" onClick={updateBio} />}
                                </div>
                            </>
                        )}
                    </PEProfileCard>

                    <PEProfileCard title="Dashboard" className="flex flex-col gap-4 flex-1">
                        {!cookProfile.isVisible && (
                            <div className="flex justify-between items-center">
                                <span>Dein Profil ist aktuell nicht öffentlich</span>
                                {/* <PEButton title="Veröffentlichen" type="secondary" onClick={() => updateIsVisible(false)} /> */}
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                                    checked={false}
                                    readOnly
                                    onClick={() => updateIsVisible(true)}
                                />
                            </div>
                        )}
                        {cookProfile.isVisible && (
                            <div className="flex justify-between items-center">
                                <span>Dein Profil ist aktuell öffentlich</span>
                                {/* <PEButton title="Verstecken" type="secondary" onClick={() => updateIsVisible(true)} /> */}
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                                    checked
                                    readOnly
                                    onClick={() => updateIsVisible(false)}
                                />
                            </div>
                        )}
                    </PEProfileCard>
                </div>

                <PEProfileCard title="Auftragsdetails" className="flex flex-col gap-4">
                    <PESlider
                        id="travelExpenses"
                        labelTitle="Reisekosten je gefahrener Kilometer"
                        step={1}
                        min={0}
                        max={50}
                        {...register('travelExpenses', { min: 0, max: 70, valueAsNumber: true })}
                    >
                        {(travelExpenses / 100).toFixed(2)} €
                    </PESlider>

                    <PESlider
                        id="maximumTravelDistance"
                        labelTitle="Maximale Reisestrecke"
                        step={1}
                        min={5}
                        max={100}
                        {...register('maximumTravelDistance', { min: 5, max: 200, valueAsNumber: true })}
                    >
                        {maximumTravelDistance} km
                    </PESlider>

                    <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                            <Users strokeWidth={1.5} />
                            Maximale Anzahl Teilnehmer pro Einsatz
                        </div>
                        <div className="flex gap-2 items-center">
                            <button
                                type="button"
                                className="rounded-full text-gray-500 ring-gray-500 hover:ring-orange-500 focus:ring-orange-500 ring-1 ring-inset p-1 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 focus-visible:text-white focus-visible:bg-orange-500"
                                onClick={() => setValue('maximumParticipants', maximumParticipants - 1)}
                                disabled={maximumParticipants < 2}
                            >
                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                            </button>

                            <span className="w-4 text-center">{maximumParticipants}</span>
                            <button
                                type="button"
                                className="rounded-full  text-gray-500 ring-gray-500 hover:ring-orange-500 focus:ring-orange-500 ring-1 ring-inset p-1 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 focus-visible:text-white focus-visible:bg-orange-500"
                                onClick={() => setValue('maximumParticipants', maximumParticipants + 1)}
                                disabled={maximumParticipants > 19}
                            >
                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    {bookingDetailsHasChangesApplied && (
                        <div className="flex gap-2 justify-end">
                            <PEButton title="Verwerfen" type="secondary" onClick={resetBookingDetails} />
                            <PEButton title="Änderungen speichern" onClick={updateBookingDetails} />
                        </div>
                    )}
                </PEProfileCard>

                <PEProfileAddressesCard
                    userId={cookId}
                    addresses={cookProfile.user.addresses}
                    onFetchUpdated={updateCookProfile}
                    pin={{ pinnedLocation: cookProfile.location }}
                />

                <PEProfileCard title="Sprachen" className="flex flex-col gap-4">
                    {!editLanguagesOn && (
                        <ul className="flex flex-wrap gap-2">
                            {cookProfile.languages.map(({ languageId, title }) => (
                                <li
                                    key={languageId}
                                    className={classNames(
                                        'px-4 py-2.5',
                                        'text-sm font-semibold text-white',
                                        'rounded-full bg-orange-500 shadow-sm',
                                    )}
                                >
                                    {title}
                                </li>
                            ))}
                        </ul>
                    )}
                    {editLanguagesOn && (
                        <PELabelMultiSelection
                            options={languages}
                            selectedOptions={cookProfile.languages}
                            onSelect={({ languageId }) => addOneCookLanguage({ variables: { cookId, languageId } }).then(updateCookProfile)}
                            onDeselect={({ languageId }) =>
                                removeOneCookLanguage({ variables: { cookId, languageId } }).then(updateCookProfile)
                            }
                            optionTitle={({ title }) => title}
                            optionIdentifier={({ languageId }) => languageId}
                        />
                    )}

                    <div className="flex justify-end">
                        {!editLanguagesOn && <PEButton title="Bearbeiten" type="secondary" onClick={() => setEditLanguagesOn(true)} />}
                        {editLanguagesOn && <PEButton title="Fertig" onClick={() => setEditLanguagesOn(false)} />}
                    </div>
                </PEProfileCard>
            </div>
        </div>
    );
}
