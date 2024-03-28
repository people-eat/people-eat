import { useLazyQuery } from '@apollo/client';
import { LoadingDialog, PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import { PEButton, PELink, PESlider } from '@people-eat/web-core-components';
import {
    CookGetStripeDashboardUrlDocument,
    CookGetStripeOnboardingUrlDocument,
    GetCookProfilePersonalInformationPageDataDocument,
    GetCookProfilePersonalInformationPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
} from '@people-eat/web-domain';
import { MinusIcon, PlusIcon, UserCircle, Users } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEAddressesCard } from '../../components/PEAddressesCard';
import { PEProfileCard } from '../../components/PEProfileCard';
import { createApolloClient } from '../../network/apolloClients';
import classNames from 'classnames';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

export interface EditCookProfileFormInputs {
    travelExpenses: number;
    maximumTravelDistance: number;
    maximumParticipants: number;
}

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialCookProfile: NonNullable<GetCookProfilePersonalInformationPageDataQuery['cooks']['findOne']>;
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

        return {
            props: {
                signedInUser,
                initialCookProfile,
            },
        };
    } catch (error) {
        return signInPageRedirect;
    }
};

export default function CookProfilePage({ signedInUser, initialCookProfile }: ServerSideProps) {
    const cookId = initialCookProfile.cookId;
    const [cookProfile] = useState(initialCookProfile);
    const [editLanguagesOn, setEditLanguagesOn] = useState(false);
    const [editBioOn, setEditBioOn] = useState(false);

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
        reset,
        setValue,
        // formState: { errors },
    } = useForm<EditCookProfileFormInputs>({
        defaultValues: {
            travelExpenses: initialCookProfile.travelExpenses,
            maximumTravelDistance: initialCookProfile.maximumTravelDistance ?? 0,
            maximumParticipants: initialCookProfile.maximumParticipants ?? 2,
        },
    });

    const { travelExpenses, maximumTravelDistance, maximumParticipants } = watch();

    const bookingDetailsHasChangesApplied =
        travelExpenses !== initialCookProfile.travelExpenses ||
        maximumTravelDistance !== initialCookProfile.maximumTravelDistance ||
        maximumParticipants !== initialCookProfile.maximumParticipants;

    function resetBookingDetails() {
        reset({
            travelExpenses: initialCookProfile.travelExpenses,
            maximumTravelDistance: initialCookProfile.maximumTravelDistance ?? 0,
            maximumParticipants: initialCookProfile.maximumParticipants ?? 2,
        });
    }

    return (
        <div>
            <LoadingDialog active={loadingStripeOnboardingUrl || loadingStripeDashboardUrl} />
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PECookProfileNavigation current="PERSONAL_INFORMATION" />

                <PEProfileCard className="flex gap-8 justify-between">
                    <div className="flex gap-8 items-center">
                        <UserCircle width={64} height={64} strokeWidth={1} />
                        <div className="flex flex-col gap-2">
                            <span className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{cookProfile.user.firstName}</span>
                            <span className="truncate text-sm font-medium text-gray-500">{cookProfile.rank}</span>
                        </div>
                    </div>
                    <div>
                        <PELink type="secondary" title="Zum Gastgeberprofil" href="/profile" className="hidden md:block" />
                    </div>
                </PEProfileCard>

                <PEProfileCard title="Finanzen" className="flex justify-between">
                    {!initialCookProfile.hasStripePayoutMethodActivated && (
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
                    {initialCookProfile.hasStripePayoutMethodActivated && (
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
                </PEProfileCard>

                <PEProfileCard title="Bio" className="flex flex-col gap-4">
                    {cookProfile.biography && <span>{cookProfile.biography}</span>}
                    {!cookProfile.biography && (
                        <span>
                            Deine Bio ist noch leer. Füge eine Profilbeschreibung hinzu in der du über dich, deinen Werdegang und deine
                            besonderen Talente erzählst um die Aufmerksamkeit von Kunden zu gewinnen.
                        </span>
                    )}
                </PEProfileCard>

                <PEProfileCard title="Auftragsdetails" className="flex flex-col gap-4">
                    <PESlider id="travelExpenses" labelTitle="Reisekosten" step={1} {...register('travelExpenses', { min: 0, max: 70 })}>
                        {(travelExpenses / 100).toFixed(2)} €
                    </PESlider>

                    <PESlider
                        id="maximumTravelDistance"
                        labelTitle="Maximale Reisestrecke"
                        step={1}
                        {...register('maximumTravelDistance', { min: 0, max: 70 })}
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
                            <PEButton title="Änderungen speichern" />
                        </div>
                    )}
                </PEProfileCard>

                <PEAddressesCard addresses={cookProfile.user.addresses} />

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
                        <>
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
                        </>
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
