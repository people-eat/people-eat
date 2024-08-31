import { GetPageDataDocument, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { CookieSettings } from '../components/analytics/CookieSettings';
import { createApolloClient } from '../network/apolloClients';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    cookieSettings: CookieSettings | null;
    serverNodeVersion: string;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);
    const { data } = await apolloClient.query({ query: GetPageDataDocument });

    try {
        return {
            props: {
                signedInUser: data.users.signedInUser ?? null,
                cookieSettings: data.sessions.current?.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
                serverNodeVersion: process.version,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function StatusPage({ signedInUser, cookieSettings, serverNodeVersion }: ServerSideProps) {
    return (
        <div>
            {JSON.stringify({
                signedInUser,
                cookieSettings,
                serverNodeVersion,
            })}
        </div>
    );
}
