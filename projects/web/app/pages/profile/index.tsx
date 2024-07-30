import { useLazyQuery, useMutation } from '@apollo/client';
import { LoadingDialog, PEHeader, PEImagePicker, PEProfileNavigation } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';
import {
    GetProfilePersonalInformationDocument,
    GetProfilePersonalInformationPageDataDocument,
    GetProfilePersonalInformationPageDataQuery,
    SignedInUser,
    UpdateUserProfilePictureDocument,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { AnalyticsClarity } from '../../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../../components/analytics/CookieSettings';
import { PEEditPasswordCard } from '../../components/PEEditPasswordCard';
import { PEProfileAddressesCard } from '../../components/PEProfileAddressesCard';
import { PEProfileCard } from '../../components/PEProfileCard';
import { createApolloClient } from '../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialProfile: NonNullable<GetProfilePersonalInformationPageDataQuery['users']['me']>;
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetProfilePersonalInformationPageDataDocument });
        const signedInUser = data.users.signedInUser;
        const initialProfile = data.users.me;

        if (!signedInUser || !initialProfile) return signInPageRedirect;

        return {
            props: {
                signedInUser,
                initialProfile,
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

export default function ProfilePersonalInformationPage({ signedInUser, initialProfile, cookieSettings }: ServerSideProps) {
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

    const loading = loadingUpdatedProfile || loadingUpdateProfilePicture;

    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <LoadingDialog active={loading} />

            <div className="absolute inset-0 flex flex-col gap-8">
                <PEHeader signedInUser={signedInUser} />

                <div className="max-w-[88rem] mx-auto w-full px-4">
                    <PEProfileNavigation current="PERSONAL_INFORMATION" className="px-4 sm:px-0 flex-auto" />
                </div>

                <div className="max-w-[88rem] w-full mx-auto px-8 sm:pb-4 flex flex-col gap-4 flex-1">
                    <div className="md:ml-8 flex justify-between items-start xs:items-center flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-2">
                            <span className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">Hallo {profile.firstName}!</span>
                        </div>
                        {profile.isCook && (
                            <div>
                                <PELink type="secondary" title="Zum Kochprofil" href="/chef-profile" />
                            </div>
                        )}
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

                    <PEProfileAddressesCard userId={signedInUser.userId} addresses={profile.addresses} onFetchUpdated={updateProfile} />

                    <PEEditPasswordCard userId={userId} />
                </div>
            </div>
        </>
    );
}
