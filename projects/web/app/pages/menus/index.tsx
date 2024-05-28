import { MenuCard, PEFooter, PEHeader, PESearchBar, SearchModeSwitch } from '@people-eat/web-components';
import {
    GetPublicMenusPageDataDocument,
    GetPublicMenusPageDataQuery,
    LocationSearchResult,
    SearchMode,
    SearchParams,
    SignedInUser,
    calculateMenuPrice,
    formatPrice,
    toQueryParams,
    toValidatedSearchParams,
} from '@people-eat/web-domain';
import debounce from 'lodash/debounce';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { createApolloClient } from '../../network/apolloClients';
import getLocationSuggestions from '../../network/getLocationSuggestions';
import { PELink } from '@people-eat/web-core-components';
import Head from 'next/head';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    menus: NonNullable<GetPublicMenusPageDataQuery['publicMenus']['findMany']>;
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
            query: GetPublicMenusPageDataDocument,
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
                menus: result.data.publicMenus.findMany,
                searchParams,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function PublicMenusPage({ signedInUser, menus, searchParams }: ServerSideProps) {
    const router = useRouter();

    const [searchMode, setSearchMode] = useState<SearchMode>('MENUS');
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

    const [sortedMenus, setSortedMenus] = useState(menus);

    useEffect(() => {
        console.log('sorted again');
        const menusSorted = [...menus];
        menusSorted.sort(
            (a, b) =>
                calculateMenuPrice(adults, children, a.basePrice, a.basePriceCustomers, a.pricePerAdult, a.pricePerChild) /
                    (adults + children) -
                calculateMenuPrice(adults, children, b.basePrice, b.basePriceCustomers, b.pricePerAdult, b.pricePerChild) /
                    (adults + children),
        );
        setSortedMenus(menusSorted);
    }, [menus, adults, children]);

    return (
        <>
            <Head>
                <title>Entdecke Menüs</title>

                <meta name="title" content="Entdecke Menüs" />
                <meta name="description" content="Erstelle eigene Menüs und genieße kulinarische Erlebnismomente bei dir Zuhause" />
                <meta name="keywords" content="Speisekarte, Menü für Zuhause, Essen für Zuhause bestellen" />
                <link rel="alternate" href="https://people-eat.com/menus/" hrefLang="x-default" />
                <link rel="alternate" href="https://people-eat.com/menus/" hrefLang="de" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <PEHeader signedInUser={signedInUser} />

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-16">Menüs in deiner Umgebung</h1>
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
                                    if (changedSearchMode === 'COOKS') {
                                        router.push({
                                            pathname: '/chefs',
                                            query: toQueryParams({ selectedLocation, date, adults, children }),
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8 my-8" aria-label="Global">
                    {menus.length > 0 && (
                        <ul
                            role="list"
                            className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8 m-4"
                        >
                            {sortedMenus.map(
                                ({
                                    menuId,
                                    title,
                                    imageUrl,
                                    kitchen,
                                    cook,
                                    categories,
                                    basePrice,
                                    basePriceCustomers,
                                    pricePerAdult,
                                    pricePerChild,
                                    courseCount,
                                }) => (
                                    <Link
                                        key={menuId}
                                        href={{
                                            pathname: '/menus/' + menuId,
                                            query: toQueryParams({ selectedLocation, date, adults, children }),
                                        }}
                                    >
                                        <MenuCard
                                            title={title}
                                            imageUrls={imageUrl ? [imageUrl] : []}
                                            kitchenTitle={kitchen?.title}
                                            cook={{
                                                firstName: cook.user.firstName,
                                                profilePictureUrl: cook.user.profilePictureUrl ?? null,
                                            }}
                                            courseCount={courseCount}
                                            pricePerPerson={formatPrice({
                                                amount:
                                                    calculateMenuPrice(
                                                        adults,
                                                        children,
                                                        basePrice,
                                                        basePriceCustomers,
                                                        pricePerAdult,
                                                        pricePerChild,
                                                    ) /
                                                    (adults + children),
                                                currencyCode: '€',
                                            })}
                                            categoryTitles={categories.map(({ title }) => title)}
                                        />
                                    </Link>
                                ),
                            )}
                        </ul>
                    )}
                    {menus.length < 1 && (
                        <div className="flex flex-col gap-10 items-center">
                            <div>Ups, leider konnten keine Menüs von Köchen in deiner Nähe gefunden werden</div>
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
        </>
    );
}
