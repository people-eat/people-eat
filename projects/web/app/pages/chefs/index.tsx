import { CookCard, PEFooter, PEHeader, PESearchBar, SearchModeSwitch } from '@people-eat/web-components';
import {
    GetPublicCooksPageDataDocument,
    GetPublicCooksPageDataQuery,
    LocationSearchResult,
    SearchMode,
    SearchParams,
    SignedInUser,
    geoDistance,
    toQueryParams,
    toValidatedSearchParams,
} from '@people-eat/web-domain';
import debounce from 'lodash/debounce';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { createApolloClient } from '../../network/apolloClients';
import getLocationSuggestions from '../../network/getLocationSuggestions';
import { PELink } from '@people-eat/web-core-components';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    cooks: NonNullable<GetPublicCooksPageDataQuery['publicCooks']['findMany']>;
    searchParams: SearchParams;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);
    const searchParams = toValidatedSearchParams(query);

    const location =
        searchParams.locationLatitude && searchParams.locationLongitude
            ? { latitude: searchParams.locationLatitude, longitude: searchParams.locationLongitude }
            : undefined;

    try {
        const result = await apolloClient.query({
            query: GetPublicCooksPageDataDocument,
            variables: {
                request: {
                    location,
                    adultParticipants: 4,
                    children: 0,
                    dateTime: new Date(),
                },
            },
        });

        return {
            props: {
                signedInUser: result.data.users.signedInUser ?? null,
                cooks: result.data.publicCooks.findMany,
                searchParams,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function PublicCooksPage({ signedInUser, cooks, searchParams }: ServerSideProps) {
    const router = useRouter();

    const [searchMode, setSearchMode] = useState<SearchMode>('COOKS');
    const [adults, setAdults] = useState(searchParams.adults);
    const [children, setChildren] = useState(searchParams.children);
    const [date, setDate] = useState(new Date(searchParams.dateString));

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onLocationSearchTextChange = useCallback(
        debounce((text: string) => getLocationSuggestions(text, (results) => setLocationSearchResults(results)), 300),
        [],
    );

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-16">Köche in deiner Umgebung</h1>
                <div className="flex flex-col items-stretch gap-8 lg:items-center lg:flex-row">
                    <PESearchBar
                        onLocationSearchTextChange={onLocationSearchTextChange}
                        locationSearchResults={locationSearchResults}
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        adults={adults}
                        setAdults={setAdults}
                        kids={children}
                        setKids={setChildren}
                        date={date}
                        setDate={setDate}
                        searchMode={searchMode}
                        setSearchMode={setSearchMode}
                        onSearchCooks={() =>
                            router.push({ pathname: '/chefs', query: toQueryParams({ selectedLocation, date, adults, children }) })
                        }
                        onSearchMenus={() =>
                            router.push({ pathname: '/menus', query: toQueryParams({ selectedLocation, date, adults, children }) })
                        }
                    />
                    <div className="hidden lg:block">
                        <SearchModeSwitch
                            activeMode={searchMode}
                            onChange={(changedSearchMode) => {
                                if (changedSearchMode === 'MENUS') {
                                    router.push({ pathname: '/menus', query: toQueryParams({ selectedLocation, date, adults, children }) });
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8 my-8" aria-label="Global">
                {cooks.length > 0 && (
                    <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 m-4">
                        {cooks.map(({ cookId, user, rank, city, location, menuCount }) => (
                            <Link
                                key={cookId}
                                href={{
                                    pathname: '/chefs/' + cookId,
                                    query: toQueryParams({ selectedLocation, date, adults, children }),
                                }}
                            >
                                <CookCard
                                    user={{
                                        firstName: user.firstName,
                                        profilePictureUrl: user.profilePictureUrl ?? null,
                                    }}
                                    rank={rank}
                                    menuCount={menuCount}
                                    cityName={city}
                                    travelDistance={
                                        selectedLocation
                                            ? geoDistance({ location1: selectedLocation, location2: location }).toFixed(0)
                                            : undefined
                                    }
                                />
                            </Link>
                        ))}
                    </ul>
                )}
                {cooks.length < 1 && (
                    <div className="flex flex-col gap-10 items-center">
                        <div>Ups, es konnte kein Koch in deiner Nähe gefunden werden :(</div>
                        <div>Erstelle eine globale Anfrage und wir finden einen Koch für dich der dir ein Angebot macht</div>
                        <PELink
                            title={'Globale Anfrage Senden'}
                            href={{
                                pathname: '/global-booking-request',
                                query: toQueryParams({ selectedLocation, date, adults, children }),
                            }}
                        />
                    </div>
                )}
            </div>

            <PEFooter />
        </div>
    );
}
