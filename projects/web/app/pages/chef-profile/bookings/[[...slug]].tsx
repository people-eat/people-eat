import { PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import {
    GetCookProfileBookingsPageDataDocument,
    GetCookProfileBookingsPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { PEProfileCard } from '../../../components/PEProfileCard';
import { createApolloClient } from '../../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    bookingRequests: NonNullable<GetCookProfileBookingsPageDataQuery['cooks']['bookingRequests']['findMany']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;
        const cookId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetCookProfileBookingsPageDataDocument, variables: { cookId } });
        const bookingRequests = result.data.cooks.bookingRequests.findMany ?? [];

        return {
            props: {
                signedInUser,
                bookingRequests,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function CookProfileBookingsPage({ signedInUser, bookingRequests }: ServerSideProps) {
    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PECookProfileNavigation current="BOOKINGS" />

                <PEProfileCard className="flex flex-col gap-4">
                    <h2>Zeige: alle</h2>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                    </div>

                    {bookingRequests.map(({ occasion }) => (
                        <span key={occasion}>{occasion}</span>
                    ))}
                </PEProfileCard>

                {bookingRequests.length < 1 && <span>Du hast wie es scheint noch keine Buchungsanfragen erhalten</span>}
            </div>
        </div>
    );
}