import { LoadingDialog, PEHeader } from '@people-eat/web-components';
import {
    AdminGetCooksDocument,
    AdminGetGlobalBookingRequestsPageDataDocument,
    AdminGetGlobalBookingRequestsPageDataQuery,
    CreateBookingRequestByGlobalBookingRequestIdDocument,
    GetSignedInUserDocument,
    SignedInUser,
    toTranslatedFormattedDate,
    translatedPriceClasses,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { createApolloClient } from '../../network/apolloClients';
import { useLazyQuery, useMutation } from '@apollo/client';
import { PEAlert, PEButton, PEDialog } from '@people-eat/web-core-components';
import { useState } from 'react';
import Router from 'next/router';

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

    const [getCooks, { loading: getCooksLoading, data: getCooksData }] = useLazyQuery(AdminGetCooksDocument);
    const [createBookingRequest, { loading: createBookingRequestLoading, data: createBookingRequestData, reset }] = useMutation(
        CreateBookingRequestByGlobalBookingRequestIdDocument,
    );

    const loading = getCooksLoading || createBookingRequestLoading;

    const showSuccessAlert = createBookingRequestData?.cooks.bookingRequests.success ?? false;
    const showFailedAlert = createBookingRequestData ? !createBookingRequestData?.cooks.bookingRequests.success : false;

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading} />

            <PEAlert
                open={showSuccessAlert}
                title="Anfrage erfolgreich gematcht"
                subtitle="Die Globale Buchungsanfrage verschwindet nun aus der Liste dieser Seite. Sie taucht in den normalen Buchungsanfragen auf."
                primaryButton={{ title: 'Fertig', onClick: () => Router.reload() }}
            />

            <PEAlert
                type="ERROR"
                open={showFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Bitte versuche es später erneut"
                primaryButton={{ title: 'Erneut versuchen', onClick: () => reset() }}
            />

            <PEDialog
                open={Boolean(selectedGlobalBookingRequestId)}
                onClose={() => setSelectedGlobalBookingRequestId(undefined)}
                title="Globale Anfrage matchen"
            >
                <table className="w-full text-left">
                    <thead className="bg-white">
                        <tr>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                Vorname
                            </th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                Nachname
                            </th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                Öffentlich
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Stadt
                            </th>
                            <th scope="col" className="px-3 py-3.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {getCooksData?.cooks.findMany?.map((cook) => (
                            <tr key={cook.cookId}>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{cook.user.firstName}</td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{cook.user.lastName}</td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{cook.isVisible ? 'Ja' : 'Nein'}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{cook.city}</td>
                                <td className="px-3 py-4 text-sm">
                                    <PEButton
                                        title="match"
                                        type="secondary"
                                        onClick={() =>
                                            createBookingRequest({
                                                variables: {
                                                    globalBookingRequestId: selectedGlobalBookingRequestId!,
                                                    cookId: cook.cookId,
                                                },
                                            })
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </PEDialog>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Globale Buchungsanfragen</h1>
                    </div>
                </div>
            </div>

            <div className="mt-8 flow-root overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <table className="w-full text-left">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                    Kunde
                                    <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                                    <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
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
                                            onClick={() => {
                                                getCooks();
                                                setSelectedGlobalBookingRequestId(globalBookingRequest.globalBookingRequestId);
                                            }}
                                            title="match"
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
