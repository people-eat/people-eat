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
import { createApolloClient } from '../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    favoriteCooks: Unpacked<NonNullable<GetProfileFavoriteCooksPageDataQuery['users']['followings']['findAll']>>[];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        const userId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetProfileFavoriteCooksPageDataDocument, variables: { userId } });

        return {
            props: {
                signedInUser,
                favoriteCooks: result.data.users.followings.findAll ?? [],
            },
        };
    } catch (error) {
        return signInPageRedirect;
    }
};

export default function ProfileFavoriteCooksPage({ signedInUser, favoriteCooks }: ServerSideProps) {
    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-16">
                <PEProfileNavigation current="FAVORITE_COOKS" />

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
        </div>
    );
}
