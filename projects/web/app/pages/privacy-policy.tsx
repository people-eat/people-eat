import { GetPrivacyPolicyPageDataDocument, GetPrivacyPolicyPageDataQuery, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { createApolloClient } from '../network/apolloClients';
import { PEFooter, PEHeader } from '@people-eat/web-components';
import Head from 'next/head';

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

export default function PrivacyPolicyPage({ signedInUser, latestPrivacyPolicy }: ServerSideProps) {
    return (
        <>
            <Head>
                <title>Datenschutzerklärung – PeopleEat: Privatkoch für Zuhause</title>
                <meta
                    name="description"
                    content="Erfahre mehr über die Datenschutzrichtlinien von PeopleEat. Informiere dich, wie deine Daten beim Buchen eines Privatkochs für Zuhause geschützt und verarbeitet werden. Transparenz und Sicherheit für dein kulinarisches Erlebnis."
                />
                <meta
                    name="keywords"
                    content="Datenschutzerklärung, PeopleEat, Privatkoch für Zuhause, Datenschutzrichtlinien, Datensicherheit, Datenverarbeitung"
                />
            </Head>
            <div>
                <PEHeader signedInUser={signedInUser} />

                <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 my-16">Datenschutzerklärung</h1>

                    {latestPrivacyPolicy && <div dangerouslySetInnerHTML={{ __html: latestPrivacyPolicy.germanText }} />}

                    {!latestPrivacyPolicy && <>Currently no terms and conditions are available</>}
                </div>

                <PEFooter />
            </div>
        </>
    );
}
