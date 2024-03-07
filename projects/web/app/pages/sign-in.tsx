import { LoadingDialog, PEHeader } from '@people-eat/web-components';
import { AssignOneSessionByEmailAddressDocument, GetPageDataDocument, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { createApolloClient } from '../network/apolloClients';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { PEButton, PETextField } from '@people-eat/web-core-components';
import { useMutation } from '@apollo/client';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
}

// Todo: if signed maybe in navigate to profile

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const result = await apolloClient.query({ query: GetPageDataDocument });

        return {
            props: {
                signedInUser: result.data.users.signedInUser ?? null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

interface SignInFormInputs {
    emailAddress: string;
    password: string;
}

export default function SignInPage({ signedInUser }: ServerSideProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormInputs>();

    const [assignOneSessionByEmailAddress, { loading }] = useMutation(AssignOneSessionByEmailAddressDocument);

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading} />

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

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit(({ emailAddress, password }) =>
                            assignOneSessionByEmailAddress({
                                variables: { request: { emailAddress: emailAddress, password, platform: 'BROWSER', title: '' } },
                            }),
                        )}
                    >
                        <PETextField
                            id="email-address"
                            labelTitle="E-Mail Adresse"
                            type="email"
                            autoComplete="email"
                            errorMessage={errors.emailAddress?.message}
                            {...register('emailAddress', { required: 'This field is required' })}
                        />

                        <PETextField
                            id="password"
                            labelTitle="Passwort"
                            type="password"
                            autoComplete="current-password"
                            errorMessage={errors.emailAddress?.message}
                            {...register('password', { required: 'This field is required' })}
                        />

                        <PEButton title="Anmelden" type="submit" />
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Du hast noch kein Profil?{' '}
                        <a href="#" className="font-semibold leading-6 text-orange-600 hover:text-orange-500">
                            Hier registrieren
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
