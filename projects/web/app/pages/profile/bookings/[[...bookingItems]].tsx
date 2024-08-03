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
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnalyticsClarity } from '../../../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../../../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../../../components/analytics/CookieSettings';
import { PECookProfileBookingRequestDetails } from '../../../components/PECookProfileBookingRequestDetails';
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

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialHasStripePayoutMethodActivated: boolean;
    cookieSettings: CookieSettings | null;
    initialBookingRequests: (
        | Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findMany']>>
        | Unpacked<NonNullable<GetProfileBookingsPageDataQuery['cooks']['bookingRequests']['findMany']>>
    )[];
    initialSelectedBookingRequest:
        | Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findOne']>>
        | Unpacked<NonNullable<GetProfileBookingsPageDataQuery['cooks']['bookingRequests']['findOne']>>
        | null;
    globalBookingRequests: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['globalBookingRequests']['findMany']>>[];
    selectedGlobalBookingRequest: Unpacked<
        NonNullable<GetProfileBookingsPageDataQuery['users']['globalBookingRequests']['findOne']>
    > | null;
    tab: ProfileBookingRequestDetailsTab;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    const bookingItems = query.bookingItems;

    let bookingType: 'COOK' | 'USER' | 'GLOBAL' | 'NONE' = 'NONE';
    let bookingItemId: string | undefined;

    if (!bookingItems || bookingItems.length < 1) {
        bookingType = 'NONE';
        bookingItemId = undefined;
    } else if (bookingItems[0] === 'r') {
        bookingType = 'COOK';
        bookingItemId = bookingItems[1];
    } else if (bookingItems[0] === 's') {
        bookingType = 'USER';
        bookingItemId = bookingItems[1];
    } else {
        bookingType = 'GLOBAL';
        bookingItemId = bookingItems[1];
    }

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        const userId = signedInUser.userId;

        const { data } = await apolloClient.query({
            query: GetProfileBookingsPageDataDocument,
            variables: {
                userId,
                globalBookingRequestId: bookingType === 'GLOBAL' ? bookingItemId! : '',
                fetchGlobalBookingRequest: bookingType === 'GLOBAL',
                bookingRequestId: bookingType === 'USER' || bookingType === 'COOK' ? bookingItemId! : '',
                fetchUserBookingRequest: bookingType === 'USER',
                fetchCookBookingRequest: bookingType === 'COOK',
            },
        });

        const initialHasStripePayoutMethodActivated = data.cooks.findOne?.hasStripePayoutMethodActivated ?? false;
        const userBookingRequests = data.users.bookingRequests.findMany ?? [];
        const selectedUserBookingRequest = data.users.bookingRequests.findOne ?? null;
        const cookBookingRequests = data.cooks.bookingRequests.findMany ?? [];
        const selectedCookBookingRequest = data.cooks.bookingRequests.findOne ?? null;
        const globalBookingRequests = data.users.globalBookingRequests.findMany ?? [];
        const selectedGlobalBookingRequest = data.users.globalBookingRequests.findOne ?? null;

        const initialBookingRequests = [...userBookingRequests, ...cookBookingRequests];

        initialBookingRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return {
            props: {
                signedInUser,
                initialHasStripePayoutMethodActivated,
                initialBookingRequests,
                initialSelectedBookingRequest: selectedUserBookingRequest ?? selectedCookBookingRequest,
                globalBookingRequests,
                selectedGlobalBookingRequest: selectedGlobalBookingRequest,
                tab: toProfileBookingRequestDetailsTab(query.tab),
                cookieSettings: data.sessions.current?.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        console.error(error);
        return signInPageRedirect;
    }
};

export default function ProfileBookingsPage({
    signedInUser,
    initialHasStripePayoutMethodActivated,
    initialBookingRequests,
    initialSelectedBookingRequest,
    globalBookingRequests: initialGlobalBookingRequests,
    selectedGlobalBookingRequest: initialSelectedGlobalBookingRequest,
    tab,
    cookieSettings,
}: ServerSideProps) {
    const router = useRouter();

    const [hasStripePayoutMethodActivated, setHasStripePayoutMethodActivated] = useState(initialHasStripePayoutMethodActivated);
    const [bookingRequests, setBookingRequests] = useState(initialBookingRequests);
    const [selectedBookingRequest, setSelectedBookingRequest] = useState(initialSelectedBookingRequest);
    const [globalBookingRequests, setGlobalBookingRequests] = useState(initialGlobalBookingRequests);
    const [selectedGlobalBookingRequest, setSelectedGlobalBookingRequest] = useState(initialSelectedGlobalBookingRequest);

    const [getUpdatedBookings] = useLazyQuery(GetProfileBookingsDocument, {
        variables: {
            userId: signedInUser.userId,
            bookingRequestId: initialSelectedBookingRequest?.bookingRequestId ?? '',
            fetchUserBookingRequest: Boolean(initialSelectedBookingRequest),
            fetchCookBookingRequest: Boolean(initialSelectedBookingRequest),
            globalBookingRequestId: initialSelectedGlobalBookingRequest?.globalBookingRequestId ?? '',
            fetchGlobalBookingRequest: Boolean(initialSelectedGlobalBookingRequest),
        },
    });

    async function update() {
        const { data } = await getUpdatedBookings();
        setHasStripePayoutMethodActivated(data?.cooks.findOne?.hasStripePayoutMethodActivated ?? false);

        const userBookingRequests = data?.users.bookingRequests.findMany ?? [];
        const cookBookingRequests = data?.cooks.bookingRequests.findMany ?? [];
        const updatedBookingRequests = [...userBookingRequests, ...cookBookingRequests];
        updatedBookingRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookingRequests(updatedBookingRequests);

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
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <Head>
                <title>PeopleEat - Profil - Buchungen</title>
            </Head>

            <div className="absolute inset-0 flex flex-col gap-8">
                <PEHeader
                    signedInUser={signedInUser}
                    className={classNames({ 'hidden lg:block': selectedBookingRequest || selectedGlobalBookingRequest })}
                />

                <div
                    className={classNames('max-w-[88rem] mx-auto w-full px-6', {
                        'hidden lg:flex': selectedBookingRequest || selectedGlobalBookingRequest,
                    })}
                >
                    <PEProfileNavigation current="BOOKINGS" className={classNames('px-4 sm:px-0 flex-auto')} isCook={signedInUser.isCook} />
                </div>

                <div className="max-w-[88rem] w-full mx-auto px-0 sm:px-8 sm:pb-4 flex gap-4 overflow-hidden flex-1">
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
                            <ul className="overflow-y-auto flex-1">
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
                                {bookingRequests.map(({ bookingRequestId, occasion, dateTime, status, price, configuredMenu, ...br }) => (
                                    <BookingRequestRow
                                        key={bookingRequestId}
                                        status={status}
                                        occasion={occasion}
                                        dateTime={dateTime}
                                        selected={
                                            bookingRequestId === selectedBookingRequest?.bookingRequestId &&
                                            (('user' in br && 'user' in selectedBookingRequest) ||
                                                ('cook' in br && 'cook' in selectedBookingRequest))
                                        }
                                        price={price}
                                        configuredMenuTitle={configuredMenu?.title}
                                        name={'user' in br ? br.user.firstName : br.cook.user.firstName}
                                        onSelect={() =>
                                            router.push(
                                                'user' in br
                                                    ? `/profile/bookings/r/${bookingRequestId}`
                                                    : `/profile/bookings/s/${bookingRequestId}`,
                                                undefined,
                                                { scroll: false },
                                            )
                                        }
                                        mode={'user' in br ? 'RECEIVED' : 'SENT'}
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
                        {!selectedBookingRequest && !selectedGlobalBookingRequest && (
                            <span className="flex-1 p-8">Wähle eine Buchungsanfrage aus</span>
                        )}

                        {selectedGlobalBookingRequest && (
                            <PEProfileGlobalBookingRequestDetails
                                userId={signedInUser.userId}
                                selectedTab={toProfileGlobalBookingRequestDetailsTab(tab)}
                                globalBookingRequest={selectedGlobalBookingRequest}
                            />
                        )}

                        {selectedBookingRequest && 'cook' in selectedBookingRequest && (
                            <PEProfileBookingRequestDetails
                                userId={signedInUser.userId}
                                selectedTab={tab}
                                bookingRequest={selectedBookingRequest}
                                onRequireUpdate={update}
                            />
                        )}

                        {selectedBookingRequest && 'user' in selectedBookingRequest && (
                            <PECookProfileBookingRequestDetails
                                userId={signedInUser.userId}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                selectedTab={tab as any}
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
