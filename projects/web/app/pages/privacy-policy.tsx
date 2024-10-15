import { PEFooter, PEHeader } from '@people-eat/web-components';
import { GetPrivacyPolicyPageDataDocument, GetPrivacyPolicyPageDataQuery, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { AnalyticsClarity } from '../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../components/analytics/CookieSettings';
import { createApolloClient } from '../network/apolloClients';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    latestPrivacyPolicy: NonNullable<GetPrivacyPolicyPageDataQuery['publicPrivacyPolicyUpdates']['findLatest']> | null;
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetPrivacyPolicyPageDataDocument });

        return {
            props: {
                signedInUser: data.sessions.current.user ?? null,
                latestPrivacyPolicy: data.publicPrivacyPolicyUpdates.findLatest ?? null,
                cookieSettings: data.sessions.current.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function PrivacyPolicyPage({ signedInUser, latestPrivacyPolicy, cookieSettings }: ServerSideProps) {
    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

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
