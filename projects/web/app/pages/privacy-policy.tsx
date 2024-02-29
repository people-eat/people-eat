import { GetPrivacyPolicyPageDataDocument, GetPrivacyPolicyPageDataQuery, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { createApolloClient } from '../network/apolloClients';
import { PEFooter, PEHeader } from '@people-eat/web-components';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    latestPrivacyPolicy: NonNullable<GetPrivacyPolicyPageDataQuery['publicPrivacyPolicyUpdates']['findLatest']> | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const result = await apolloClient.query({ query: GetPrivacyPolicyPageDataDocument });

        return {
            props: {
                signedInUser: result.data.users.signedInUser ?? null,
                latestPrivacyPolicy: result.data.publicPrivacyPolicyUpdates.findLatest ?? null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function Index({ signedInUser, latestPrivacyPolicy }: ServerSideProps) {
    return (
        <div>
            <PEHeader signedInUser={signedInUser} />
            <PEFooter />
        </div>
    );
}
