import { GlobalBookingRequestRow, PEHeader, PEProfileNavigation } from '@people-eat/web-components';
import {
    GetProfileBookingsPageDataDocument,
    GetProfileBookingsPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
    Unpacked,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { createApolloClient } from '../../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    bookingRequests: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findMany']>>[];
    globalBookingRequests: Unpacked<NonNullable<GetProfileBookingsPageDataQuery['users']['globalBookingRequests']['findMany']>>[];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        const userId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetProfileBookingsPageDataDocument, variables: { userId } });

        return {
            props: {
                signedInUser,
                bookingRequests: result.data.users.bookingRequests.findMany ?? [],
                globalBookingRequests: result.data.users.globalBookingRequests.findMany ?? [],
            },
        };
    } catch (error) {
        return signInPageRedirect;
    }
};

export default function ProfileBookingsPage({ signedInUser, bookingRequests, globalBookingRequests }: ServerSideProps) {
    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <PEProfileNavigation current="BOOKINGS" />

                {globalBookingRequests.map(() => (
                    <GlobalBookingRequestRow />
                ))}
            </div>
        </div>
    );
}
