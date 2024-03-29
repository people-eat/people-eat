import { PEHeader, PEProfileNavigation } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';
import {
    GetProfilePersonalInformationPageDataDocument,
    GetProfilePersonalInformationPageDataQuery,
    SignedInUser,
} from '@people-eat/web-domain';
import { UserCircle } from 'lucide-react';
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
    const [profile] = useState(initialProfile);

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PEProfileNavigation current="PERSONAL_INFORMATION" />

                <PEProfileCard className="flex gap-8 justify-between">
                    <div className="flex gap-8 items-center">
                        <UserCircle width={64} height={64} strokeWidth={1} />
                        <div className="flex flex-col gap-2">
                            <span className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{profile.firstName}</span>
                            <span className="truncate text-sm font-medium text-gray-500">{profile.lastName}</span>
                        </div>
                    </div>
                    {profile.isCook && (
                        <div>
                            <PELink type="secondary" title="Zum Kochprofil" href="/chef-profile" />
                        </div>
                    )}
                </PEProfileCard>

                <PEProfileAddressesCard userId={signedInUser.userId} addresses={profile.addresses} onFetchUpdated={() => undefined} />

                <PEEditPasswordCard />
            </div>
        </div>
    );
}
