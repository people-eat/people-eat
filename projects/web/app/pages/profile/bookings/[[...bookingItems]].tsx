import { BookingRequestRow, GlobalBookingRequestRow, PEHeader, PEProfileNavigation } from '@people-eat/web-components';
import {
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
    bookingRequests,
    selectedBookingRequest,
    globalBookingRequests,
    selectedGlobalBookingRequest,
    tab,
}: ServerSideProps) {
    const router = useRouter();

    return (
        <div>
            <PEHeader
                signedInUser={signedInUser}
                className={classNames({ 'hidden lg:block': selectedBookingRequest || selectedGlobalBookingRequest })}
            />

            <div className={classNames('mx-auto max-w-7xl px-0 sm:px-8', 'flex flex-col gap-8')}>
                <PEProfileNavigation
                    current="BOOKINGS"
                    className={classNames('px-4 sm:px-0', { 'hidden lg:flex': selectedBookingRequest || selectedGlobalBookingRequest })}
                />

                <div className="flex gap-4">
                    <div
                        className={classNames('flex-1 px-0 lg:rounded-2xl lg:shadow-lg lg:py-8', {
                            'hidden lg:block': selectedBookingRequest || selectedGlobalBookingRequest,
                        })}
                    >
                        <div className="px-4 pb-4 flex justify-between items-center">
                            <h1 className="text-xl font-bold">Buchungsanfragen</h1>
                            <Filter size={16} />
                        </div>
                        {globalBookingRequests.length + bookingRequests.length > 0 && (
                            <ul>
                                {globalBookingRequests.map(({ globalBookingRequestId, priceClass, occasion, dateTime }) => (
                                    <GlobalBookingRequestRow
                                        key={globalBookingRequestId}
                                        occasion={occasion}
                                        priceClass={priceClass.type}
                                        dateTime={dateTime}
                                        selected={globalBookingRequestId === selectedGlobalBookingRequest?.globalBookingRequestId}
                                        onSelect={() =>
                                            router.push(`/profile/bookings/global/${globalBookingRequestId}`, undefined, { scroll: false })
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

                        {globalBookingRequests.length === 0 && <p>Noch keine Buchungsanfragen</p>}
                    </div>

                    <div
                        className={classNames('flex-[2] lg:rounded-2xl lg:shadow-lg p-8', {
                            'hidden lg:block': !selectedBookingRequest && !selectedGlobalBookingRequest,
                        })}
                    >
                        {!selectedBookingRequest && !selectedGlobalBookingRequest && 'Wähle eine Buchungsanfrage aus'}

                        {selectedGlobalBookingRequest && (
                            <PEProfileGlobalBookingRequestDetails
                                selectedTab={toProfileGlobalBookingRequestDetailsTab(tab)}
                                globalBookingRequest={selectedGlobalBookingRequest}
                            />
                        )}

                        {selectedBookingRequest && (
                            <PEProfileBookingRequestDetails selectedTab={tab} bookingRequest={selectedBookingRequest} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
