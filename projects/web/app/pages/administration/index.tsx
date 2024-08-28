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

const tabs: { title: string; path: string }[] = [
    { title: 'Promo Codes', path: '/administration/promo-codes' },
    { title: 'Gift Cards', path: '/administration/gift-cards' },
    { title: 'Benutzer', path: '/administration/users' },
    { title: 'Köche', path: '/administration/chefs' },
    { title: 'Allgemeine Geschäftsbedingungen', path: '/administration/terms-and-conditions' },
    { title: 'Datenschutzerklärung', path: '/administration/privacy-policy' },
    { title: 'Buchungsanfragen', path: '/administration/booking-requests' },
];

export default function AdministrationPage({ signedInUser }: ServerSideProps) {
    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-[88rem] px-4 md:pb-8 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold mb-8">Administration</h1>

                <ul className="flex gap-4 flex-wrap">
                    {tabs.map((tab) => (
                        <li key={tab.path}>
                            <Link
                                className="flex w-48 h-32 shadow-md rounded-xl justify-center items-center text-center font-semibold"
                                href={tab.path}
                            >
                                {tab.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
