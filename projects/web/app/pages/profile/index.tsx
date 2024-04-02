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
import { PEEditPasswordCard } from '../../components/PEEditPasswordCard';
import { PEProfileAddressesCard } from '../../components/PEProfileAddressesCard';
import { PEProfileCard } from '../../components/PEProfileCard';
import { createApolloClient } from '../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialProfile: NonNullable<GetProfilePersonalInformationPageDataQuery['users']['me']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const result = await apolloClient.query({ query: GetProfilePersonalInformationPageDataDocument });
        const signedInUser = result.data.users.signedInUser;
        const initialProfile = result.data.users.me;

        if (!signedInUser || !initialProfile) return signInPageRedirect;

        return {
            props: {
                signedInUser,
                initialProfile,
            },
        };
    } catch (error) {
        return signInPageRedirect;
    }
};

export default function ProfilePersonalInformationPage({ signedInUser, initialProfile }: ServerSideProps) {
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
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PEProfileNavigation current="PERSONAL_INFORMATION" />

                <LoadingDialog active={loading} />

                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2 ml-8">
                        <span className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">Hallo {profile.firstName}!</span>
                    </div>
                    {profile.isCook && (
                        <div>
                            <PELink type="secondary" title="Zum Kochprofil" href="/chef-profile" />
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
                                        <div className="text-gray-900">{profile.phoneNumber ?? 'Keine Angabe'}</div>
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

                <PEEditPasswordCard />
            </div>
        </div>
    );
}
