import { useMutation } from '@apollo/client';
import { CreateMealForm, LoadingDialog, PEHeader, PEProfileNavigation } from '@people-eat/web-components';
import { PEAlert } from '@people-eat/web-core-components';
import { CreateMealDocument, GetSignedInUserDocument, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { CookieSettings } from '../../../components/analytics/CookieSettings';
import { PEProfileCard } from '../../../components/PEProfileCard';
import { useNotLeave } from '../../../hooks/useNotLeave';
import { createApolloClient } from '../../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;

        return {
            props: {
                signedInUser,
                cookieSettings: userData.data.sessions.current?.cookieSettings
                    ? {
                          googleAnalytics: userData.data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: userData.data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function CookProfileCreateMealPage({ signedInUser }: ServerSideProps) {
    const cookId = signedInUser.userId;
    const router = useRouter();

    const [createOneCookMeal, { loading, data, reset }] = useMutation(CreateMealDocument);

    const showSuccessAlert = data?.cooks.meals.success ?? false;
    const showFailedAlert = data ? !data.cooks.meals.success : false;

    useNotLeave();

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <PEAlert
                open={showSuccessAlert}
                title="Gericht erfolgreich angelegt"
                subtitle="Füge es gleich einem neuen oder einem deiner bestehenden Menüs als Option hinzu."
                primaryButton={{ title: 'Zur Gerichtsübersicht', onClick: () => router.push('/profile/meals') }}
            />

            <PEAlert
                type="ERROR"
                open={showFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Bitte versuche es später erneut"
                primaryButton={{ title: 'Erneut versuchen', onClick: () => reset() }}
            />

            <LoadingDialog active={loading} />

            <div className="mx-auto max-w-[88rem] px-4 pb-16 pt-8 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PEProfileNavigation current="MEALS" isCook />

                <PEProfileCard className="flex flex-col gap-8">
                    <h1 className="font-bold text-3xl tracking-tight text-gray-900">Gericht erstellen</h1>

                    <CreateMealForm
                        onCreate={({ title, description, type, image }) =>
                            createOneCookMeal({ variables: { cookId, meal: { title, description, type }, image } })
                        }
                    />
                </PEProfileCard>
            </div>
        </div>
    );
}
