import { useMutation } from '@apollo/client';
import { Disclosure } from '@headlessui/react';
import { BookBar, BookForm, LoadingDialog, MenuCard, PEFooter, PEHeader } from '@people-eat/web-components';
import { PEAlert, PEButton, PEFullPageSheet } from '@people-eat/web-core-components';
import {
    AllergyOption,
    CategoryOption,
    CreateOneUserGlobalBookingRequestDocument,
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
    translatedCookRanks,
    toValidatedSearchParams,
} from '@people-eat/web-domain';
import debounce from 'lodash/debounce';
import { Globe, HandPlatter, MapPin, MinusIcon, PlusIcon, ShoppingBasket, Sparkles } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { PEAuthDialog } from '../../components/PEAuthDialog';
import { createApolloClient } from '../../network/apolloClients';
import getLocationSuggestions from '../../network/getLocationSuggestions';
import { useRouter } from 'next/router';

const publicCooksRedirect = { redirect: { permanent: false, destination: '/chefs' } };

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

            Kurz gesagt, bei PeopleEat bieten wir dir Möglichkeit, Gastgeber auf eine neue Art zu erleben, indem du dich ganz alleine auf deine Gäste und die sensationellen Gerichte konzentrieren kannst.`,
    },
    {
        question: 'Wie lange im Voraus sollte ich einen Koch buchen',
        answer: 'Unsere Erfahrung - so früh wie möglich. Köche sind sehr gefragt und arbeiten sehr individuell, dennoch kannst du bis spätestens eine Woche vor deinem geplanten Anlass einen Koch buchen.',
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
    initialSignedInUser: SignedInUser | null;
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

    if (typeof cookId !== 'string') return publicCooksRedirect;

    try {
        const result = await apolloClient.query({
            query: GetPublicCookPageDataDocument,
            variables: {
                cookId,
            },
        });

        const cook = result.data.publicCooks.findOne;

        if (!cook) return publicCooksRedirect;

        return {
            props: {
                initialSignedInUser: result.data.users.signedInUser ?? null,
                cook,
                categories: result.data.categories.findAll,
                kitchens: result.data.kitchens.findAll,
                allergies: result.data.allergies.findAll,
                searchParams,
            },
        };
    } catch (error) {
        return publicCooksRedirect;
    }
};

export default function PublicCookPage({ initialSignedInUser, cook, categories, kitchens, allergies, searchParams }: ServerSideProps) {
    const [signedInUser, setSignedInUser] = useState(initialSignedInUser);

    const router = useRouter();
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

    const [authDialogOpen, setAuthDialogOpen] = useState(false);

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
        message:
            message +
            `<br /><br /><br /> Angefragter Koch: <a href="https://www.people-eat.com/chefs/${cook.cookId}">${cook.user.firstName}</a>`,
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

    const showSuccessAlert = data?.users.globalBookingRequests.success ?? false;
    const showFailedAlert = data ? !data.users.globalBookingRequests.success : false;

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

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

            <PEFullPageSheet title="Event Details" open={shopBook} onClose={() => setShowBook(false)}>
                <BookForm
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
            </PEFullPageSheet>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex gap-8">
                    <div className="flex-1 flex flex-col gap-12">
                        <div className="flex gap-8 items-center">
                            {cook.user.profilePictureUrl && (
                                <Image
                                    src={cook.user.profilePictureUrl}
                                    alt=""
                                    width={400}
                                    height={400}
                                    className="object-cover object-center rounded-lg w-44"
                                />
                            )}

                            <div className="flex-1 flex flex-col gap-8">
                                <div>
                                    <h1 className="font-bold text-3xl tracking-tight text-gray-900">{cook.user.firstName}</h1>
                                    <span className="text-gray-500">{translatedCookRanks[cook.rank]}</span>
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
                                <span
                                    className="text-gray-500"
                                    dangerouslySetInnerHTML={{ __html: cook.biography.split('\n').join('<br />') }}
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Menüauswahl</h2>
                            {cook.menus.length < 1 && <span className="text-gray-500">Dieser Koch hat noch keine Menüs erstellt.</span>}
                            <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 xl:gap-x-8 m-4">
                                {cook.menus.map(
                                    ({
                                        menuId,
                                        title,
                                        imageUrl,
                                        kitchen,
                                        categories,
                                        basePrice,
                                        basePriceCustomers,
                                        pricePerAdult,
                                        pricePerChild,
                                    }) => (
                                        <Link key={menuId} href={'/menus/' + menuId}>
                                            <MenuCard
                                                title={title}
                                                imageUrls={imageUrl ? [imageUrl] : []}
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

                    <BookBar
                        title="Du hast kein Menü gefunden?"
                        subtitle={`Sende ${cook.user.firstName} direkt eine Anfrage nach deinen Präferenzen`}
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

                <div className="mx-auto max-w-7xl sm:px-2 lg:px-4 block py-10">
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
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

                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
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
