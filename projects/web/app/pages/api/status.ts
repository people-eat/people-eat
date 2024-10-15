import type { NextApiRequest, NextApiResponse } from 'next';
import { createApolloClient } from '../../network/apolloClients';
import { GetPageDataDocument, SignedInUser } from '@people-eat/web-domain';
import { CookieSettings } from '../../components/analytics/CookieSettings';

type ResponseData = {
    signedInUser: SignedInUser | null;
    cookieSettings: CookieSettings | null;
    serverNodeVersion: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const apolloClient = createApolloClient(req.headers.cookie);

    const { data } = await apolloClient.query({ query: GetPageDataDocument });

    res.status(200).json({
        signedInUser: data.sessions.current.user ?? null,
        cookieSettings: data.sessions.current.cookieSettings
            ? {
                  googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                  clarity: data.sessions.current.cookieSettings.clarity ?? null,
              }
            : null,
        serverNodeVersion: process.version,
    });
}
