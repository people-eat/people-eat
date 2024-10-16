import { useMutation } from '@apollo/client';
import { LoadingDialog, PEAlert, PEHeader, PELabelLink, SignUpForm, SignUpFormInputs } from '@people-eat/web-components';
import { CreateOneUserDocument, GetPageDataDocument } from '@people-eat/web-domain';
import { GetServerSideProps, Redirect } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AnalyticsClarity } from '../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../components/analytics/CookieSettings';
import { setup } from '../components/meta-pixel/setup';
import { createApolloClient } from '../network/apolloClients';

const profilePageRedirect: { redirect: Redirect } = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetPageDataDocument });

        const signedInUser = data.sessions.current.user;

        if (signedInUser) {
            return profilePageRedirect;
        }

        return {
            props: {
                cookieSettings: data.sessions.current.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        console.log(error);
        throw new Error();
    }
};

export default function SignUpPage({ cookieSettings }: ServerSideProps) {
    const router = useRouter();

    const [createOneUser, { loading, data, reset }] = useMutation(CreateOneUserDocument);

    const showCreateUserSuccessAlert = data?.users.createOne.__typename === 'CreateOneUserSuccessResult';
    const showCreatesUserFailedAlert = data?.users.createOne.__typename === 'CreateOneUserFailedResult';
    const showAlreadyExistsAlert = data?.users.createOne.__typename === 'CreateOneUserFailedAlreadyExistsResult';

    const abc = setup()
        ?.init(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? 'no-meta-pixel-id')
        ?.pageView();

    useEffect(() => {
        if (showCreateUserSuccessAlert) {
            console.log('triggered meta pixel track');
            abc?.$fbq('track', 'CompleteRegistration');
        }
    }, [showCreateUserSuccessAlert, abc]);

    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <PEHeader signedInUser={null} />

            <LoadingDialog active={loading} />

            <PEAlert
                open={showCreateUserSuccessAlert}
                title="Deine Registrierung war erfolgreich"
                subtitle="Bitte überprüfe dein Email Postfach um deine E-Mail Adresse zu bestätigen und komme anschießend hierher zurück."
                primaryButton={{
                    title: 'Zur Anmeldung',
                    onClick: () => router.push('/sign-in'),
                }}
            />

            <PEAlert
                type="ERROR"
                open={showCreatesUserFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Du kannst es erneut versuchen"
                primaryButton={{ title: 'Erneut versuchen', onClick: () => reset() }}
            />

            <PEAlert
                type="ERROR"
                open={showAlreadyExistsAlert}
                title="Es existiert bereits ein Benutzer mit der von dir angegebenen Email Adresse"
                subtitle="Anstatt dich zu registrieren, melde dich bitte an. Solltest du dein Passwort vergessen haben, wähle 'Passwort vergessen?'"
                primaryButton={{
                    title: 'Zur Anmeldung',
                    onClick: () => router.push('/sign-in'),
                }}
                secondaryButton={{ title: 'Passwort vergessen?', onClick: () => undefined }}
            />

            <div className="bg-white rounded-xl flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 gap-4">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* <Image
                        className="mx-auto h-10 w-auto hidden md:block mb-10"
                        src="/people-eat-logo-title.png"
                        alt="PeopleEat Firmen Logo"
                        width={800}
                        height={240}
                    /> */}

                    <h1 className="text-2xl font-bold mb-4">Registrierung</h1>

                    <div className="mb-8 flex gap-2">
                        <PELabelLink href="" title="Als Gastgeber" selected />
                        <PELabelLink href="/chef-sign-up" title="Als Koch" selected={false} />
                    </div>

                    <h2 className="text-xl font-bold leading-9 tracking-tight text-gray-900">Einen Gastgeberaccount erstellen</h2>
                </div>

                <SignUpForm
                    completeTitle="Registrieren"
                    onSignUp={({ firstName, lastName, emailAddress, phoneNumber, password }: SignUpFormInputs) =>
                        createOneUser({
                            variables: {
                                request: {
                                    firstName,
                                    lastName,
                                    emailAddress,
                                    phoneNumber,
                                    password,
                                    gender: 'NO_INFORMATION',
                                    language: 'GERMAN',
                                },
                            },
                        })
                    }
                    onSignIn={() => router.push('/sign-in')}
                />
            </div>
        </>
    );
}
