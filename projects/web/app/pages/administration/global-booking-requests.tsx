import { PEHeader } from '@people-eat/web-components';
import { PEButton } from '@people-eat/web-components';
import {
    AdminGetGlobalBookingRequestsPageDataDocument,
    AdminGetGlobalBookingRequestsPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
    toTranslatedFormattedDate,
    translatedPriceClasses,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { AdminGlobalBookingRequestCooksDialog } from '../../components/administration/AdminGlobalBookingRequestCooksDialog';
import { createApolloClient } from '../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const profilePageRedirect = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialGlobalBookingRequests: NonNullable<AdminGetGlobalBookingRequestsPageDataQuery['globalBookingRequests']['findMany']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isAdmin) return profilePageRedirect;

        const result = await apolloClient.query({ query: AdminGetGlobalBookingRequestsPageDataDocument });

        const initialGlobalBookingRequests = result.data.globalBookingRequests.findMany!;

        return {
            props: {
                signedInUser,
                initialGlobalBookingRequests,
            },
        };
    } catch (error) {
        console.log(error);
        return signInPageRedirect;
    }
};

export default function AdministrationGlobalBookingRequestsPage({
    signedInUser,
    initialGlobalBookingRequests: globalBookingRequests,
}: ServerSideProps) {
    const [selectedGlobalBookingRequestId, setSelectedGlobalBookingRequestId] = useState<string | undefined>();

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <AdminGlobalBookingRequestCooksDialog
                open={Boolean(selectedGlobalBookingRequestId)}
                onClose={() => setSelectedGlobalBookingRequestId(undefined)}
                globalBookingRequestId={selectedGlobalBookingRequestId!}
            />

            <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Globale Buchungsanfragen</h1>
                    </div>
                </div>
            </div>

            <div className="mt-8 flow-root overflow-hidden">
                <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                    <table className="w-full text-left">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                    Kunde
                                    <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                                    <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Telefonnummer
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Teilnehmer
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Wann?
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Wo?
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                    Anlass
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Gesendet am
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Preisklasse
                                </th>
                                <th scope="col" className="px-3 py-3.5" />
                            </tr>
                        </thead>
                        <tbody>
                            {globalBookingRequests.map((globalBookingRequest) => (
                                <tr key={globalBookingRequest.globalBookingRequestId}>
                                    <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                                        {globalBookingRequest.user.firstName}
                                        <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                                        {globalBookingRequest.user.phoneNumber ??
                                            (globalBookingRequest.user.phoneNumberUpdate?.phoneNumber
                                                ? `${globalBookingRequest.user.phoneNumberUpdate.phoneNumber}` //  (nicht bestätigt)
                                                : undefined) ??
                                            'Keine Angabe'}
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                                        {globalBookingRequest.adultParticipants + globalBookingRequest.children}
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                                        {toTranslatedFormattedDate(globalBookingRequest.dateTime)}
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                                        {globalBookingRequest.location.text}
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                                        {globalBookingRequest.occasion}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        {toTranslatedFormattedDate(globalBookingRequest.createdAt)}
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                                        {translatedPriceClasses[globalBookingRequest.priceClass.type]}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        <PEButton
                                            type="secondary"
                                            onClick={() => setSelectedGlobalBookingRequestId(globalBookingRequest.globalBookingRequestId)}
                                            title="anzeigen"
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
