import { useMutation } from '@apollo/client';
import { LoadingDialog, PEHeader, SignInForm } from '@people-eat/web-components';
import { PEAlert, PEButton, PEDialog, PETextField } from '@people-eat/web-components';
import {
    AssignOneSessionByEmailAddressDocument,
    CreateOneOneTimeAccessTokenByEmailAddressDocument,
    GetPageDataDocument,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnalyticsClarity } from '../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../components/analytics/CookieSettings';
import { createApolloClient } from '../network/apolloClients';

const profilePageRedirect = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetPageDataDocument });

        const signedInUser = data.users.signedInUser;

        if (signedInUser) {
            return profilePageRedirect;
        }

        return {
            props: {
                cookieSettings: data.sessions.current?.cookieSettings
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

// todo: rename
interface SignInFormInputs {
    emailAddress: string;
}

export default function SignInPage({ cookieSettings }: ServerSideProps) {
    const router = useRouter();
    const [showForgotPasswordAlert, setShowForgotPasswordAlert] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormInputs>();

    const [assignOneSessionByEmailAddress, { loading, data, reset }] = useMutation(AssignOneSessionByEmailAddressDocument);

    const showFailedAlert = data ? !data.sessions.success : false;

    if (data?.sessions.success) {
        router.push('/profile');
    }

    const [createOneTimeAccessToken, { loading: createOneTimeAccessTokenLoading, data: forgotPasswordData, reset: resetForgotPassword }] =
        useMutation(CreateOneOneTimeAccessTokenByEmailAddressDocument);

    const showForgotPasswordFailedAlert = forgotPasswordData ? !forgotPasswordData.users.oneTimeAccessToken.success : false;

    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <PEHeader signedInUser={null} />

            <LoadingDialog active={loading || createOneTimeAccessTokenLoading} />

            <PEAlert
                type="ERROR"
                open={showFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Bitte versuche es später erneut"
                primaryButton={{ title: 'Erneut versuchen', onClick: () => reset() }}
            />

            <PEAlert
                type="ERROR"
                open={showForgotPasswordFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Bitte versuche es später erneut"
                primaryButton={{ title: 'Erneut versuchen', onClick: () => resetForgotPassword() }}
            />

            <PEAlert
                open={forgotPasswordData?.users.oneTimeAccessToken.success ?? false}
                title="Email erfolgreich verschickt"
                subtitle="Überprüfe dein E-Mail Postfach. Dort solltest du eine Email mit einem Link zum zurücksetzen deines Passworts finden."
                primaryButton={{ title: 'Schließen', onClick: () => resetForgotPassword() }}
            />

            <div className="bg-white rounded-xl flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Image
                        className="mx-auto h-10 w-auto"
                        src="/people-eat-logo-title.png"
                        alt="PeopleEat Firmen Logo"
                        width={800}
                        height={240}
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        In deinem Benutzerkonto anmelden
                    </h2>
                </div>

                <SignInForm
                    completeTitle="Anmelden"
                    onSignIn={({ emailAddress, password }) =>
                        assignOneSessionByEmailAddress({
                            variables: { request: { emailAddress: emailAddress, password, platform: 'BROWSER', title: '' } },
                        })
                    }
                    onSignUp={() => router.push('/sign-up')}
                    onForgotPassword={() => setShowForgotPasswordAlert(true)}
                />

                <PEDialog
                    open={showForgotPasswordAlert}
                    onClose={() => setShowForgotPasswordAlert(false)}
                    closeOnClickAround
                    title="Passwort vergessen?"
                >
                    <form
                        onSubmit={handleSubmit(({ emailAddress }) => createOneTimeAccessToken({ variables: { emailAddress } }))}
                        className="flex flex-col gap-4 items-end"
                    >
                        <PETextField
                            id="email-address"
                            labelTitle="E-Mail Adresse"
                            type="email"
                            autoComplete="email"
                            errorMessage={errors.emailAddress?.message}
                            {...register('emailAddress', { required: 'This field is required' })}
                        />

                        <div>
                            <PEButton title="Email zum Zurücksetzen abschicken" type="submit" />
                        </div>
                    </form>
                </PEDialog>
            </div>
        </>
    );
}
