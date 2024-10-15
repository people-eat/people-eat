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

                <div className="flex flex-col gap-32">
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        options={{ title: 'Benutzer Erstellungen - letzte 4 Wochen' }}
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
                        options={{ title: 'Benutzer Erstellungen - letzte 12 Monate' }}
                        data={[
                            ['Element', 'Alle', 'Kunden Profile', 'Köche Profile'],
                            [
                                'vor 12 Monaten',
                                countMetrics.totalUserCreations12MonthsAgo,
                                countMetrics.totalCustomerCreations12MonthsAgo,
                                countMetrics.totalCookCreations12MonthsAgo,
                            ],
                            [
                                'vor 11 Monaten',
                                countMetrics.totalUserCreations11MonthsAgo,
                                countMetrics.totalCustomerCreations11MonthsAgo,
                                countMetrics.totalCookCreations11MonthsAgo,
                            ],
                            [
                                'vor 10 Monaten',
                                countMetrics.totalUserCreations10MonthsAgo,
                                countMetrics.totalCustomerCreations10MonthsAgo,
                                countMetrics.totalCookCreations10MonthsAgo,
                            ],
                            [
                                'vor 9 Monaten',
                                countMetrics.totalUserCreations9MonthsAgo,
                                countMetrics.totalCustomerCreations9MonthsAgo,
                                countMetrics.totalCookCreations9MonthsAgo,
                            ],
                            [
                                'vor 8 Monaten',
                                countMetrics.totalUserCreations8MonthsAgo,
                                countMetrics.totalCustomerCreations8MonthsAgo,
                                countMetrics.totalCookCreations8MonthsAgo,
                            ],
                            [
                                'vor 7 Monaten',
                                countMetrics.totalUserCreations7MonthsAgo,
                                countMetrics.totalCustomerCreations7MonthsAgo,
                                countMetrics.totalCookCreations7MonthsAgo,
                            ],
                            [
                                'vor 6 Monaten',
                                countMetrics.totalUserCreations6MonthsAgo,
                                countMetrics.totalCustomerCreations6MonthsAgo,
                                countMetrics.totalCookCreations6MonthsAgo,
                            ],
                            [
                                'vor 5 Monaten',
                                countMetrics.totalUserCreations5MonthsAgo,
                                countMetrics.totalCustomerCreations5MonthsAgo,
                                countMetrics.totalCookCreations5MonthsAgo,
                            ],
                            [
                                'vor 4 Monaten',
                                countMetrics.totalUserCreations4MonthsAgo,
                                countMetrics.totalCustomerCreations4MonthsAgo,
                                countMetrics.totalCookCreations4MonthsAgo,
                            ],
                            [
                                'vor 3 Monaten',
                                countMetrics.totalUserCreations3MonthsAgo,
                                countMetrics.totalCustomerCreations3MonthsAgo,
                                countMetrics.totalCookCreations3MonthsAgo,
                            ],
                            [
                                'vor 2 Monaten',
                                countMetrics.totalUserCreations2MonthsAgo,
                                countMetrics.totalCustomerCreations2MonthsAgo,
                                countMetrics.totalCookCreations2MonthsAgo,
                            ],
                            [
                                'letzten Monat',
                                countMetrics.totalUserCreationsLastMonth,
                                countMetrics.totalCustomerCreationsLastMonth,
                                countMetrics.totalCookCreationsLastMonth,
                            ],
                        ]}
                    />
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        options={{ title: 'Suchanfragen - letzte 4 Wochen' }}
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
                        options={{ title: 'Suchanfragen - letzte 12 Monate' }}
                        data={[
                            ['Element', 'Alle', 'Home Seite', 'Menü Seite', 'Köche Seite'],
                            [
                                'vor 12 Monaten',
                                countMetrics.totalSearchRequests12MonthsAgo,
                                countMetrics.totalHomeSearchRequests12MonthsAgo,
                                countMetrics.totalMenuSearchRequests12MonthsAgo,
                                countMetrics.totalCookSearchRequests12MonthsAgo,
                            ],
                            [
                                'vor 11 Monaten',
                                countMetrics.totalSearchRequests11MonthsAgo,
                                countMetrics.totalHomeSearchRequests11MonthsAgo,
                                countMetrics.totalMenuSearchRequests11MonthsAgo,
                                countMetrics.totalCookSearchRequests11MonthsAgo,
                            ],
                            [
                                'vor 10 Monaten',
                                countMetrics.totalSearchRequests10MonthsAgo,
                                countMetrics.totalHomeSearchRequests10MonthsAgo,
                                countMetrics.totalMenuSearchRequests10MonthsAgo,
                                countMetrics.totalCookSearchRequests10MonthsAgo,
                            ],
                            [
                                'vor 9 Monaten',
                                countMetrics.totalSearchRequests9MonthsAgo,
                                countMetrics.totalHomeSearchRequests9MonthsAgo,
                                countMetrics.totalMenuSearchRequests9MonthsAgo,
                                countMetrics.totalCookSearchRequests9MonthsAgo,
                            ],
                            [
                                'vor 8 Monaten',
                                countMetrics.totalSearchRequests8MonthsAgo,
                                countMetrics.totalHomeSearchRequests8MonthsAgo,
                                countMetrics.totalMenuSearchRequests8MonthsAgo,
                                countMetrics.totalCookSearchRequests8MonthsAgo,
                            ],
                            [
                                'vor 7 Monaten',
                                countMetrics.totalSearchRequests7MonthsAgo,
                                countMetrics.totalHomeSearchRequests7MonthsAgo,
                                countMetrics.totalMenuSearchRequests7MonthsAgo,
                                countMetrics.totalCookSearchRequests7MonthsAgo,
                            ],
                            [
                                'vor 6 Monaten',
                                countMetrics.totalSearchRequests6MonthsAgo,
                                countMetrics.totalHomeSearchRequests6MonthsAgo,
                                countMetrics.totalMenuSearchRequests6MonthsAgo,
                                countMetrics.totalCookSearchRequests6MonthsAgo,
                            ],
                            [
                                'vor 5 Monaten',
                                countMetrics.totalSearchRequests5MonthsAgo,
                                countMetrics.totalHomeSearchRequests5MonthsAgo,
                                countMetrics.totalMenuSearchRequests5MonthsAgo,
                                countMetrics.totalCookSearchRequests5MonthsAgo,
                            ],
                            [
                                'vor 4 Monaten',
                                countMetrics.totalSearchRequests4MonthsAgo,
                                countMetrics.totalHomeSearchRequests4MonthsAgo,
                                countMetrics.totalMenuSearchRequests4MonthsAgo,
                                countMetrics.totalCookSearchRequests4MonthsAgo,
                            ],
                            [
                                'vor 3 Monaten',
                                countMetrics.totalSearchRequests3MonthsAgo,
                                countMetrics.totalHomeSearchRequests3MonthsAgo,
                                countMetrics.totalMenuSearchRequests3MonthsAgo,
                                countMetrics.totalCookSearchRequests3MonthsAgo,
                            ],
                            [
                                'vor 2 Monaten',
                                countMetrics.totalSearchRequests2MonthsAgo,
                                countMetrics.totalHomeSearchRequests2MonthsAgo,
                                countMetrics.totalMenuSearchRequests2MonthsAgo,
                                countMetrics.totalCookSearchRequests2MonthsAgo,
                            ],
                            [
                                'letzten Monat',
                                countMetrics.totalSearchRequestsLastMonth,
                                countMetrics.totalHomeSearchRequestsLastMonth,
                                countMetrics.totalMenuSearchRequestsLastMonth,
                                countMetrics.totalCookSearchRequestsLastMonth,
                            ],
                        ]}
                    />
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        options={{ title: 'Globale Buchungsanfragen - letzte 12 Monate', legend: 'none' }}
                        data={[
                            ['Element', 'Anzahl'],
                            ['vor 12 Monaten', countMetrics.totalGlobalBookingRequests12MonthsAgo],
                            ['vor 11 Monaten', countMetrics.totalGlobalBookingRequests11MonthsAgo],
                            ['vor 10 Monaten', countMetrics.totalGlobalBookingRequests10MonthsAgo],
                            ['vor 9 Monaten', countMetrics.totalGlobalBookingRequests9MonthsAgo],
                            ['vor 8 Monaten', countMetrics.totalGlobalBookingRequests8MonthsAgo],
                            ['vor 7 Monaten', countMetrics.totalGlobalBookingRequests7MonthsAgo],
                            ['vor 6 Monaten', countMetrics.totalGlobalBookingRequests6MonthsAgo],
                            ['vor 5 Monaten', countMetrics.totalGlobalBookingRequests5MonthsAgo],
                            ['vor 4 Monaten', countMetrics.totalGlobalBookingRequests4MonthsAgo],
                            ['vor 3 Monaten', countMetrics.totalGlobalBookingRequests3MonthsAgo],
                            ['vor 2 Monaten', countMetrics.totalGlobalBookingRequests2MonthsAgo],
                            ['letzten Monat', countMetrics.totalGlobalBookingRequestsLastMonth],
                        ]}
                    />
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        options={{ title: 'Menü Buchungsanfragen - letzte 12 Monate', legend: 'none' }}
                        data={[
                            ['Element', 'Anzahl'],
                            ['vor 12 Monaten', countMetrics.totalBookingRequests12MonthsAgo],
                            ['vor 11 Monaten', countMetrics.totalBookingRequests11MonthsAgo],
                            ['vor 10 Monaten', countMetrics.totalBookingRequests10MonthsAgo],
                            ['vor 9 Monaten', countMetrics.totalBookingRequests9MonthsAgo],
                            ['vor 8 Monaten', countMetrics.totalBookingRequests8MonthsAgo],
                            ['vor 7 Monaten', countMetrics.totalBookingRequests7MonthsAgo],
                            ['vor 6 Monaten', countMetrics.totalBookingRequests6MonthsAgo],
                            ['vor 5 Monaten', countMetrics.totalBookingRequests5MonthsAgo],
                            ['vor 4 Monaten', countMetrics.totalBookingRequests4MonthsAgo],
                            ['vor 3 Monaten', countMetrics.totalBookingRequests3MonthsAgo],
                            ['vor 2 Monaten', countMetrics.totalBookingRequests2MonthsAgo],
                            ['letzten Monat', countMetrics.totalBookingRequestsLastMonth],
                        ]}
                    />
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        options={{ title: 'Session Erstellungen', legend: 'none' }}
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
        </div>
    );
}
