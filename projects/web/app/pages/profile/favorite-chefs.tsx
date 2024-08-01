import { PEHeader, PEProfileNavigation } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';
import {
    GetProfileFavoriteCooksPageDataDocument,
    GetProfileFavoriteCooksPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
    Unpacked,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { AnalyticsClarity } from '../../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../../components/analytics/CookieSettings';
import { createApolloClient } from '../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    favoriteCooks: Unpacked<NonNullable<GetProfileFavoriteCooksPageDataQuery['users']['followings']['findAll']>>[];
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        const userId = signedInUser.userId;

        const { data } = await apolloClient.query({ query: GetProfileFavoriteCooksPageDataDocument, variables: { userId } });

        return {
            props: {
                signedInUser,
                favoriteCooks: data.users.followings.findAll ?? [],
                cookieSettings: data.sessions.current?.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        return signInPageRedirect;
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
