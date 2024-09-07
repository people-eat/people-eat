import { CookCard, PEFooter, PEHeader, PELink } from '@people-eat/web-components';
import { GetCityHubPageDataDocument, GetCityHubPageDataQuery, SignedInUser } from '@people-eat/web-domain';
import { CheckCircle } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { AnalyticsClarity } from '../../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../../components/analytics/CookieSettings';
import { createApolloClient } from '../../network/apolloClients';

const publicCooksRedirect = { redirect: { permanent: false, destination: '/chefs' } };

interface CityHub {
    pathName: string;
    title: string;
    description: string;
    keywords: string[];
    city: {
        name: string;
        location: { latitude: number; longitude: number };
    };
}

const cityHubs: CityHub[] = [
    {
        pathName: 'Heidelberg',
        title: 'Köche in Heidelberg',
        description: 'Description',
        keywords: ['Heidelberg', 'Köche'],
        city: {
            name: 'Heidelberg',
            location: { latitude: 49.399671, longitude: 8.673215 },
        },
    },
    {
        pathName: 'Berlin',
        title: 'Köche in Berlin',
        description: 'Description',
        keywords: ['Berlin', 'Köche'],
        city: {
            name: 'Berlin',
            location: { latitude: 52.519553, longitude: 13.404773 },
        },
    },
    {
        pathName: 'Mietköche-In-München',
        title: 'Köche in München',
        description: 'Description',
        keywords: ['München', 'Köche'],
        city: {
            name: 'München',
            location: { latitude: 48.134631, longitude: 11.582123 },
        },
    },
];

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    cookieSettings: CookieSettings | null;
    cityHub: CityHub;
    cooks: NonNullable<GetCityHubPageDataQuery['publicCooks']['findMany']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    const { city } = query;

    if (typeof city !== 'string') return publicCooksRedirect;

    try {
        const cityHub = cityHubs.find((h) => h.pathName === city);

        if (!cityHub) return publicCooksRedirect;

        const { data } = await apolloClient.query({
            query: GetCityHubPageDataDocument,
            variables: { request: { location: cityHub.city.location, dateTime: new Date(), adultParticipants: 4 } },
        });

        return {
            props: {
                signedInUser: data.users.signedInUser ?? null,
                cookieSettings: data.sessions.current?.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
                cityHub,
                cooks: data.publicCooks.findMany,
            },
        };
    } catch (error) {
        return publicCooksRedirect;
    }
};

export default function PublicCookPage({ signedInUser, cookieSettings, cityHub, cooks }: ServerSideProps) {
    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <Head>
                <title>{cityHub.title}</title>
                <meta name="description" content={cityHub.description} />
                <meta name="keywords" content={cityHub.keywords.join(', ')} />

                {/* <link rel="alternate" href={`https://people-eat.com/chefs/${cook.cookId}`} hrefLang="x-default" />
                <link rel="alternate" href={`https://people-eat.com/chefs/${cook.cookId}`} hrefLang="de" /> */}
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <PEHeader signedInUser={signedInUser} />

                <div className="relative isolate">
                    <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8 py-16">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
                            <h1 className="mt-10 max-w-lg text-5xl font-bold tracking-tight text-gray-900">
                                Deine Privatkoch Experience in {cityHub.city.name}
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Einzigartiges Dinner-Erlebnis bei dir Zuhause. Mit einem Privatkoch, gourmet Menü und einer blitzsauberen
                                Küche.
                            </p>
                            <div className="mt-6 flex items-center gap-x-6">
                                <PELink title="Kostenloses Angebot" href="/global-booking-requests" />
                                <a
                                    target="_blank"
                                    href="https://wa.me/message/5ADGYOIYNW2JO1"
                                    className="text-sm font-semibold leading-6 text-gray-900"
                                >
                                    WhatsApp Us <span aria-hidden="true">→</span>
                                </a>
                            </div>
                            <div className="mt-10 flex gap-4">
                                <div className="flex gap-4">
                                    <CheckCircle className="text-gray-400" />
                                    Ganz unverbindlich
                                </div>
                                <div className="flex gap-4">
                                    <CheckCircle className="text-gray-400" />
                                    Antwort in 30min
                                </div>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                            <Image
                                className="mx-auto w-[22.875rem] max-w-full drop-shadow-xl rounded-xl shadow-lg"
                                src="/cities/Privatkoch Frankfurt.jpg"
                                width={400}
                                height={800}
                                alt="Privatkoch Frankfurt"
                            />
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-[88rem] items-center justify-between gap-x-6 p-6 lg:px-8 mb-8" aria-label="Global">
                    {cooks.length > 0 && (
                        <ul
                            role="list"
                            className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 m-4"
                        >
                            {cooks.map(({ cookId, user, rank, city, location, menuCount }) => (
                                <Link key={cookId} href={{ pathname: '/chefs/' + cookId }}>
                                    <CookCard
                                        user={{ firstName: user.firstName, profilePictureUrl: user.profilePictureUrl ?? null }}
                                        rank={rank}
                                        menuCount={menuCount}
                                        cityName={city}
                                        travelDistance={
                                            '0'
                                            // selectedLocation
                                            //     ? geoDistance({ location1: selectedLocation, location2: location }).toFixed(0)
                                            //     : undefined
                                        }
                                    />
                                </Link>
                            ))}
                        </ul>
                    )}

                    {/* {cooks.length < 1 && (
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
                    )} */}
                </div>

                <PEFooter />
            </div>
        </>
    );
}
