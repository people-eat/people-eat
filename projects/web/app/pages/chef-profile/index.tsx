import { PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';
import {
    GetCookProfilePersonalInformationPageDataDocument,
    GetCookProfilePersonalInformationPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
} from '@people-eat/web-domain';
import { UserCircle } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { PEAddressesCard } from '../../components/PEAddressesCard';
import { PEProfileCard } from '../../components/PEProfileCard';
import { createApolloClient } from '../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

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
    const [cookProfile] = useState(initialCookProfile);

    return (
        <div>
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
                        <PELink type="secondary" title="Zum Gastgeberprofil" href="/profile" />
                    </div>
                </PEProfileCard>

                <PEProfileCard title="Ein- und Auszahlungen"></PEProfileCard>

                <PEProfileCard title="Bio" className="flex flex-col gap-4">
                    {cookProfile.biography && <span>{cookProfile.biography}</span>}
                    {!cookProfile.biography && (
                        <span>
                            Deine Bio ist noch leer. Füge eine Profilbeschreibung hinzu in der du über dich, deinen Werdegang und deine
                            besonderen Talente erzählst um die Aufmerksamkeit von Kunden zu gewinnen.
                        </span>
                    )}
                </PEProfileCard>

                <PEProfileCard title="Auftragsdetails"></PEProfileCard>

                <PEAddressesCard addresses={cookProfile.user.addresses} />

                <PEProfileCard title="Sprachen" className="flex flex-col gap-4">
                    <ul className="flex flex-col gap-2">
                        {cookProfile.languages.map(({ languageId, title }) => (
                            <li key={languageId}>- {title}</li>
                        ))}
                    </ul>
                </PEProfileCard>
            </div>
        </div>
    );
}
