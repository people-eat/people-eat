import { GlobalBookingRequestRow, PEHeader, PEProfileNavigation } from '@people-eat/web-components';
import {
    GetProfileBookingsPageDataDocument,
    GetProfileBookingsPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
    Unpacked,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { createApolloClient } from '../../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    bookingRequests: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findMany']>>[];
    selectedBookingRequest: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findMany']>> | null;
    globalBookingRequests: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['globalBookingRequests']['findMany']>>[];
    selectedGlobalBookingRequest: Unpacked<
        NonNullable<GetProfileBookingsPageDataQuery['users']['globalBookingRequests']['findMany']>
    > | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    const [bookingItemId] = query.bookingItemId ?? [];

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        const userId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetProfileBookingsPageDataDocument, variables: { userId } });
        const bookingRequests = result.data.users.bookingRequests.findMany ?? [];
        const globalBookingRequests = result.data.users.globalBookingRequests.findMany ?? [];

        const bookingRequestIndex = bookingItemId
            ? bookingRequests.findIndex(({ bookingRequestId }) => bookingRequestId === bookingItemId)
            : -1;

        const globalBookingRequestIndex = bookingItemId
            ? globalBookingRequests.findIndex(({ globalBookingRequestId }) => globalBookingRequestId === bookingItemId)
            : -1;

        if (bookingItemId) {
            // let selectedBookingRequest;
            // let selectedGlobalBookingRequest;
            // if (bookingRequestIndex !== -1) {
            //     //
            // } else if (globalBookingRequestIndex !== -1) {
            //     //
            // }
        }
        console.log(bookingRequests[bookingRequestIndex]);
        return {
            props: {
                signedInUser,
                bookingRequests,
                selectedBookingRequest: bookingRequestIndex !== -1 ? bookingRequests[bookingRequestIndex] : null,
                globalBookingRequests,
                selectedGlobalBookingRequest: globalBookingRequestIndex !== -1 ? globalBookingRequests[globalBookingRequestIndex] : null,
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
}: ServerSideProps) {
    const router = useRouter();

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className={classNames('mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8', 'flex flex-col gap-8')}>
                <PEProfileNavigation current="BOOKINGS" />

                {globalBookingRequests.length + bookingRequests.length > 0 && (
                    <ul>
                        {globalBookingRequests.map(({ globalBookingRequestId, priceClass, occasion, dateTime }) => (
                            <GlobalBookingRequestRow
                                key={globalBookingRequestId}
                                occasion={occasion}
                                priceClass={priceClass.type}
                                dateTime={dateTime}
                                onSelect={() => router.push(`/profile/bookings/${globalBookingRequestId}`, undefined, { scroll: false })}
                            />
                        ))}
                        {bookingRequests.map(({ occasion }) => occasion)}
                    </ul>
                )}

                {globalBookingRequests.length === 0 && <p>Noch keine Buchungsanfragen</p>}

                {!selectedBookingRequest && !selectedGlobalBookingRequest && 'Wähle eine Buchungsanfrage aus'}

                {selectedGlobalBookingRequest && 'Selected global booking request'}

                {selectedBookingRequest && 'Selected booking request'}
            </div>
        </div>
    );
}
