import { useMutation } from '@apollo/client';
import { CookSignUpForm, LoadingDialog, PEHeader } from '@people-eat/web-components';
import { PEAlert } from '@people-eat/web-core-components';
import {
    CookRank,
    CreateOneCookDocument,
    CreateOneUserByEmailAddressDocument,
    GetCookSignUpPageDataDocument,
    LanguageOption,
    SignedInUser,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createApolloClient } from '../network/apolloClients';
import getLocationSuggestions from '../network/getLocationSuggestions';

const cookProfilePageRedirect = { redirect: { permanent: false, destination: '/chef-profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    languages: LanguageOption[];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const result = await apolloClient.query({ query: GetCookSignUpPageDataDocument });

        const signedInUser = result.data.users.signedInUser;

        if (signedInUser?.isCook) {
            return cookProfilePageRedirect;
        }

        return {
            props: {
                signedInUser: signedInUser ?? null,
                languages: result.data.languages.findAll,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function ChefSignUpPage({ signedInUser, languages }: ServerSideProps) {
    const router = useRouter();

    const [selectedLanguages, setSelectedLanguages] = useState<LanguageOption[]>([]);
    const [rank, setRank] = useState<CookRank>('HOBBY');

    const [createOneUserByEmailAddress, { loading, data: createUserData, reset: resetCreateUser }] =
        useMutation(CreateOneUserByEmailAddressDocument);
    const [createOneCook, { loading: createCookLoading, data: createCookData, reset: resetCreateCook }] =
        useMutation(CreateOneCookDocument);

    const showFailedAlert =
        (createUserData ? !createUserData.users.success : false) || (createCookData ? !createCookData.cooks.success : false);

    const showSuccessAlertForNewUser = createUserData?.users.success ?? false;
    const showSuccessAlertForExistingUser = createCookData?.cooks.success ?? false;

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading || createCookLoading} />

            <PEAlert
                open={showSuccessAlertForNewUser}
                title="Deine Registirung war erfolgreich"
                subtitle="Überprüfe deine Email Postfach um deine E-Mail Adresse zu bestätigen und Zugriff auf dein Kochprofil zu erhalten. Dort gibt es einiges zu entdecken. Erstelle Gerichte und Menüs um die Aufmerksamkeit von potentiellen Kunden zu gewinnen."
                primaryButton={{ title: 'Zur Anmeldung', onClick: () => router.push('/sign-in') }}
            />

            <PEAlert
                open={showSuccessAlertForExistingUser}
                title="Deine Registirung war erfolgreich"
                subtitle="Sieh sich jetzt in deinem Kochprofil um, dort gibt es einiges zu entdecken. Erstelle Gerichte und Menüs um die Aufmerksamkeit von potentiellen Kunden zu gewinnen."
                primaryButton={{ title: 'Zu meinem Kochprofil', onClick: () => router.push('/chef-profile') }}
            />

            <PEAlert
                open={showFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Bitte versuche es später erneut"
                primaryButton={{
                    title: 'Erneut versuchen',
                    onClick: () => {
                        resetCreateUser();
                        resetCreateCook();
                    },
                }}
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
                    <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">Einen Kochaccount erstellen</h2>
                </div>

                <CookSignUpForm
                    signedInUser={signedInUser}
                    completeTitle="Registrieren"
                    onSignUpForExistingUser={({
                        travelExpenses,
                        maximumTravelDistance,
                        maximumParticipants,
                        postCode,
                        city,
                        street,
                        houseNumber,
                        country,
                    }) => {
                        getLocationSuggestions(`${postCode} ${city}, ${street} ${houseNumber}, ${country}`, ([firstResult]) => {
                            console.log({ query: `${postCode} ${city}, ${street} ${houseNumber}, ${country}`, firstResult });
                            if (!firstResult) return;

                            const { latitude, longitude } = firstResult;

                            createOneCook({
                                variables: {
                                    cookId: signedInUser?.userId ?? '',
                                    request: {
                                        biography: '',
                                        isVisible: true,
                                        languageIds: languages.map(({ languageId }) => languageId),
                                        location: { latitude, longitude, text: city },
                                        maximumParticipants,
                                        maximumPrice: undefined,
                                        maximumTravelDistance,
                                        minimumParticipants: undefined,
                                        minimumPrice: undefined,
                                        rank,
                                        travelExpenses,
                                    },
                                },
                            });
                        });
                    }}
                    onSignUpForNewUser={({
                        firstName,
                        lastName,
                        emailAddress,
                        phoneNumber,
                        password,

                        city,
                        postCode,
                        street,
                        houseNumber,
                        country,

                        travelExpenses,
                        maximumTravelDistance,
                        maximumParticipants,
                    }) => {
                        getLocationSuggestions(`${postCode} ${city}, ${street} ${houseNumber}, ${country}`, ([firstResult]) => {
                            console.log({ query: `${postCode} ${city}, ${street} ${houseNumber}, ${country}`, firstResult });
                            if (!firstResult) return;

                            const { latitude, longitude } = firstResult;
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
                                        cook: {
                                            biography: '',
                                            isVisible: true,
                                            languageIds: languages.map(({ languageId }) => languageId),
                                            location: { latitude, longitude, text: city },
                                            maximumParticipants,
                                            maximumPrice: undefined,
                                            maximumTravelDistance,
                                            minimumParticipants: undefined,
                                            minimumPrice: undefined,
                                            rank,
                                            travelExpenses,
                                        },
                                        addresses: [
                                            {
                                                title: 'Title',
                                                city,
                                                postCode,
                                                street,
                                                houseNumber,
                                                country,
                                                location: {
                                                    latitude: 0,
                                                    longitude: 0,
                                                    text: '',
                                                },
                                            },
                                        ],
                                    },
                                },
                            });
                        });
                    }}
                    onSignIn={() => router.push('/sign-in')}
                    languages={{
                        options: languages,
                        selectedOptions: selectedLanguages,
                        onChange: setSelectedLanguages,
                    }}
                    rank={rank}
                    setRank={setRank}
                />
            </div>
        </div>
    );
}
