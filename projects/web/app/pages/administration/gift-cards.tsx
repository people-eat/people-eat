import { PEHeader } from '@people-eat/web-components';
import { GetSignedInUserDocument, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps, Redirect } from 'next';
import { createApolloClient } from '../../network/apolloClients';
import { redirectTo } from '../../components/redirectTo';

const profilePageRedirect: { redirect: Redirect } = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return redirectTo.signIn({ returnTo: req.url });
        if (!signedInUser.isAdmin) return profilePageRedirect;

        return {
            props: {
                signedInUser,
            },
        };
    } catch (error) {
        return redirectTo.signIn({ returnTo: req.url });
    }
};

export default function AdministrationGiftCardsPage({ signedInUser }: ServerSideProps) {
    return (
        <div>
            <PEHeader signedInUser={signedInUser} />
            <h1>Gift Cards</h1>
        </div>
    );
}
