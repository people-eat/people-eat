import { BookingRequestRow, PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import {
    GetCookProfileBookingsDocument,
    GetCookProfileBookingsPageDataDocument,
    GetCookProfileBookingsPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { Filter } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
    CookProfileBookingRequestDetailsTab,
    PECookProfileBookingRequestDetails,
    toCookProfileBookingRequestDetailsTab,
} from '../../../components/PECookProfileBookingRequestDetails';
import { createApolloClient } from '../../../network/apolloClients';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { CookieSettings } from '../../../components/analytics/CookieSettings';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    cookieSettings: CookieSettings | null;
    hasStripePayoutMethodActivated: boolean;
    bookingRequests: NonNullable<GetCookProfileBookingsPageDataQuery['cooks']['bookingRequests']['findMany']>;
    selectedBookingRequest: NonNullable<GetCookProfileBookingsPageDataQuery['cooks']['bookingRequests']['findOne']> | null;
    tab: CookProfileBookingRequestDetailsTab;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    const bookingRequestId = typeof query.bookingRequestId?.[0] === 'string' ? query.bookingRequestId[0] : undefined;

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;
        const cookId = signedInUser.userId;

        const { data } = await apolloClient.query({
            query: GetCookProfileBookingsPageDataDocument,
            variables: {
                cookId,
                bookingRequestId: bookingRequestId ?? '',
                fetchBookingRequest: Boolean(bookingRequestId),
            },
        });

        const hasStripePayoutMethodActivated = data.cooks.findOne?.hasStripePayoutMethodActivated ?? false;
        const bookingRequests = data.cooks.bookingRequests.findMany ?? [];
        const selectedBookingRequest = data.cooks.bookingRequests.findOne ?? null;

        return {
            props: {
                signedInUser,
                hasStripePayoutMethodActivated,
                bookingRequests,
                selectedBookingRequest,
                tab: toCookProfileBookingRequestDetailsTab(query.tab),
                cookieSettings: data.sessions.current?.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function CookProfileBookingsPage({
    signedInUser,
    hasStripePayoutMethodActivated: initialHasStripePayoutMethodActivated,
    bookingRequests: initialBookingRequests,
    selectedBookingRequest: initialSelectedBookingRequest,
    tab,
}: ServerSideProps) {
    const router = useRouter();

    const [hasStripePayoutMethodActivated, setHasStripePayoutMethodActivated] = useState(initialHasStripePayoutMethodActivated);
    const [bookingRequests, setBookingRequests] = useState(initialBookingRequests);
    const [selectedBookingRequest, setSelectedBookingRequest] = useState(initialSelectedBookingRequest);

    const [getUpdatedBookings] = useLazyQuery(GetCookProfileBookingsDocument, {
        variables: {
            cookId: signedInUser.userId,
            bookingRequestId: initialSelectedBookingRequest?.bookingRequestId ?? '',
            fetchBookingRequest: Boolean(initialSelectedBookingRequest),
        },
    });

    async function update() {
        const { data } = await getUpdatedBookings();
        setHasStripePayoutMethodActivated(data?.cooks.findOne?.hasStripePayoutMethodActivated ?? false);
        setBookingRequests(data?.cooks.bookingRequests.findMany ?? []);
        setSelectedBookingRequest(data?.cooks.bookingRequests.findOne ?? null);
    }

    useEffect(() => setBookingRequests(initialBookingRequests), [initialBookingRequests]);
    useEffect(() => setSelectedBookingRequest(initialSelectedBookingRequest), [initialSelectedBookingRequest]);

    return (
        <>
            <Head>
                <title>
                    PeopleEat {'>'} Chef Profile {'>'} Bookings
                </title>
            </Head>

            <div className={classNames('absolute inset-0 flex flex-col gap-8')}>
                <PEHeader signedInUser={signedInUser} className={classNames({ 'hidden lg:block': selectedBookingRequest })} />

                <div className={classNames('max-w-[88rem] mx-auto w-full p-6', { 'hidden lg:flex': selectedBookingRequest })}>
                    <PECookProfileNavigation
                        current="BOOKINGS"
                        className={classNames('px-4 sm:px-0', { 'hidden lg:flex': selectedBookingRequest })}
                    />
                </div>

                <div className="max-w-[88rem] w-full mx-auto px-0 sm:px-8 pb-4 flex gap-4 overflow-hidden flex-1">
                    {/* Start of side bar */}
                    <div
                        className={classNames('flex-1 flex flex-col', 'px-0 lg:rounded-2xl lg:shadow-lg lg:py-8', {
                            'hidden lg:flex': selectedBookingRequest,
                        })}
                    >
                        <div className="px-4 pb-4 flex justify-between items-center">
                            <h1 className="text-xl font-bold">Buchungsanfragen</h1>
                            <Filter size={16} />
                        </div>

                        {bookingRequests.length > 0 && (
                            <ul className="overflow-y-scroll flex-1">
                                {bookingRequests.map(({ bookingRequestId, cook, occasion, dateTime, status, price, configuredMenu }) => (
                                    <BookingRequestRow
                                        key={bookingRequestId}
                                        status={status}
                                        occasion={occasion}
                                        dateTime={dateTime}
                                        selected={bookingRequestId === selectedBookingRequest?.bookingRequestId}
                                        price={price}
                                        configuredMenuTitle={configuredMenu?.title}
                                        cookFirstName={cook.user.firstName}
                                        onSelect={() =>
                                            router.push(`/chef-profile/bookings/${bookingRequestId}`, undefined, { scroll: false })
                                        }
                                    />
                                ))}
                            </ul>
                        )}

                        {bookingRequests.length < 1 && <p className="px-4">Noch keine Buchungsanfragen</p>}
                    </div>

                    {/* Start of details */}
                    <div
                        className={classNames('flex-[2] flex lg:rounded-2xl lg:shadow-lg', {
                            'hidden lg:flex': !selectedBookingRequest,
                        })}
                    >
                        {!selectedBookingRequest && <span className="flex-1 p-8">Wähle eine Buchungsanfrage aus</span>}

                        {selectedBookingRequest && (
                            <PECookProfileBookingRequestDetails
                                userId={signedInUser.userId}
                                selectedTab={tab}
                                hasStripePayoutMethodActivated={hasStripePayoutMethodActivated}
                                bookingRequest={selectedBookingRequest}
                                onRequireUpdate={update}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
