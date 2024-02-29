import { GetTermsAndConditionsPageDataDocument, GetTermsAndConditionsPageDataQuery, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { createApolloClient } from '../network/apolloClients';
import { PEFooter, PEHeader } from '@people-eat/web-components';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    latestTermsAndConditions: NonNullable<GetTermsAndConditionsPageDataQuery['publicTermsUpdates']['findLatest']> | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const result = await apolloClient.query({ query: GetTermsAndConditionsPageDataDocument });

        return {
            props: {
                signedInUser: result.data.users.signedInUser ?? null,
                latestTermsAndConditions: result.data.publicTermsUpdates.findLatest ?? null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function Index({ signedInUser, latestTermsAndConditions }: ServerSideProps) {
    return (
        <div>
            <PEHeader signedInUser={signedInUser} />
            <PEFooter />
        </div>
    );
}
