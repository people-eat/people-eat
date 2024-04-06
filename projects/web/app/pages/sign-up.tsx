import { useMutation } from '@apollo/client';
import { LoadingDialog, PEHeader, SignUpForm, SignUpFormInputs } from '@people-eat/web-components';
import { PEAlert } from '@people-eat/web-core-components';
import { CreateOneUserByEmailAddressDocument, GetPageDataDocument } from '@people-eat/web-domain';
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

export default function SignUpPage() {
    const router = useRouter();

    const [createOneUserByEmailAddress, { loading, data, reset }] = useMutation(CreateOneUserByEmailAddressDocument);

    const showCreateUserSuccessAlert = data?.users.success ?? false;
    const showCreatesUerFailedAlert = data ? !data.users.success : false;

    return (
        <div>
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
                open={showCreatesUerFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Du kannst es erneut versuchen"
                primaryButton={{ title: 'Erneut versuchen', onClick: () => reset() }}
            />

            <div className="bg-white rounded-xl flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Image
                        unoptimized
                        className="mx-auto h-10 w-auto hidden md:block mb-10"
                        src="/people-eat-logo-title.png"
                        alt="PeopleEat Firmen Logo"
                        width={800}
                        height={240}
                    />
                    <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">Einen Gastgeberaccount erstellen</h2>
                </div>

                <SignUpForm
                    completeTitle="Registrieren"
                    onSignUp={({ firstName, lastName, emailAddress, phoneNumber, password }: SignUpFormInputs) =>
                        createOneUserByEmailAddress({
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
        </div>
    );
}
