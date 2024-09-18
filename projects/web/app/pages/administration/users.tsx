import { useMutation } from '@apollo/client';
import { LoadingDialog, PEButton, PEHeader } from '@people-eat/web-components';
import {
    AdminAssignOneSessionDocument,
    AdminGetUsersPageDataDocument,
    AdminGetUsersPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
    toTranslatedFormattedDate,
} from '@people-eat/web-domain';
import { GetServerSideProps, Redirect } from 'next';
import { useRouter } from 'next/router';
import { redirectTo } from '../../components/redirectTo';
import { createApolloClient } from '../../network/apolloClients';

const profilePageRedirect: { redirect: Redirect } = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialUsers: NonNullable<AdminGetUsersPageDataQuery['users']['findMany']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return redirectTo.signIn({ returnTo: req.url });
        if (!signedInUser.isAdmin) return profilePageRedirect;

        const result = await apolloClient.query({ query: AdminGetUsersPageDataDocument });

        const initialUsers = result.data.users.findMany!;

        return {
            props: {
                signedInUser,
                initialUsers,
            },
        };
    } catch (error) {
        console.log(error);
        return redirectTo.signIn({ returnTo: req.url });
    }
};

export default function AdministrationUsersPage({ signedInUser, initialUsers: users }: ServerSideProps) {
    const [signInAsUser, { loading }] = useMutation(AdminAssignOneSessionDocument);
    const router = useRouter();

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading} />

            <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Benutzer</h1>
                    </div>
                </div>
            </div>

            <div className="mt-8 flow-root overflow-hidden">
                <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                    <table className="w-full text-left">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                    userId
                                    <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                                    <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Vorname
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Nachname
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Ist Koch?
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Registriert am
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userId}>
                                    <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                                        {user.userId}
                                        <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{user.firstName}</td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{user.lastName}</td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{user.isCook ? 'Ja' : 'Nein'}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{toTranslatedFormattedDate(user.createdAt)}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        <PEButton
                                            type="secondary"
                                            title="anmelden"
                                            onClick={async () => {
                                                const { data } = await signInAsUser({ variables: { userId: user.userId } });

                                                if (data?.sessions.success) {
                                                    router.push('/profile');
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
