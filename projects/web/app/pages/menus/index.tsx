import { useMutation } from '@apollo/client';
import { MenuCard, PEFooter, PEHeader, PESearchBar, SearchModeSwitch } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-components';
import {
    CreateOneSearchRequestDocument,
    GetPublicMenusPageDataDocument,
    GetPublicMenusPageDataQuery,
    LocationSearchResult,
    SearchMode,
    SearchParams,
    SignedInUser,
    formatPrice,
    toDBDateString,
    toQueryParams,
    toValidatedSearchParams,
} from '@people-eat/web-domain';
import debounce from 'lodash/debounce';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { NewsletterDialog } from '../../components/NewsletterDialog';
import { createApolloClient } from '../../network/apolloClients';
import getLocationSuggestions from '../../network/getLocationSuggestions';
import { CookieSettings } from '../../components/analytics/CookieSettings';
import { AnalyticsGoogle } from '../../components/analytics/AnalyticsGoogle';
import { AnalyticsClarity } from '../../components/analytics/AnalyticsClarity';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    cookieSettings: CookieSettings | null;
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
        const { data } = await apolloClient.query({
            query: GetPublicMenusPageDataDocument,
            variables: {
                request: {
                    location,
                    adultParticipants: 4,
                    children: 0,
                    dateTime: new Date(),
                },
                location,
                adults: searchParams.adults,
                children: searchParams.children,
            },
        });

        return {
            props: {
                signedInUser: data.users.signedInUser ?? null,
                menus: data.publicMenus.findMany,
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

export default function PublicMenusPage({ signedInUser, menus, searchParams, cookieSettings }: ServerSideProps) {
    const router = useRouter();

    const [searchMode, setSearchMode] = useState<SearchMode>('MENUS');
    const [adults, setAdults] = useState(searchParams.adults);
    const [children, setChildren] = useState(searchParams.children);
    const [date, setDate] = useState(new Date(searchParams.dateString));

    const [newsletterOpen, setNewsletterOpen] = useState(false);

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
        const menusSorted = [...menus];
        menusSorted.sort((a, b) => a.totalPrice.amount - b.totalPrice.amount);
        setSortedMenus(menusSorted);
    }, [menus, adults, children]);

    const [createOneSearchRequest] = useMutation(CreateOneSearchRequestDocument);

    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <Head>
                <title>Exklusive Menüs für Zuhause – Buche deinen Privatkoch bei PeopleEat</title>
                <meta name="description" content="Erstelle eigene Menüs und genieße kulinarische Erlebnismomente bei dir Zuhause" />
                <meta name="keywords" content="kulinarische Erlebnisse, 3-Gänge Menüs, Koch buchen, Event Menüs, Privatkoch Menüs" />
                <link rel="alternate" href="https://people-eat.com/menus/" hrefLang="x-default" />
                <link rel="alternate" href="https://people-eat.com/menus/" hrefLang="de" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <PEHeader signedInUser={signedInUser} onOpenNewsletter={() => setNewsletterOpen(true)} />

                <NewsletterDialog open={newsletterOpen} />

                <div className="mx-auto max-w-[88rem] px-4 pt-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-8">Menüs in deiner Umgebung</h1>
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
                            onSearchCooks={() => {
                                router.push({ pathname: '/chefs', query: toQueryParams({ selectedLocation, date, adults, children }) });
                                void createOneSearchRequest({
                                    variables: {
                                        request: {
                                            adults,
                                            children,
                                            date: toDBDateString(date),
                                            locationText: selectedLocation?.text ?? '',
                                            origin: 'PUBLIC_MENUS',
                                        },
                                    },
                                });
                            }}
                            onSearchMenus={() => {
                                router.push({ pathname: '/menus', query: toQueryParams({ selectedLocation, date, adults, children }) });
                                void createOneSearchRequest({
                                    variables: {
                                        request: {
                                            adults,
                                            children,
                                            date: toDBDateString(date),
                                            locationText: selectedLocation?.text ?? '',
                                            origin: 'PUBLIC_MENUS',
                                        },
                                    },
                                });
                            }}
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

                <div className="mx-auto max-w-[88rem] items-center justify-between gap-x-6 p-6 lg:px-8 mb-8" aria-label="Global">
                    {menus.length > 0 && (
                        <ul
                            role="list"
                            className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8 m-4"
                        >
                            {sortedMenus.map(({ menuId, title, imageUrl, kitchen, cook, categories, courseCount, totalPrice }) => (
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
                                            amount: totalPrice.amount / (searchParams.adults + searchParams.children),
                                            currencyCode: '€',
                                        })}
                                        categoryTitles={categories.map(({ title }) => title)}
                                    />
                                </Link>
                            ))}
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
