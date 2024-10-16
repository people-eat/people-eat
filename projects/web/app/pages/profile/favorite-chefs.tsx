import { PEHeader, PELink, PEProfileNavigation } from '@people-eat/web-components';
import {
    GetProfileFavoriteCooksPageDataDocument,
    GetProfileFavoriteCooksPageDataQuery,
    SignedInUser,
    Unpacked,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { AnalyticsClarity } from '../../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../../components/analytics/CookieSettings';
import { redirectTo } from '../../components/redirectTo';
import { createApolloClient } from '../../network/apolloClients';

interface ServerSideProps {
    signedInUser: SignedInUser;
    favoriteCooks: Unpacked<NonNullable<NonNullable<GetProfileFavoriteCooksPageDataQuery['sessions']['current']['user']>['followings']>>[];
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetProfileFavoriteCooksPageDataDocument });
        const signedInUser = data.sessions.current.user;
        if (!signedInUser) return redirectTo.signIn({ returnTo: req.url });

        return {
            props: {
                signedInUser,
                favoriteCooks: signedInUser.followings,
                cookieSettings: data.sessions.current.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        return redirectTo.signIn({ returnTo: req.url });
    }
};

export default function ProfileFavoriteCooksPage({ signedInUser, favoriteCooks, cookieSettings }: ServerSideProps) {
    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-16">
                <PEProfileNavigation current="FAVORITE_COOKS" isCook={signedInUser.isCook} />

                {favoriteCooks.length < 1 && (
                    <div className="flex flex-col items-center gap-4">
                        <span>
                            Du scheinst noch keine Liblingsköche gefunden zu haben. Vielleicht findest du noch einige unserer Köche
                            interessant. Sieh dich hier um.
                        </span>
                        <PELink title="Unsere Köche" href="/chefs" />
                    </div>
                )}

                {/* @todo: display favorite chefs */}
            </div>
        </>
    );
}
