import { LoadingDialog, PEHeader, PEImagePicker, PEProfileNavigation } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';
import {
    GetProfilePersonalInformationPageDataDocument,
    GetProfilePersonalInformationPageDataQuery,
    SignedInUser,
    UpdateUserProfilePictureDocument,
} from '@people-eat/web-domain';
import { UserCircle } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { PEEditPasswordCard } from '../../components/PEEditPasswordCard';
import { PEProfileAddressesCard } from '../../components/PEProfileAddressesCard';
import { PEProfileCard } from '../../components/PEProfileCard';
import { createApolloClient } from '../../network/apolloClients';
import { useMutation } from '@apollo/client';

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
    const [profile] = useState(initialProfile);

    const [updateProfilePicture, { loading: loadingUpdateProfilePicture }] = useMutation(UpdateUserProfilePictureDocument);

    function onUpdateProfilePicture(changedProfilePicture: File | undefined) {
        updateProfilePicture({ variables: { userId, profilePicture: changedProfilePicture } }).then(({ data }) => {
            if (data?.users.success) {
                // updateCookProfile();
            }
        });
    }

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PEProfileNavigation current="PERSONAL_INFORMATION" />

                <LoadingDialog active={loadingUpdateProfilePicture} />

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
                            <div>
                                <div>Vorname: {profile.firstName}</div>
                                <div>Nachname: {profile.lastName}</div>
                                <div>Email: {profile.emailAddress}</div>
                                <div>Telefonnummert: {profile.phoneNumber ?? 'Keine Angabe'}</div>
                                <div>Geburtsdatum: {profile.birthDate ?? 'Keine Angabe'}</div>
                            </div>
                        </div>
                    </PEProfileCard>
                </div>

                <PEProfileAddressesCard userId={signedInUser.userId} addresses={profile.addresses} onFetchUpdated={() => undefined} />

                <PEEditPasswordCard />
            </div>
        </div>
    );
}
