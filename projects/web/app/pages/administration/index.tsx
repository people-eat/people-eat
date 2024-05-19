import { PEHeader } from '@people-eat/web-components';
import { GetSignedInUserDocument, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { createApolloClient } from '../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const profilePageRedirect = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isAdmin) return profilePageRedirect;

        return {
            props: {
                signedInUser,
            },
        };
    } catch (error) {
        return signInPageRedirect;
    }
};

export default function AdministrationPage({ signedInUser }: ServerSideProps) {
    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="m-11">
                <h1 className="text-2xl font-bold">Administration</h1>
                <ul>
                    <li>
                        <Link href="/administration/promo-codes">Promo Codes</Link>
                    </li>
                    <li>
                        <Link href="/administration/gift-cards">Gift Cards</Link>
                    </li>
                    <li>
                        <Link href="/administration/users">Benutzer</Link>
                    </li>
                    <li>
                        <Link href="/administration/chefs">Köche</Link>
                    </li>
                    <li>
                        <Link href="/administration/terms-and-conditions">Allgemeine Geschäftsbedingungen</Link>
                    </li>
                    <li>
                        <Link href="/administration/privacy-policy">Datenschutzerklärung</Link>
                    </li>
                    <li>
                        <Link href="/administration/global-booking-requests">Globale Buchungsanfragen</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
