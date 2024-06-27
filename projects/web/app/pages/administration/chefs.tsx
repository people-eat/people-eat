import { LoadingDialog, PEHeader } from '@people-eat/web-components';
import {
    AdminAssignOneSessionDocument,
    AdminGetCooksPageDataDocument,
    AdminGetCooksPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { createApolloClient } from '../../network/apolloClients';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { PEButton } from '@people-eat/web-core-components';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const profilePageRedirect = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialCooks: AdminGetCooksPageDataQuery['cooks']['findMany'];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isAdmin) return profilePageRedirect;

        const result = await apolloClient.query({ query: AdminGetCooksPageDataDocument });

        const initialCooks = result.data.cooks.findMany;

        return {
            props: {
                signedInUser,
                initialCooks,
            },
        };
    } catch (error) {
        console.log(error);
        return signInPageRedirect;
    }
};

export default function AdministrationCooksPage({ signedInUser, initialCooks: cooks }: ServerSideProps) {
    const [signInAsUser, { loading }] = useMutation(AdminAssignOneSessionDocument);
    const router = useRouter();

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading} />

            <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Köche</h1>
                    </div>
                </div>
            </div>

            <div className="mt-8 flow-root overflow-hidden">
                <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                    <table className="w-full text-left">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                    cookId
                                    <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                                    <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Vorname
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Nachname
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Öffentlich
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Stadt
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Stripe aktiv
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Aufrufe (letzte Woche)
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Aufrufe (letzter Monat)
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Aufrufe (gesamt)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cooks.map((cook) => (
                                <tr key={cook.cookId}>
                                    <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                                        {cook.cookId}
                                        <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{cook.user.firstName}</td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{cook.user.lastName}</td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                                        {cook.isVisible ? 'Ja' : 'Nein'}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{cook.city}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        {cook.hasStripePayoutMethodActivated ? 'Ja' : 'Nein'}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        <PEButton
                                            type="secondary"
                                            title="anmelden"
                                            onClick={async () => {
                                                const { data } = await signInAsUser({ variables: { userId: cook.cookId } });

                                                if (data?.sessions.success) {
                                                    router.push('/chef-profile');
                                                }
                                            }}
                                        />
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{cook.visitStatistics.visitCountLastWeek}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{cook.visitStatistics.visitCountLastMonth}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{cook.visitStatistics.visitCountTotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
