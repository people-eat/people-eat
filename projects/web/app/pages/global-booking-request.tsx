import { useMutation } from '@apollo/client';
import { BookForm, LoadingDialog, PEFooter, PEHeader } from '@people-eat/web-components';
import { PEAlert } from '@people-eat/web-core-components';
import {
    AllergyOption,
    CategoryOption,
    CreateOneUserGlobalBookingRequestDocument,
    GetGlobalBookingRequestPageDataDocument,
    KitchenOption,
    LocationSearchResult,
    PriceClass,
    SearchParams,
    SignedInUser,
    Time,
    toValidatedSearchParams,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { AnalyticsClarity } from '../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../components/analytics/CookieSettings';
import { PEAuthDialog } from '../components/PEAuthDialog';
import { createApolloClient } from '../network/apolloClients';
import getLocationSuggestions from '../network/getLocationSuggestions';

interface ServerSideProps {
    initialSignedInUser: SignedInUser | null;
    cookieSettings: CookieSettings | null;
    categories: CategoryOption[];
    kitchens: KitchenOption[];
    allergies: AllergyOption[];
    searchParams: SearchParams;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetGlobalBookingRequestPageDataDocument });
        const searchParams = toValidatedSearchParams(query);

        return {
            props: {
                initialSignedInUser: data.users.signedInUser ?? null,
                categories: data.categories.findAll,
                kitchens: data.kitchens.findAll,
                allergies: data.allergies.findAll,
                searchParams,
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

export default function GlobalBookingRequestPage({
    initialSignedInUser,
    categories,
    kitchens,
    allergies,
    searchParams,
    cookieSettings,
}: ServerSideProps) {
    const [signedInUser, setSignedInUser] = useState(initialSignedInUser);

    const router = useRouter();

    const [adults, setAdults] = useState(searchParams.adults);
    const [children, setChildren] = useState(searchParams.children);
    const [date, setDate] = useState(new Date(searchParams.dateString));
    const [time, setTime] = useState<Time>({ hours: 20, minutes: 0 });

    const [message, setMessage] = useState('');
    const [occasion, setOccasion] = useState('');

    const [locationSearchResults, setLocationSearchResults] = useState<LocationSearchResult[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | undefined>(
        searchParams.locationText && searchParams.locationLatitude && searchParams.locationLongitude
            ? {
                  id: '',
                  text: searchParams.locationText,
                  latitude: searchParams.locationLatitude,
                  longitude: searchParams.locationLongitude,
              }
            : undefined,
    );

    const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]);
    const [selectedKitchen, setSelectedKitchen] = useState<KitchenOption | undefined>();
    const [selectedAllergies, setSelectedAllergies] = useState<AllergyOption[]>([]);

    const [priceClass, setPriceClass] = useState<PriceClass>('FINE');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onLocationSearchTextChange = useCallback(
        debounce((text: string) => getLocationSuggestions(text, (results) => setLocationSearchResults(results)), 300),
        [],
    );

    const dateTime = new Date(date);
    dateTime.setHours(time.hours);
    dateTime.setMinutes(time.minutes);

    const request = {
        adultParticipants: adults,
        allergyIds: selectedAllergies.map(({ allergyId }) => allergyId),
        categoryIds: selectedCategories.map(({ categoryId }) => categoryId),
        children: children,
        dateTime,
        duration: 0,
        kitchenId: selectedKitchen?.kitchenId,
        location: {
            latitude: selectedLocation?.latitude ?? 0,
            longitude: selectedLocation?.longitude ?? 0,
            text: selectedLocation?.text,
        },
        message,
        occasion: occasion,
        phoneNumber: undefined,
        priceClassType: priceClass,
    };

    const [createOneGlobalBookingRequest, { loading, data, reset }] = useMutation(CreateOneUserGlobalBookingRequestDocument, {
        variables: {
            userId: signedInUser?.userId ?? '',
            request,
        },
    });

    const [authDialogOpen, setAuthDialogOpen] = useState(false);

    const showSuccessAlert = data?.users.globalBookingRequests.success ?? false;
    const showFailedAlert = data ? !data.users.globalBookingRequests.success : false;

    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <Head>
                <title>Privatkoch für einen Abend buchen </title>
                <meta
                    name="description"
                    content="Buchen Sie Deutschlandweit private Köche bei PeopleEat. Individuelle Anfragen für Halal, Kosher, vegetarische und vegane Gerichte sowie verschiedene internationale Küchen. Perfekt für besondere Anlässe, maßgeschneiderte kulinarische Erlebnisse und spezielle diätetische Bedürfnisse."
                />
                <meta
                    name="keywords"
                    content="Gourmet Koch für Zuhause, Individuelle Anfrage, Privater Koch, Koch mieten Preise, Persönliche Koch"
                />
            </Head>

            <div>
                <PEHeader signedInUser={signedInUser} />

                <PEAlert
                    open={showSuccessAlert}
                    title="Anfrage erfolgreich gesendet"
                    subtitle="In deinem Emailpostfach findest du eine Bestätigung deiner Buchungsnafrage. Wir werden uns bald bei dir melden."
                    primaryButton={{ title: 'Fertig', onClick: () => router.push('/') }}
                />

                <PEAlert
                    type="ERROR"
                    open={showFailedAlert}
                    title="Leider ist ein Fehler aufgetreten"
                    subtitle="Bitte versuche es später erneut"
                    primaryButton={{ title: 'Erneut versuchen', onClick: () => reset() }}
                />

                <LoadingDialog active={loading} />

                <PEAuthDialog
                    open={authDialogOpen}
                    onClose={() => setAuthDialogOpen(false)}
                    signInButtonTitle="Anfrage senden"
                    signUpButtonTitle="Registrieren"
                    onSignedInUserFetched={(changedSignedInUser) => {
                        setAuthDialogOpen(false);
                        setSignedInUser(changedSignedInUser);
                        createOneGlobalBookingRequest({ variables: { userId: changedSignedInUser.userId, request } });
                    }}
                />

                <div className="bg-white">
                    <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-[88rem] lg:px-8 flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <h1 className="font-bold text-3xl tracking-tight text-gray-900">Individuelle Anfrage</h1>
                            <span className="text-gray-500">
                                Sende uns eine Anfrage mit deinen individuellen Präferenzen. Wir klären die letzten Einzelheiten mit dir ab
                                und matchen dich mit deinem perfekten Koch.
                            </span>
                        </div>
                        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
                            <div className="lg:col-span-6 lg:col-start-8">
                                <BookForm
                                    onLocationSearchTextChange={onLocationSearchTextChange}
                                    locationSearchResults={locationSearchResults}
                                    selectedLocation={selectedLocation}
                                    setSelectedLocation={setSelectedLocation}
                                    isOutOfTravelRadius={false}
                                    adults={adults}
                                    setAdults={setAdults}
                                    kids={children}
                                    setKids={setChildren}
                                    date={date}
                                    setDate={setDate}
                                    time={time}
                                    setTime={setTime}
                                    message={message}
                                    setMessage={setMessage}
                                    occasion={occasion}
                                    setOccasion={setOccasion}
                                    searchButton={{
                                        title: 'Anfrage senden',
                                        onClick: () => (signedInUser ? createOneGlobalBookingRequest() : setAuthDialogOpen(true)),
                                    }}
                                    categories={{
                                        categoryOptions: categories,
                                        selectedCategories: selectedCategories,
                                        onChange: setSelectedCategories,
                                    }}
                                    kitchens={{
                                        kitchenOptions: kitchens,
                                        selectedKitchen: selectedKitchen,
                                        onChange: setSelectedKitchen,
                                    }}
                                    allergies={{
                                        allergyOptions: allergies,
                                        selectedAllergies: selectedAllergies,
                                        onChange: setSelectedAllergies,
                                    }}
                                    priceClass={{
                                        value: priceClass,
                                        onChange: setPriceClass,
                                    }}
                                />
                            </div>

                            <div className="mt-8 lg:col-span-6 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0 hidden md:block">
                                <h2 className="sr-only">Images</h2>

                                <Image
                                    src="/global-booking-request/koch-münchen.png"
                                    alt=""
                                    className={classNames('lg:col-span-2 lg:row-span-2 rounded-2xl')}
                                    width={800}
                                    height={1000}
                                />
                            </div>
                        </div>
                    </main>
                </div>

                <PEFooter />
            </div>
        </>
    );
}
