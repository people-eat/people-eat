import { PEFooter, PEHeader } from '@people-eat/web-components';
import { GetTermsAndConditionsPageDataDocument, GetTermsAndConditionsPageDataQuery, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { AnalyticsClarity } from '../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../components/analytics/CookieSettings';
import { createApolloClient } from '../network/apolloClients';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    latestTermsAndConditions: NonNullable<GetTermsAndConditionsPageDataQuery['publicTermsUpdates']['findLatest']> | null;
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetTermsAndConditionsPageDataDocument });

        return {
            props: {
                signedInUser: data.users.signedInUser ?? null,
                latestTermsAndConditions: data.publicTermsUpdates.findLatest ?? null,
                cookieSettings: data.sessions.current?.cookieSettings
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

export default function Index({ signedInUser, latestTermsAndConditions, cookieSettings }: ServerSideProps) {
    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <Head>
                <title>Allgemeine Geschäftsbedingungen – PeopleEat: Privatkoch für Zuhause</title>
                <meta
                    name="description"
                    content="Erfahre mehr über die Allgemeinen Geschäftsbedingungen von PeopleEat. Informiere dich über die Regeln und Richtlinien zur Buchung eines Privatkochs für Zuhause. Transparenz und Klarheit für dein kulinarisches Erlebnis."
                />
                <meta
                    name="keywords"
                    content="Allgemeine Geschäftsbedingungen, PeopleEat, Privatkoch für Zuhause, Buchungsbedingungen, rechtliche Hinweise, AGB, Nutzungsbedingungen, kulinarisches Erlebnis"
                />
            </Head>

            <div>
                <PEHeader signedInUser={signedInUser} />

                <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 my-16">Allgemeine Geschäftsbedingungen</h1>

                    {latestTermsAndConditions && <div dangerouslySetInnerHTML={{ __html: latestTermsAndConditions.germanText }} />}
                    {!latestTermsAndConditions && <>Currently no terms and conditions are available</>}
                </div>

                <PEFooter />
            </div>
        </>
    );
}
