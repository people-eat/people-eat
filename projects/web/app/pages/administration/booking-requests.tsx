import { PEHeader } from '@people-eat/web-components';
import {
    AdminGetBookingRequestsPageDataDocument,
    AdminGetBookingRequestsPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { AdminBookingRequestsTable } from '../../components/administration/AdminBookingRequestsTable';
import { AdminGlobalBookingRequestsTable } from '../../components/administration/AdminGlobalBookingRequestsTable';
import { createApolloClient } from '../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const profilePageRedirect = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialGlobalBookingRequests: NonNullable<AdminGetBookingRequestsPageDataQuery['globalBookingRequests']['findMany']>;
    initialBookingRequests: NonNullable<AdminGetBookingRequestsPageDataQuery['bookingRequests']['findMany']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isAdmin) return profilePageRedirect;

        const result = await apolloClient.query({ query: AdminGetBookingRequestsPageDataDocument });

        const initialGlobalBookingRequests = result.data.globalBookingRequests.findMany!;
        const initialBookingRequests = result.data.bookingRequests.findMany!;

        return {
            props: {
                signedInUser,
                initialGlobalBookingRequests,
                initialBookingRequests,
            },
        };
    } catch (error) {
        console.log(error);
        return signInPageRedirect;
    }
};

export default function AdministrationGlobalBookingRequestsPage({
    signedInUser,
    initialGlobalBookingRequests: globalBookingRequests,
    initialBookingRequests: bookingRequests,
}: ServerSideProps) {
    const [tab, setTab] = useState<'GLOBAL' | 'NORMAL'>('GLOBAL');

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div>
                            <div className="sm:hidden">
                                <label htmlFor="tabs" className="sr-only">
                                    Select a tab
                                </label>
                                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                                <select
                                    id="tabs"
                                    name="tabs"
                                    defaultValue={tab}
                                    className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                    onChange={(e) => setTab(e.target.value as 'GLOBAL' | 'NORMAL')}
                                >
                                    <option value="NORMAL">Menü Buchungsanfragen</option>
                                    <option value="GLOBAL">Globale Buchungsanfragen</option>
                                </select>
                            </div>
                            <div className="hidden sm:block">
                                <nav aria-label="Tabs" className="flex space-x-4">
                                    <button
                                        onClick={() => setTab('NORMAL')}
                                        className={classNames(
                                            tab === 'NORMAL' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        Menü Buchungsanfragen
                                    </button>
                                    <button
                                        onClick={() => setTab('GLOBAL')}
                                        className={classNames(
                                            tab === 'GLOBAL' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        Globale Buchungsanfragen
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flow-root overflow-hidden">
                <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                    {tab === 'GLOBAL' && <AdminGlobalBookingRequestsTable globalBookingRequests={globalBookingRequests} />}
                    {tab === 'NORMAL' && <AdminBookingRequestsTable bookingRequests={bookingRequests} />}
                </div>
            </div>
        </div>
    );
}
