import { MenuCard, PEFooter, PEHeader, PESearchBar, SearchModeSwitch } from '@people-eat/web-components';
import {
    GetPublicMenusPageDataDocument,
    GetPublicMenusPageDataQuery,
    LocationSearchResult,
    SearchMode,
    SignedInUser,
} from '@people-eat/web-domain';
import debounce from 'lodash/debounce';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { createApolloClient } from '../../network/apolloClients';
import getLocationSuggestions from '../../network/getLocationSuggestions';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    menus: NonNullable<GetPublicMenusPageDataQuery['publicMenus']['findMany']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const result = await apolloClient.query({
            query: GetPublicMenusPageDataDocument,
            variables: {
                request: {
                    location: {
                        latitude: 49,
                        longitude: 8,
                    },
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
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function PublicMenusPage({ signedInUser, menus }: ServerSideProps) {
    const router = useRouter();

    const [searchMode, setSearchMode] = useState<SearchMode>('MENUS');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [date, setDate] = useState(new Date());

    const [locationSearchResults, setLocationSearchResults] = useState<LocationSearchResult[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | undefined>();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onLocationSearchTextChange = useCallback(
        debounce((text: string) => getLocationSuggestions(text, (results) => setLocationSearchResults(results)), 300),
        [],
    );

    return (
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
                        onSearch={() => router.push({ pathname: searchMode === 'COOKS' ? '/chefs' : '/menus' })}
                    />
                    <div className="hidden lg:block">
                        <SearchModeSwitch activeMode={searchMode} onChange={setSearchMode} />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8 my-8" aria-label="Global">
                <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 m-4">
                    {menus.map(
                        (
                            { menuId, title, imageUrls, kitchen, cook, categories }, // courseCount, pricePerPerson
                        ) => (
                            <Link key={menuId} href={'/menus/' + menuId}>
                                <MenuCard
                                    id={menuId}
                                    title={title}
                                    imageUrl={imageUrls[0]}
                                    kitchenTitle={kitchen?.title}
                                    cook={{
                                        firstName: cook.user.firstName,
                                        profilePictureUrl: cook.user.profilePictureUrl ?? null,
                                    }}
                                    courseCount={4}
                                    pricePerPerson={'12.34'}
                                    categoryTitles={categories.map(({ title }) => title)}
                                />
                            </Link>
                        ),
                    )}
                </ul>
            </div>

            <PEFooter />
        </div>
    );
}
