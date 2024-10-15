import { PEHeader } from '@people-eat/web-components';
import { AdminGetPageDataDocument, AdminGetPageDataQuery, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps, Redirect } from 'next';
import Link from 'next/link';
import { Chart } from 'react-google-charts';
import { redirectTo } from '../../components/redirectTo';
import { createApolloClient } from '../../network/apolloClients';

const profilePageRedirect: { redirect: Redirect } = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    countMetrics: NonNullable<NonNullable<AdminGetPageDataQuery['sessions']['current']['user']>['admin']>['metrics']['count'];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: AdminGetPageDataDocument });
        const user = data.sessions.current.user;
        if (!user) return redirectTo.signIn({ returnTo: req.url });
        if (!user.admin) return profilePageRedirect;

        return {
            props: {
                signedInUser: user,
                countMetrics: user.admin.metrics.count,
            },
        };
    } catch (error) {
        return redirectTo.signIn({ returnTo: req.url });
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

export default function AdministrationPage({ signedInUser, countMetrics }: ServerSideProps) {
    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-[88rem] px-4 md:pb-8 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold mb-8">Administration</h1>

                <ul className="flex gap-4 flex-wrap mb-8">
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

                <Chart
                    chartType="ColumnChart"
                    width="100%"
                    options={{
                        title: 'Benutzer Erstellungen',
                        // vAxis: { title: 'Anzahl' },
                        // hAxis: { title: 'Zeit' },
                    }}
                    data={[
                        ['Element', 'Alle', 'Kunden Profile', 'Köche Profile'],
                        [
                            'vor 4 Wochen',
                            countMetrics.totalUserCreations4WeeksAgo,
                            countMetrics.totalCustomerCreations4WeeksAgo,
                            countMetrics.totalCookCreations4WeeksAgo,
                        ],
                        [
                            'vor 3 Wochen',
                            countMetrics.totalUserCreations3WeeksAgo,
                            countMetrics.totalCustomerCreations3WeeksAgo,
                            countMetrics.totalCookCreations3WeeksAgo,
                        ],
                        [
                            'vor 2 Wochen',
                            countMetrics.totalUserCreations2WeeksAgo,
                            countMetrics.totalCustomerCreations2WeeksAgo,
                            countMetrics.totalCookCreations2WeeksAgo,
                        ],
                        [
                            'letzte Woche',
                            countMetrics.totalUserCreationsLastWeek,
                            countMetrics.totalCustomerCreationsLastWeek,
                            countMetrics.totalCookCreationsLastWeek,
                        ],
                    ]}
                />
                <Chart
                    chartType="ColumnChart"
                    width="100%"
                    options={{
                        title: 'Suchanfragen',
                    }}
                    data={[
                        ['Element', 'Alle', 'Home Seite', 'Menü Seite', 'Köche Seite'],
                        [
                            'vor 4 Wochen',
                            countMetrics.totalSearchRequests4WeeksAgo,
                            countMetrics.totalHomeSearchRequests4WeeksAgo,
                            countMetrics.totalMenuSearchRequests4WeeksAgo,
                            countMetrics.totalCookSearchRequests4WeeksAgo,
                        ],
                        [
                            'vor 3 Wochen',
                            countMetrics.totalSearchRequests3WeeksAgo,
                            countMetrics.totalHomeSearchRequests3WeeksAgo,
                            countMetrics.totalMenuSearchRequests3WeeksAgo,
                            countMetrics.totalCookSearchRequests3WeeksAgo,
                        ],
                        [
                            'vor 2 Wochen',
                            countMetrics.totalSearchRequests2WeeksAgo,
                            countMetrics.totalHomeSearchRequests2WeeksAgo,
                            countMetrics.totalMenuSearchRequests2WeeksAgo,
                            countMetrics.totalCookSearchRequests2WeeksAgo,
                        ],
                        [
                            'letzte Woche',
                            countMetrics.totalSearchRequestsLastWeek,
                            countMetrics.totalHomeSearchRequestsLastWeek,
                            countMetrics.totalMenuSearchRequestsLastWeek,
                            countMetrics.totalCookSearchRequestsLastWeek,
                        ],
                    ]}
                />
                <Chart
                    chartType="ColumnChart"
                    width="100%"
                    options={{
                        title: 'Session Erstellungen',
                    }}
                    data={[
                        ['Element', 'Anzahl', { role: 'style' }],
                        ['vor 4 Wochen', countMetrics.totalSessions4WeeksAgo, 'rgb(51, 102, 204)'],
                        ['vor 3 Wochen', countMetrics.totalSessions3WeeksAgo, 'rgb(51, 102, 204)'],
                        ['vor 2 Wochen', countMetrics.totalSessions2WeeksAgo, 'rgb(51, 102, 204)'],
                        ['letzte Woche', countMetrics.totalSessionsLastWeek, 'rgb(51, 102, 204)'],
                    ]}
                />
            </div>
        </div>
    );
}
