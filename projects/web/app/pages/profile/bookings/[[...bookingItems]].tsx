import { useLazyQuery } from '@apollo/client';
import { BookingRequestRow, GlobalBookingRequestRow, PEHeader, PEProfileNavigation } from '@people-eat/web-components';
import {
    GetProfileBookingsDocument,
    GetProfileBookingsPageDataDocument,
    GetProfileBookingsPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
    Unpacked,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { Filter } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
    PEProfileBookingRequestDetails,
    ProfileBookingRequestDetailsTab,
    toProfileBookingRequestDetailsTab,
} from '../../../components/PEProfileBookingRequestDetails';
import {
    PEProfileGlobalBookingRequestDetails,
    toProfileGlobalBookingRequestDetailsTab,
} from '../../../components/PEProfileGlobalBookingRequestDetails';
import { createApolloClient } from '../../../network/apolloClients';
import Head from 'next/head';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    bookingRequests: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findMany']>>[];
    selectedBookingRequest: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findOne']>> | null;
    globalBookingRequests: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['globalBookingRequests']['findMany']>>[];
    selectedGlobalBookingRequest: Unpacked<
        NonNullable<GetProfileBookingsPageDataQuery['users']['globalBookingRequests']['findOne']>
    > | null;
    tab: ProfileBookingRequestDetailsTab;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    const bookingItems = query.bookingItems;

    let bookingType: 'STANDARD' | 'GLOBAL' | 'NONE' = 'NONE';
    let bookingItemId: string | undefined;

    if (!bookingItems) {
        // do nothing
    } else if (bookingItems.length < 1) {
        bookingType = 'NONE';
        bookingItemId = undefined;
    } else if (bookingItems.length === 1) {
        bookingType = 'STANDARD';
        bookingItemId = bookingItems[0];
    } else {
        bookingType = 'GLOBAL';
        bookingItemId = bookingItems[1];
    }

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        const userId = signedInUser.userId;

        const result = await apolloClient.query({
            query: GetProfileBookingsPageDataDocument,
            variables: {
                userId,
                globalBookingRequestId: bookingType === 'GLOBAL' ? bookingItemId! : '',
                fetchGlobalBookingRequest: bookingType === 'GLOBAL',
                bookingRequestId: bookingType === 'STANDARD' ? bookingItemId! : '',
                fetchBookingRequest: bookingType === 'STANDARD',
            },
        });

        const bookingRequests = result.data.users.bookingRequests.findMany ?? [];
        const bookingRequest = result.data.users.bookingRequests.findOne ?? null;
        const globalBookingRequests = result.data.users.globalBookingRequests.findMany ?? [];
        const globalBookingRequest = result.data.users.globalBookingRequests.findOne ?? null;

        return {
            props: {
                signedInUser,
                bookingRequests,
                selectedBookingRequest: bookingRequest,
                globalBookingRequests,
                selectedGlobalBookingRequest: globalBookingRequest,
                tab: toProfileBookingRequestDetailsTab(query.tab),
            },
        };
    } catch (error) {
        console.error(error);
        return signInPageRedirect;
    }
};

export default function ProfileBookingsPage({
    signedInUser,
    bookingRequests: initialBookingRequests,
    selectedBookingRequest: initialSelectedBookingRequest,
    globalBookingRequests: initialGlobalBookingRequests,
    selectedGlobalBookingRequest: initialSelectedGlobalBookingRequest,
    tab,
}: ServerSideProps) {
    const router = useRouter();

    const [bookingRequests, setBookingRequests] = useState(initialBookingRequests);
    const [selectedBookingRequest, setSelectedBookingRequest] = useState(initialSelectedBookingRequest);
    const [globalBookingRequests, setGlobalBookingRequests] = useState(initialGlobalBookingRequests);
    const [selectedGlobalBookingRequest, setSelectedGlobalBookingRequest] = useState(initialSelectedGlobalBookingRequest);

    const [getUpdatedBookings] = useLazyQuery(GetProfileBookingsDocument, {
        variables: {
            userId: signedInUser.userId,
            bookingRequestId: initialSelectedBookingRequest?.bookingRequestId ?? '',
            fetchBookingRequest: Boolean(initialSelectedBookingRequest),
            globalBookingRequestId: initialSelectedGlobalBookingRequest?.globalBookingRequestId ?? '',
            fetchGlobalBookingRequest: Boolean(initialSelectedGlobalBookingRequest),
        },
    });

    async function update() {
        const { data } = await getUpdatedBookings();
        setBookingRequests(data?.users.bookingRequests.findMany ?? []);
        setSelectedBookingRequest(data?.users.bookingRequests.findOne ?? null);
        setGlobalBookingRequests(data?.users.globalBookingRequests.findMany ?? []);
        setSelectedGlobalBookingRequest(data?.users.globalBookingRequests.findOne ?? null);
    }

    useEffect(() => setBookingRequests(initialBookingRequests), [initialBookingRequests]);
    useEffect(() => setSelectedBookingRequest(initialSelectedBookingRequest), [initialSelectedBookingRequest]);
    useEffect(() => setGlobalBookingRequests(initialGlobalBookingRequests), [initialGlobalBookingRequests]);
    useEffect(() => setSelectedGlobalBookingRequest(initialSelectedGlobalBookingRequest), [initialSelectedGlobalBookingRequest]);

    const totalNumberOfBookingRequests = globalBookingRequests.length + bookingRequests.length;

    return (
        <>
            <Head>
                <title>
                    PeopleEat {'>'} User Profile {'>'} Bookings
                </title>
            </Head>

            <div className={classNames('absolute inset-0 flex flex-col gap-8')}>
                <PEHeader
                    signedInUser={signedInUser}
                    className={classNames({ 'hidden lg:block': selectedBookingRequest || selectedGlobalBookingRequest })}
                />

                <div
                    className={classNames('max-w-[88rem] mx-auto w-full p-6', {
                        'hidden lg:flex': selectedBookingRequest || selectedGlobalBookingRequest,
                    })}
                >
                    <PEProfileNavigation current="BOOKINGS" className={classNames('px-4 sm:px-0 flex-auto')} />
                </div>

                <div className="max-w-[88rem] w-full mx-auto px-0 sm:px-8 pb-4 flex gap-4 overflow-hidden flex-1">
                    {/* Start of side bar */}
                    <div
                        className={classNames('flex-1 flex flex-col', 'px-0 lg:rounded-2xl lg:shadow-lg lg:py-8', {
                            'hidden lg:flex': selectedBookingRequest || selectedGlobalBookingRequest,
                        })}
                    >
                        <div className="px-4 pb-4 flex justify-between items-center">
                            <h1 className="text-xl font-bold">Buchungsanfragen</h1>
                            <Filter size={16} />
                        </div>

                        {totalNumberOfBookingRequests > 0 && (
                            <ul className="overflow-y-scroll flex-1">
                                {globalBookingRequests.map(({ globalBookingRequestId, priceClass, occasion, dateTime }) => (
                                    <GlobalBookingRequestRow
                                        key={globalBookingRequestId}
                                        occasion={occasion}
                                        priceClass={priceClass.type}
                                        dateTime={dateTime}
                                        selected={globalBookingRequestId === selectedGlobalBookingRequest?.globalBookingRequestId}
                                        onSelect={() =>
                                            router.push(`/profile/bookings/global/${globalBookingRequestId}`, undefined, {
                                                scroll: false,
                                            })
                                        }
                                    />
                                ))}
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
                                        onSelect={() => router.push(`/profile/bookings/${bookingRequestId}`, undefined, { scroll: false })}
                                    />
                                ))}
                            </ul>
                        )}

                        {totalNumberOfBookingRequests < 1 && <p className="px-4">Noch keine Buchungsanfragen</p>}
                    </div>

                    {/* Start of details */}
                    <div
                        className={classNames('flex-[2] flex lg:rounded-2xl lg:shadow-lg', {
                            'hidden lg:flex': !selectedBookingRequest && !selectedGlobalBookingRequest,
                        })}
                    >
                        {!selectedBookingRequest && !selectedGlobalBookingRequest && 'Wähle eine Buchungsanfrage aus'}

                        {selectedGlobalBookingRequest && (
                            <PEProfileGlobalBookingRequestDetails
                                userId={signedInUser.userId}
                                selectedTab={toProfileGlobalBookingRequestDetailsTab(tab)}
                                globalBookingRequest={selectedGlobalBookingRequest}
                            />
                        )}

                        {selectedBookingRequest && (
                            <PEProfileBookingRequestDetails
                                userId={signedInUser.userId}
                                selectedTab={tab}
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
