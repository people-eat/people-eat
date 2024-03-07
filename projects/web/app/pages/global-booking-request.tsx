import { useMutation } from '@apollo/client';
import { LoadingDialog, PEBookBar, PEFooter, PEHeader, SignInDialog, SignUpDialog } from '@people-eat/web-components';
import {
    AllergyOption,
    AssignOneSessionByEmailAddressDocument,
    CategoryOption,
    CreateOneUserByEmailAddressDocument,
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
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { createApolloClient } from '../network/apolloClients';
import getLocationSuggestions from '../network/getLocationSuggestions';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    categories: CategoryOption[];
    kitchens: KitchenOption[];
    allergies: AllergyOption[];
    searchParams: SearchParams;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const result = await apolloClient.query({ query: GetGlobalBookingRequestPageDataDocument });
        const searchParams = toValidatedSearchParams(query);

        return {
            props: {
                signedInUser: result.data.users.signedInUser ?? null,
                categories: result.data.categories.findAll,
                kitchens: result.data.kitchens.findAll,
                allergies: result.data.allergies.findAll,
                searchParams,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function GlobalBookingRequestPage({ signedInUser, categories, kitchens, allergies, searchParams }: ServerSideProps) {
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

    const [createOneGlobalBookingRequest, { loading }] = useMutation(CreateOneUserGlobalBookingRequestDocument, {
        variables: {
            userId: signedInUser?.userId ?? '',
            request: {
                adultParticipants: adults,
                allergyIds: selectedAllergies.map(({ allergyId }) => allergyId),
                categoryIds: selectedCategories.map(({ categoryId }) => categoryId),
                children: children,
                dateTime: new Date(),
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
            },
        },
    });

    const [assignOneSessionByEmailAddress, { loading: assignSessionLoading }] = useMutation(AssignOneSessionByEmailAddressDocument);
    const [createOneUserByEmailAddress, { loading: createUserLoading }] = useMutation(CreateOneUserByEmailAddressDocument);

    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading} />

            <SignInDialog
                open={showSignIn}
                onClose={() => setShowSignIn(false)}
                completeTitle="Anfrage Senden"
                onSignIn={(emailAddress, password) => {
                    assignOneSessionByEmailAddress({
                        variables: {
                            request: {
                                emailAddress,
                                password,
                                platform: 'BROWSER',
                                title: '',
                            },
                        },
                    }).then((result) => {
                        if (result.data?.sessions.success) {
                            setShowSignIn(false);
                            createOneGlobalBookingRequest();
                        }
                    });
                }}
                onSignUp={() => {
                    setShowSignIn(false);
                    setShowSignUp(true);
                }}
            />

            <SignUpDialog
                open={showSignUp}
                onClose={() => setShowSignUp(false)}
                completeTitle="Anfrage Senden"
                onSignUp={(firstName: string, lastName: string, emailAddress: string, phoneNumber: string, password: string) => {
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
                    }).then((result) => {
                        if (result.data?.users.success) {
                            setShowSignUp(false);
                            createOneGlobalBookingRequest();
                        }
                    });
                }}
                onSignIn={() => {
                    setShowSignIn(true);
                    setShowSignUp(false);
                }}
            />

            <LoadingDialog active={assignSessionLoading} />
            <LoadingDialog active={createUserLoading} />

            {/* <div className="bg-white rounded-xl flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                Globale Buchungsanfrage - {searchParams.adults} - {searchParams.children}
            </div> */}

            <div className="bg-white">
                <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
                        <div className="lg:col-span-6 lg:col-start-8">
                            <PEBookBar
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
                                    onClick: () => (signedInUser ? createOneGlobalBookingRequest() : setShowSignIn(true)),
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

                        <div className="mt-8 lg:col-span-6 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
                            <h2 className="sr-only">Images</h2>

                            <Image
                                src="/global-booking-request/koch-münchen.png"
                                alt=""
                                className={classNames('lg:col-span-2 lg:row-span-2 rounded-2xl')}
                                width={800}
                                height={1000}
                                unoptimized
                            />
                        </div>
                    </div>
                </main>
            </div>

            <PEFooter />
        </div>
    );
}
