import { useLazyQuery, useMutation } from '@apollo/client';
import { LoadingDialog, PECookProfileNavigation, PEHeader, PEImagePicker } from '@people-eat/web-components';
import { PEButton, PELabelMultiSelection, PELink, PESlider, PETextArea } from '@people-eat/web-core-components';
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
    UpdateCookMaximumParticipantsDocument,
    UpdateCookMaximumTravelDistanceDocument,
    UpdateCookTravelExpensesDocument,
    UpdateUserProfilePictureDocument,
    translatedCookRanks,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { MinusIcon, PlusIcon, Users } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEProfileAddressesCard } from '../../components/PEProfileAddressesCard';
import { PEProfileCard } from '../../components/PEProfileCard';
import { createApolloClient } from '../../network/apolloClients';

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
    initialCookProfile: NonNullable<GetCookProfilePersonalInformationPageDataQuery['cooks']['findOne']>;
    languages: NonNullable<GetCookProfilePersonalInformationPageDataQuery['languages']['findAll']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;
        const cookId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetCookProfilePersonalInformationPageDataDocument, variables: { cookId } });
        const initialCookProfile = result.data.cooks.findOne;
        if (!initialCookProfile) return signInPageRedirect;

        const languages = result.data.languages.findAll;

        return {
            props: {
                signedInUser,
                initialCookProfile,
                languages,
            },
        };
    } catch (error) {
        return signInPageRedirect;
    }
};

export default function CookProfilePage({ signedInUser, initialCookProfile, languages }: ServerSideProps) {
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

    const loading =
        loadingUpdatedCookProfile ||
        loadingStripeOnboardingUrl ||
        loadingStripeDashboardUrl ||
        updateBioLoading ||
        loadingUpdateProfilePicture;

    return (
        <div>
            <LoadingDialog active={loading} />

            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
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

                <PEProfileCard title="Bio" className="flex flex-col gap-4">
                    {!editBioOn && (
                        <>
                            {cookProfile.biography && <span>{cookProfile.biography}</span>}
                            {!cookProfile.biography && (
                                <span>
                                    Deine Bio ist noch leer. Füge eine Profilbeschreibung hinzu in der du über dich, deinen Werdegang und
                                    deine besonderen Talente erzählst um die Aufmerksamkeit von Kunden zu gewinnen.
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

                <PEProfileCard title="Auftragsdetails" className="flex flex-col gap-4">
                    <PESlider
                        id="travelExpenses"
                        labelTitle="Reisekosten je gefahrener Kilometer"
                        step={1}
                        min={0}
                        max={70}
                        {...register('travelExpenses', { min: 0, max: 70, valueAsNumber: true })}
                    >
                        {(travelExpenses / 100).toFixed(2)} €
                    </PESlider>

                    <PESlider
                        id="maximumTravelDistance"
                        labelTitle="Maximale Reisestrecke"
                        step={1}
                        min={5}
                        max={200}
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
                                role="button"
                                className="rounded-full text-gray-500 ring-gray-500 hover:ring-orange-500 focus:ring-orange-500 ring-1 ring-inset p-1 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 focus-visible:text-white focus-visible:bg-orange-500"
                                onClick={() => setValue('maximumParticipants', maximumParticipants - 1)}
                                disabled={maximumParticipants < 2}
                            >
                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                            </button>

                            <span className="w-4 text-center">{maximumParticipants}</span>
                            <button
                                role="button"
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
