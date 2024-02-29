import { useMutation } from '@apollo/client';
import { LoadingDialog, PEHeader, SignInForm } from '@people-eat/web-components';
import { PEAlert } from '@people-eat/web-core-components';
import { AssignOneSessionByEmailAddressDocument, GetPageDataDocument } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { createApolloClient } from '../network/apolloClients';

const profilePageRedirect = { redirect: { permanent: false, destination: '/profile' } };

export const getServerSideProps: GetServerSideProps<object> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const result = await apolloClient.query({ query: GetPageDataDocument });

        const signedInUser = result.data.users.signedInUser;

        if (signedInUser) {
            return profilePageRedirect;
        }

        return { props: {} };
    } catch (error) {
        return { props: {} };
    }
};

export default function SignInPage() {
    const router = useRouter();

    const [assignOneSessionByEmailAddress, { loading, data, reset }] = useMutation(AssignOneSessionByEmailAddressDocument);

    const showFailedAlert = data ? !data.sessions.success : false;

    if (data?.sessions.success) {
        router.push('/profile');
    }

    return (
        <div>
            <PEHeader signedInUser={null} />

            <LoadingDialog active={loading} />

            <PEAlert
                open={showFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Bitte versuche es später erneut"
                button={{ title: 'Erneut versuchen', onClick: () => reset() }}
            />

            <div className="bg-white rounded-xl flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Image
                        unoptimized
                        className="mx-auto h-10 w-auto"
                        src="/people-eat-logo.jpeg"
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
                />
            </div>
        </div>
    );
}
