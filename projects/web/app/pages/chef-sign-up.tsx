import { useMutation } from '@apollo/client';
import { CookSignUpForm, LoadingDialog, PEHeader } from '@people-eat/web-components';
import { PEAlert, PELabelLink } from '@people-eat/web-components';
import {
    CookRank,
    CreateOneCookDocument,
    CreateOneUserByEmailAddressDocument,
    GetCookSignUpPageDataDocument,
    LanguageOption,
    SignedInUser,
} from '@people-eat/web-domain';
import { GetServerSideProps, Redirect } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnalyticsClarity } from '../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../components/analytics/CookieSettings';
import { createApolloClient } from '../network/apolloClients';
import getLocationSuggestions from '../network/getLocationSuggestions';
import { setup } from '../components/meta-pixel/setup';

const cookProfilePageRedirect: { redirect: Redirect } = { redirect: { permanent: false, destination: '/profile' } };

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    cookieSettings: CookieSettings | null;
    languages: LanguageOption[];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetCookSignUpPageDataDocument });

        const signedInUser = data.users.signedInUser;

        if (signedInUser?.isCook) {
            return cookProfilePageRedirect;
        }

        return {
            props: {
                signedInUser: signedInUser ?? null,
                languages: data.languages.findAll,
                cookieSettings: data.sessions.current?.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function ChefSignUpPage({ signedInUser, languages, cookieSettings }: ServerSideProps) {
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

    const abc = setup()
        ?.init(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? 'no-meta-pixel-id')
        ?.pageView();

    useEffect(() => {
        if (showSuccessAlertForNewUser || showSuccessAlertForExistingUser) {
            abc?.$fbq('trackCustom', 'CookRegistration');
        }
    }, [showSuccessAlertForNewUser, showSuccessAlertForExistingUser, abc]);

    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading || createCookLoading} />

            <PEAlert
                open={showSuccessAlertForNewUser}
                title="Deine Registirung war erfolgreich"
                subtitle="Überprüfe dein Email Postfach um deine E-Mail Adresse zu bestätigen und Zugriff auf dein Kochprofil zu erhalten. Dort gibt es einiges zu entdecken. Erstelle Gerichte und Menüs um die Aufmerksamkeit von potentiellen Kunden zu gewinnen."
                primaryButton={{ title: 'Zur Anmeldung', onClick: () => router.push('/sign-in') }}
            />

            <PEAlert
                open={showSuccessAlertForExistingUser}
                title="Deine Registirung war erfolgreich"
                subtitle="Sieh sich jetzt in deinem Kochprofil um, dort gibt es einiges zu entdecken. Erstelle Gerichte und Menüs um die Aufmerksamkeit von potentiellen Kunden zu gewinnen."
                primaryButton={{ title: 'Zu meinem Kochprofil', onClick: () => router.push('/profile') }}
            />

            <PEAlert
                type="ERROR"
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
                        <PELabelLink href="/sign-up" title="Als Gastgeber" selected={false} />
                        <PELabelLink href="" title="Als Koch" selected />
                    </div>

                    <h2 className="text-xl font-bold leading-9 tracking-tight text-gray-900">Einen Kochaccount erstellen</h2>
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
                                        languageIds: selectedLanguages.map(({ languageId }) => languageId),
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
                                            languageIds: selectedLanguages.map(({ languageId }) => languageId),
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
        </>
    );
}
