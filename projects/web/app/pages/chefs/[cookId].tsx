import { useMutation } from '@apollo/client';
import { Disclosure } from '@headlessui/react';
import { LoadingDialog, MenuCard, PEBookBar, PEFooter, PEHeader, SignInDialog, SignUpDialog } from '@people-eat/web-components';
import { PEButton, PEFullPageSheet } from '@people-eat/web-core-components';
import {
    AllergyOption,
    AssignOneSessionByEmailAddressDocument,
    CategoryOption,
    CreateOneUserByEmailAddressDocument,
    GetPublicCookPageDataDocument,
    GetPublicCookPageDataQuery,
    KitchenOption,
    LocationSearchResult,
    PriceClass,
    SearchParams,
    SignedInUser,
    Time,
    calculateMenuPrice,
    formatPrice,
    geoDistance,
    toCookRank,
    toValidatedSearchParams,
} from '@people-eat/web-domain';
import debounce from 'lodash/debounce';
import { Globe, HandPlatter, MapPin, MinusIcon, PlusIcon, ShoppingBasket, Sparkles } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { createApolloClient } from '../../network/apolloClients';
import getLocationSuggestions from '../../network/getLocationSuggestions';

const faqs = [
    {
        question: 'Wie funktioniert die Menü Buchungsanfrage?',
        answer: `
            Das senden einer Menü Buchungsanfrage ist super einfach.

            1. Wähle einen Koch oder direkt ein Menü: Entscheide dich für einen unserer Köche und wähle das passende Menü aus.
            2. Wähle aus verscheidenden Gerichten und teile deine Präferenzen: Personalisiere dein Wunschmenü, indem du aus verschiedenen Gerichten je Gang auswählst. Falls Allergien bei Teilnehmern beachtet werden müssen, kannst du diese vor Absenden der Anfrage angeben.
            3. Sende deine Anfrage: Gib Datum, Uhrzeit, Gästeanzahl und die Gastgeberadresse ein und schließe die Buchungsanfrage ab.
            4. Buchung bestätigt: Der ausgewählte Koch wird deine Anfrage umgehend prüfen und bestätigen. Nach akzeptieren der Anfrage kannst du direkt mit dem Koch über Chat kommunizieren und die letzten Einzelheiten abstimmen.`,
    },
    {
        question: 'Wie funktioniert die Individuelle Buchungsanfrage?',
        answer: `So gehst du vor:

            1. Buchungsdetails und Nachricht an uns: Du startest, indem du uns alle Details zu deinem Anlass mitteilst. Gleichzeitig kannst du uns im Textfeld eine Nachricht über deine besonderen Wünsche und Anforderungen informieren.
            2. Wir matchen dich mit einem passenden Koch: Wir prüfen deine Anfrage sorgfältig, um sicherzustellen, dass du den idealen Koch für deine Feier erhältst, der deinen Anforderungen entspricht.
            3. Kontaktaufnahme: Sobald der passende Koch deine Anfrage akzeptiert, melden wir uns bei dir mit den nächsten Schritten.`,
    },
    {
        question: 'Was ist im Preis inklusive?',
        answer: `Bei PeopleEat lehnst du dich zurück und genießt die Zeit als Gastgeber. Das bedeutet, dass der Koch vom Einkauf bis zum verlassen einer sauberen Küche alles übernimmt. Im Preis inbegriffen sind:

            1. Einkauf der Lebensmittel: Der Koch kümmert sich um dein Einkauf der Lebensmittel.
            2. Zubereitung der Gerichte: Die Lebensmittel und die dazugehörigen Zutaten werden frisch in deiner Küche zubereitet.
            3. Servieren der Gerichte: Genieße es Gastgeber zu sein und mache dir keine Gedanken um das Servieren und Anrichten der Gerichte. Das übernimmt der Koch.
            4. Eine saubere Küche: Während du und deine Gäste den letzten Gang genussreich verzehrt, trägt der Koch dafür Sorge, dass die Küche sauber hinterlassen wird.

            Kurz gesagt, bei PeopleEat bieten wir dir Möglichkeit, Gastgeber auf eine neue Art zu erleben, indem du dich ganz alleine auf deine Gäste und die sensationellen Gerichte konzentrieren kannst.
            Wir lange im Voraus sollte ich einen Koch buchen?

            Unsere Erfahrung - so früh wie möglich. Köche sind sehr gefragt und arbeiten sehr individuell, dennoch kannst du bis spätestens eine Woche vor deinem geplanten Anlass einen Koch buchen.`,
    },
    {
        question: 'Wie sieht es mit den Getränken aus?',
        answer: 'Wir stellen derzeit noch keine Getränkeauswahl zur Verfügung. Wir sind der Meinung, dass das Genießen seiner Lieblingsgetränke wie Weine, Aperitif etc. uneingeschränkt den Wohlfühlfaktor steigert und deshalb in deinen Händen liegen sollte. Falls du Getränkevorschläge benötigst, stehen wir dir dennoch gerne zur Verfügung :).',
    },
    {
        question: 'Benötige ich Besteck und Geschirr?',
        answer: 'Im Regelfall sind alle Gegenstände bei dir vorhanden. Falls du Besteck oder Geschirr benötigst, kannst du dich gerne mit uns in Verbindung setzen. Wir finden eine passende Lösung für dich. ',
    },
    {
        question: 'Wie kann ich Menüdetails mit dem Koch besprechen?',
        answer: 'Menüanpassungen können auch nach der Buchung auftreten. Über den Chat kannst du alle Menüdetails mit dem Koch abstimmen. ',
    },
    {
        question: 'Wann bezahle ich für die Buchung?',
        answer: 'Der Gesamtbetrag deiner Buchung wird frühestens zwei Wochen im Voraus abgebucht. Findet dein Anlass innerhalb von zwei Wochen statt, wird der Gesamtbetrag direkt abgebucht. Es ist wichtig zu beachten, dass deine Zahlung erst ein Tag nach dem Anlass an den Koch ausbezahlt wird. Das stellt sicher, dass alles reibungslos abläuft und deine Zahlung geschützt ist.',
    },
];

const incentives = [
    {
        name: 'Frische Zutaten geliefert',
        imageSrc: ShoppingBasket,
        description:
            'Erhalte frische und regionale Lebensmittel direkt von deinem Privatkoch zu dir nachhause geliefert und in deine Küche zubereitet.',
    },
    {
        name: 'Gerichte direkt serivert',
        imageSrc: HandPlatter,
        description: 'Lehn dich zurück, lass dich und deine Lieben kulinarisch verwöhnen und kreiert Erinnerungen die bleiben.',
    },
    {
        name: 'Saubere Küche',
        imageSrc: Sparkles,
        description: 'Lass den Abend mit deinen Gästen ausklingen und kümmere dich nicht mehr um das Aufräumen deiner Küche',
    },
];

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    cook: NonNullable<GetPublicCookPageDataQuery['publicCooks']['findOne']>;
    categories: CategoryOption[];
    kitchens: KitchenOption[];
    allergies: AllergyOption[];
    searchParams: SearchParams;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);
    const searchParams = toValidatedSearchParams(query);

    const { cookId } = query;

    if (typeof cookId !== 'string') throw new Error();

    try {
        const result = await apolloClient.query({
            query: GetPublicCookPageDataDocument,
            variables: {
                cookId,
            },
        });

        const cook = result.data.publicCooks.findOne!;

        return {
            props: {
                signedInUser: result.data.users.signedInUser ?? null,
                cook,
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

export default function PublicCookPage({ signedInUser, cook, categories, kitchens, allergies, searchParams }: ServerSideProps) {
    const [shopBook, setShowBook] = useState(false);

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

    const distance: number | undefined = selectedLocation && geoDistance({ location1: selectedLocation, location2: cook.location });

    const isOutOfCookTravelRadius =
        !!cook.maximumTravelDistance && distance !== undefined && location && distance > cook.maximumTravelDistance;

    const [assignOneSessionByEmailAddress, { loading: assignSessionLoading }] = useMutation(AssignOneSessionByEmailAddressDocument);
    const [createOneUserByEmailAddress, { loading: createUserLoading }] = useMutation(CreateOneUserByEmailAddressDocument);

    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showNextDialog, setShowNextDialog] = useState(false);

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

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
                            setShowNextDialog(true);
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
                            setShowNextDialog(true);
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

            {showNextDialog && 'Finalize booking dialog'}

            <PEFullPageSheet title="Event Details" open={shopBook} onClose={() => setShowBook(false)}>
                <PEBookBar
                    onLocationSearchTextChange={onLocationSearchTextChange}
                    locationSearchResults={locationSearchResults}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    isOutOfTravelRadius={isOutOfCookTravelRadius}
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
                        onClick: () => {
                            if (!signedInUser) {
                                setShowSignIn(true);
                            }
                        },
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
            </PEFullPageSheet>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex gap-8">
                    <div className="flex-1 flex flex-col gap-12">
                        <div className="flex gap-8">
                            {cook.user.profilePictureUrl && (
                                <Image
                                    unoptimized
                                    src={cook.user.profilePictureUrl}
                                    alt=""
                                    width={400}
                                    height={400}
                                    className="object-cover object-center rounded-full w-44"
                                />
                            )}

                            <div className="flex-1 flex flex-col gap-8">
                                <div>
                                    <h1 className="font-bold text-3xl tracking-tight text-gray-900">{cook.user.firstName}</h1>
                                    <span className="text-gray-500"> {toCookRank[cook.rank]}</span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-4">
                                        <MapPin strokeWidth={1.5} />
                                        <span>{cook.city}</span>
                                    </div>

                                    {cook.languages.length > 0 && (
                                        <div className="flex gap-4 ">
                                            <Globe strokeWidth={1.5} />
                                            <span>{cook.languages.map(({ title }) => title).join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {cook.biography && (
                            <div className="flex flex-col gap-2">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Über {cook.user.firstName}</h2>
                                <div className="text-gray-500">{cook.biography}</div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Menüauswahl</h2>
                            <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 xl:gap-x-8 m-4">
                                {cook.menus.map(
                                    ({
                                        menuId,
                                        title,
                                        imageUrls,
                                        kitchen,
                                        categories,
                                        basePrice,
                                        basePriceCustomers,
                                        pricePerAdult,
                                        pricePerChild,
                                    }) => (
                                        <Link key={menuId} href={'/menus/' + menuId}>
                                            <MenuCard
                                                id={menuId}
                                                title={title}
                                                imageUrl={imageUrls[0]}
                                                kitchenTitle={kitchen?.title}
                                                cook={{
                                                    firstName: '',
                                                    profilePictureUrl: null,
                                                }}
                                                courseCount={3}
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
                        </div>
                    </div>

                    <div className="sticky top-4 float-none h-full hidden lg:block shadow-lg shadow-orange-500/20 rounded-2xl p-6 w-96">
                        <PEBookBar
                            onLocationSearchTextChange={onLocationSearchTextChange}
                            locationSearchResults={locationSearchResults}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                            isOutOfTravelRadius={isOutOfCookTravelRadius}
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
                                onClick: () => {
                                    if (!signedInUser) {
                                        setShowSignIn(true);
                                    }
                                },
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
                </div>

                <div className="mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4 block">
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
                        <div className="max-w-3xl">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                                Du bist der Gastgeber, wir kümmern uns um den Rest
                            </h2>
                            <p className="mt-4 text-gray-500">
                                Spare Zeit und kümmere dich voll und ganz auf deine Gäste, währenddessen versorgt dein Koch dich und deine
                                Gäste mit erstklassigen kulinarischen Menükreationen.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                            {incentives.map((incentive) => (
                                <div key={incentive.name} className="sm:flex lg:block">
                                    <div className="sm:flex-shrink-0">
                                        <incentive.imageSrc strokeWidth={1.5} className="h-8 w-8 text-orange-500" />
                                    </div>
                                    <div className="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
                                        <h3 className="text-sm font-medium text-gray-900">{incentive.name}</h3>
                                        <p className="mt-2 text-sm text-gray-500">{incentive.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
                    <div className="mx-auto max-w-7xl divide-y divide-gray-900/10">
                        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Häufig gestellte Fragen</h2>
                        <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
                            {faqs.map((faq) => (
                                <Disclosure as="div" key={faq.question} className="pt-6">
                                    {({ open }) => (
                                        <>
                                            <dt>
                                                <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                                                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                                                    <span className="ml-6 flex h-7 items-center">
                                                        {open ? (
                                                            <MinusIcon className="h-6 w-6" aria-hidden="true" />
                                                        ) : (
                                                            <PlusIcon className="h-6 w-6" aria-hidden="true" />
                                                        )}
                                                    </span>
                                                </Disclosure.Button>
                                            </dt>
                                            <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                                <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            <div className="lg:hidden fixed inset-x-0 bottom-0 flex flex-col justify-between gap-x-8 gap-y-4 bg-white p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center lg:px-8">
                <div className="flex justify-between w-full">
                    <span></span>
                    <PEButton title="Anfrage senden" onClick={() => setShowBook(true)} />
                </div>
            </div>

            <PEFooter />
        </div>
    );
}