import { PEButton, PEHeader } from '@people-eat/web-components';
import {
    AdminGetGiftCardPromoCodesPageDataDocument,
    AdminGetGiftCardPromoCodesPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
    toTranslatedFormattedDate,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { Router, useRouter } from 'next/router';
import { useState } from 'react';
import { AdminCreateGiftCardPromoCodeDialog } from '../../components/administration/AdminCreateGiftCardPromoCodeDialog';
import { createApolloClient } from '../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const profilePageRedirect = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialGiftCardPromoCodes: AdminGetGiftCardPromoCodesPageDataQuery['admins']['giftCardPromoCodes']['findMany'];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isAdmin) return profilePageRedirect;

        const result = await apolloClient.query({ query: AdminGetGiftCardPromoCodesPageDataDocument });

        const initialGiftCardPromoCodes = result.data.admins.giftCardPromoCodes.findMany;

        return {
            props: {
                signedInUser,
                initialGiftCardPromoCodes,
            },
        };
    } catch (error) {
        console.log(error);
        return signInPageRedirect;
    }
};

export default function AdministrationPromoCodesPage({ signedInUser, initialGiftCardPromoCodes: giftCardPromoCodes }: ServerSideProps) {
    const router = useRouter();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Promo Codes</h1>
                        <p className="mt-2 text-sm text-gray-700">Die Liste aller existierender Promo Codes</p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <PEButton title="Neuen Code erstellen" onClick={() => setCreateDialogOpen(true)} />
                    </div>
                </div>
            </div>

            <AdminCreateGiftCardPromoCodeDialog
                open={createDialogOpen}
                onCancel={() => setCreateDialogOpen(false)}
                onCreated={() => router.reload()}
            />

            <div className="mt-8 flow-root overflow-hidden">
                <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                    <table className="w-full text-left">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                    Code
                                    <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                                    <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Läuft ab am
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Erstellt am
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {giftCardPromoCodes.map((giftCardPromoCode) => (
                                <tr key={giftCardPromoCode.giftCardPromoCodeId}>
                                    <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                                        {giftCardPromoCode.redeemCode}
                                        <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                                        {toTranslatedFormattedDate(giftCardPromoCode.expiresAt)}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        {toTranslatedFormattedDate(giftCardPromoCode.createdAt)}
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
