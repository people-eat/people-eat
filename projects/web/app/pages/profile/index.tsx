import { useLazyQuery, useMutation } from '@apollo/client';
import { LoadingDialog, PEHeader, PEImagePicker, PEProfileNavigation } from '@people-eat/web-components';
import { PEAlert, PEButton, PELabelMultiSelection, PELink, PESlider, PETextArea } from '@people-eat/web-core-components';
import {
    AddOneCookLanguageDocument,
    CookGetStripeDashboardUrlDocument,
    CookGetStripeOnboardingUrlDocument,
    GetProfilePersonalInformationDocument,
    GetProfilePersonalInformationPageDataDocument,
    GetProfilePersonalInformationPageDataQuery,
    RemoveOneCookLanguageDocument,
    SignedInUser,
    UpdateCookBiographyDocument,
    UpdateCookHasStripePayoutMethodActivatedDocument,
    UpdateCookIsVisibleDocument,
    UpdateCookMaximumParticipantsDocument,
    UpdateCookMaximumTravelDistanceDocument,
    UpdateCookTravelExpensesDocument,
    UpdateUserProfilePictureDocument,
} from '@people-eat/web-domain';
import { MinusIcon, PlusIcon, Users } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnalyticsClarity } from '../../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../../components/analytics/CookieSettings';
import { PEEditPasswordCard } from '../../components/PEEditPasswordCard';
import { PEProfileAddressesCard } from '../../components/PEProfileAddressesCard';
import { PEProfileCard } from '../../components/PEProfileCard';
import { createApolloClient } from '../../network/apolloClients';
import classNames from 'classnames';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialProfile: NonNullable<GetProfilePersonalInformationPageDataQuery['users']['me']>;
    cookieSettings: CookieSettings | null;
    languages: NonNullable<GetProfilePersonalInformationPageDataQuery['languages']['findAll']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetProfilePersonalInformationPageDataDocument });
        const signedInUser = data.users.signedInUser;
        const initialProfile = data.users.me;

        if (!signedInUser || !initialProfile) return signInPageRedirect;

        const languages = data.languages.findAll;

        return {
            props: {
                signedInUser,
                initialProfile,
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

export interface EditCookProfileFormInputs {
    biography: string;
    travelExpenses: number;
    maximumTravelDistance: number;
    maximumParticipants: number;
}

export default function ProfilePersonalInformationPage({ signedInUser, initialProfile, languages, cookieSettings }: ServerSideProps) {
    const router = useRouter();

    const userId = signedInUser.userId;
    const [profile, setProfile] = useState(initialProfile);

    const [getUpdatedProfile, { loading: loadingUpdatedProfile }] = useLazyQuery(GetProfilePersonalInformationDocument);

    function updateProfile() {
        getUpdatedProfile().then(({ data }) => {
            const userProfile = data?.users.me;
            if (!userProfile) return;
            setProfile(userProfile);
        });
    }

    const [updateProfilePicture, { loading: loadingUpdateProfilePicture }] = useMutation(UpdateUserProfilePictureDocument);

    function onUpdateProfilePicture(changedProfilePicture: File | undefined) {
        updateProfilePicture({ variables: { userId, profilePicture: changedProfilePicture } }).then(({ data }) => {
            if (data?.users.success) {
                updateProfile();
            }
        });
    }

    // end of user profile

    const cookId = initialProfile.userId;
    const [editLanguagesOn, setEditLanguagesOn] = useState(false);
    const [editBioOn, setEditBioOn] = useState(false);

    // const [getUpdatedCookProfile, { loading: loadingUpdatedCookProfile }] = useLazyQuery(GetCookProfilePersonalInformationDocument, {
    //     variables: { cookId },
    // });

    function updateCookProfile() {
        getUpdatedProfile().then(({ data }) => {
            const cook = data?.users.me;
            if (!cook) return;
            setProfile(cook);
        });
    }

    const [getStripeOnboardingUrl, { loading: loadingStripeOnboardingUrl }] = useLazyQuery(CookGetStripeOnboardingUrlDocument, {
        variables: { cookId },
    });
    const [getStripeDashboardUrl, { loading: loadingStripeDashboardUrl }] = useLazyQuery(CookGetStripeDashboardUrlDocument, {
        variables: { cookId },
    });

    const { register, watch, setValue } = useForm<EditCookProfileFormInputs>({
        defaultValues: {
            biography: profile.cook?.biography ?? '',
            travelExpenses: profile.cook?.travelExpenses ?? 0,
            maximumTravelDistance: profile.cook?.maximumTravelDistance ?? 0,
            maximumParticipants: profile.cook?.maximumParticipants ?? 2,
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

        if (travelExpenses !== profile.cook?.travelExpenses) updateRequests.push(requestTravelExpensesUpdate());
        if (maximumTravelDistance !== profile.cook?.maximumTravelDistance) updateRequests.push(requestMaximumTravelDistanceUpdate());
        if (maximumParticipants !== profile.cook?.maximumParticipants) updateRequests.push(requestMaximumParticipantsUpdate());

        Promise.all(updateRequests).then(updateCookProfile);
    }

    const [removeOneCookLanguage] = useMutation(RemoveOneCookLanguageDocument);
    const [addOneCookLanguage] = useMutation(AddOneCookLanguageDocument);

    const bookingDetailsHasChangesApplied =
        travelExpenses !== profile.cook?.travelExpenses ||
        maximumTravelDistance !== profile.cook?.maximumTravelDistance ||
        maximumParticipants !== profile.cook?.maximumParticipants;

    function resetBookingDetails() {
        setValue('travelExpenses', profile.cook?.travelExpenses ?? 0);
        setValue('maximumTravelDistance', profile.cook?.maximumTravelDistance ?? 0);
        setValue('maximumParticipants', profile.cook?.maximumParticipants ?? 2);
    }

    const biographyHasChangesApplied = biography !== profile.cook?.biography;

    function resetBiography() {
        setValue('biography', profile.cook?.biography ?? '');
    }

    const [requestIsVisibleUpdate, { loading: loadingUpdateIsVisible }] = useMutation(UpdateCookIsVisibleDocument);

    async function updateIsVisible(changedIsVisible: boolean) {
        await requestIsVisibleUpdate({ variables: { cookId, isVisible: changedIsVisible } });
        updateCookProfile();
    }

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

    const loading =
        loadingUpdatedProfile ||
        loadingUpdateProfilePicture ||
        loadingStripeOnboardingUrl ||
        loadingStripeDashboardUrl ||
        updateBioLoading ||
        loadingUpdateIsVisible ||
        loadingUpdateProfilePicture ||
        walletUpdateLoading;

    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

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

            <div className="absolute inset-0 flex flex-col gap-8">
                <PEHeader signedInUser={signedInUser} />

                <div className="max-w-[88rem] mx-auto w-full px-6">
                    <PEProfileNavigation current="PERSONAL_INFORMATION" className="px-4 sm:px-0 flex-auto" isCook={signedInUser.isCook} />
                </div>

                <div className="max-w-[88rem] w-full mx-auto px-8 sm:pb-4 flex flex-col gap-4 flex-1">
                    <div className="md:ml-8 flex justify-between items-start xs:items-center flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-2">
                            <span className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">Hallo {profile.firstName}!</span>
                        </div>
                        {!profile.isCook && (
                            <div>
                                <PELink type="primary" title="Als Koch registrieren" href="/chef-sign-up" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-8 flex-col lg:flex-row">
                        <PEProfileCard className="flex flex-col gap-8 flex-1">
                            <h3 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">Profilbild</h3>

                            {/* <UserCircle width={64} height={64} strokeWidth={1} /> */}

                            <PEImagePicker
                                onPick={onUpdateProfilePicture}
                                defaultImage={profile.profilePictureUrl ?? undefined}
                                onRemoveDefaultImage={() => onUpdateProfilePicture(undefined)}
                            />
                        </PEProfileCard>

                        <PEProfileCard title="Über mich" className="flex flex-col gap-8 flex-1">
                            <div className="h-full flex flex-col gap-8 justify-between">
                                <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
                                    <div className="pt-6 sm:flex">
                                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Vorname</dt>
                                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                            <div className="text-gray-900">{profile.firstName}</div>
                                        </dd>
                                    </div>
                                    <div className="pt-6 sm:flex">
                                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Nachname</dt>
                                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                            <div className="text-gray-900">{profile.lastName}</div>
                                        </dd>
                                    </div>
                                    <div className="pt-6 sm:flex">
                                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">E-Mail Adresse</dt>
                                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                            <div className="text-gray-900">{profile.emailAddress ?? 'Keine Angabe'}</div>
                                        </dd>
                                    </div>
                                    <div className="pt-6 sm:flex">
                                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Telefonnummer</dt>
                                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                            <div className="text-gray-900">
                                                {profile.phoneNumber ??
                                                    (profile.phoneNumberUpdate?.phoneNumber
                                                        ? `${profile.phoneNumberUpdate.phoneNumber} (nicht bestätigt)`
                                                        : undefined) ??
                                                    'Keine Angabe'}
                                            </div>
                                        </dd>
                                    </div>
                                    <div className="pt-6 sm:flex">
                                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Geburtsdatum</dt>
                                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                            <div className="text-gray-900">{profile.birthDate ?? 'Keine Angabe'}</div>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </PEProfileCard>
                    </div>

                    {profile.cook && (
                        <div className="flex gap-8 flex-col lg:flex-row">
                            <PEProfileCard title="Bio" className="flex flex-col gap-4 flex-1">
                                {!editBioOn && (
                                    <>
                                        {profile.cook.biography && (
                                            <span dangerouslySetInnerHTML={{ __html: profile.cook.biography.split('\n').join('<br />') }} />
                                        )}
                                        {!profile.cook.biography && (
                                            <span>
                                                Deine Bio ist noch leer. Füge eine Profilbeschreibung hinzu in der du über dich, deinen
                                                Werdegang und deine besonderen Talente erzählst um die Aufmerksamkeit von Kunden zu
                                                gewinnen.
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

                            <PEProfileCard title="Auftragsdetails" className="flex flex-col gap-4 flex-1">
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
                        </div>
                    )}

                    {profile.cook && (
                        <div className="flex gap-8 flex-col lg:flex-row">
                            <PEProfileCard title="Finanzen" className="flex flex-col gap-8 flex-1">
                                <div className="h-full flex flex-col gap-8 justify-between">
                                    <div className="text-gray-600">
                                        Deine Wallet ist der Ort an dem du die Überischt über all deine Einkünfte und ggf. Ausgaben finden
                                        kannst. Ohne eine Wallet sind keine Auszahlungen auf dein privates Bankkonto möglich.
                                    </div>
                                    <div className="flex justify-end">
                                        {!profile.cook.hasStripePayoutMethodActivated && (
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
                                        {profile.cook.hasStripePayoutMethodActivated && (
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

                            <PEProfileCard title="Dashboard" className="flex flex-col gap-4 flex-1">
                                {!profile.cook.isVisible && (
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
                                {profile.cook.isVisible && (
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
                    )}

                    <div className="flex gap-8 flex-col lg:flex-row">
                        {profile.cook && (
                            <PEProfileCard title="Sprachen" className="flex flex-col gap-4 flex-1">
                                {!editLanguagesOn && (
                                    <ul className="flex flex-wrap gap-2">
                                        {profile.cook.languages.map(({ languageId, title }) => (
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
                                        selectedOptions={profile.cook.languages}
                                        onSelect={({ languageId }) =>
                                            addOneCookLanguage({ variables: { cookId, languageId } }).then(updateCookProfile)
                                        }
                                        onDeselect={({ languageId }) =>
                                            removeOneCookLanguage({ variables: { cookId, languageId } }).then(updateCookProfile)
                                        }
                                        optionTitle={({ title }) => title}
                                        optionIdentifier={({ languageId }) => languageId}
                                    />
                                )}

                                <div className="flex justify-end">
                                    {!editLanguagesOn && (
                                        <PEButton title="Bearbeiten" type="secondary" onClick={() => setEditLanguagesOn(true)} />
                                    )}
                                    {editLanguagesOn && <PEButton title="Fertig" onClick={() => setEditLanguagesOn(false)} />}
                                </div>
                            </PEProfileCard>
                        )}

                        <PEProfileAddressesCard
                            userId={signedInUser.userId}
                            addresses={profile.addresses}
                            onFetchUpdated={updateProfile}
                            pin={profile.cook ? { pinnedLocation: profile.cook.location } : undefined}
                        />
                    </div>

                    <PEEditPasswordCard userId={userId} />
                </div>
            </div>
        </>
    );
}
