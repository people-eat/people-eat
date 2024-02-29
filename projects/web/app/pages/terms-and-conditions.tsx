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

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 my-16">Allgemeine Geschäftsbedingungen</h1>

                {latestTermsAndConditions && <div dangerouslySetInnerHTML={{ __html: latestTermsAndConditions.germanText }} />}
                {!latestTermsAndConditions && <>Currently no terms and conditions are available</>}
            </div>

            <PEFooter />
        </div>
    );
}
