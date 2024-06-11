import { Disclosure } from '@headlessui/react';
import { PEFooter, PEHeader, PESearchBar, RatingCard } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';
import {
    CreateOneSearchRequestDocument,
    GetPageDataDocument,
    LocationSearchResult,
    SearchMode,
    SearchParams,
    SignedInUser,
    toDBDateString,
    toQueryParams,
    toValidatedSearchParams,
} from '@people-eat/web-domain';
import debounce from 'lodash/debounce';
import {
    HandPlatter,
    MessageCircleMore,
    MessagesSquare,
    MinusIcon,
    Phone,
    PlusIcon,
    SearchCheck,
    ShieldCheck,
    ShoppingBasket,
    Sparkles,
    Utensils,
} from 'lucide-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { CookieBannerDialog } from '../components/CookieBannerDialog';
import { NewsletterDialog } from '../components/NewsletterDialog';
import { createApolloClient } from '../network/apolloClients';
import getLocationSuggestions from '../network/getLocationSuggestions';
import { useMutation } from '@apollo/client';

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

const ratings = [
    {
        body: 'War super lecker am letzten Samstag!',
        authorName: 'Martin M.',
    },
    {
        body: 'Wir hatten einen hervorragenden Abend, schwer zu toppen, was und mit welcher Hingabe für uns gezaubert wurde!',
        authorName: 'Felix H.',
    },
    {
        body: 'Also wir sind sehr begeistert, uns wurde eine fantastischer Abend beschert. Vielen lieben Dank, gerne wieder ♥️',
        authorName: 'Stefan R.',
    },
    {
        body: 'Ich war sehr zufrieden und bin daher auch schnell fündig geworden. Danke nochmal, dass auf meine individuellen Wünsche eingegangen ist :) Gerne buche ich in Zukunft wieder ein Koch über euch',
        authorName: 'Sebastian H.',
    },
    {
        body: 'Wir hatten einen wundervollen Abend. Alles war zu unserer vollsten Zufriedenheit',
        authorName: 'Timo J.',
    },
    {
        body: 'Ich war auf der Suche nach einem Geburtstagsgeschenk und wurde hier schnell fündig. Meine Gutschein-Wünsche wurden berücksichtigt; der Kontakt war sehr freundlich! Ich freue mich schon auf das Abendessen!',
        authorName: 'Paulina A.',
    },
    {
        body: 'Unsere Köchin Uta hat uns ein 3-Gänge-Menü vom feinsten gezaubert, und ließ sich auch nicht durch unsere Fragen und Kommentare beim Kochen aus der Ruhe bringen. Das Essen hat toll geschmeckt, es war ein relaxter Abend und wir können es nur weiterempfehlen!!',
        authorName: 'Nico S.',
    },
    {
        body: 'Dominik hat unsere Firmfeier bekocht. Es war wunderbar, wir konnten ein leckeres Menü in unserem eigenen Garten genießen. Dominik war sehr nett, das Essen hervorragend für Auge und Gaumen.',
        authorName: 'Uta W.',
    },
    {
        body: 'Wir haben für einen besonderen Anlass ein außergewöhnliches Event gesucht und sind bei PeopleEat fündig und bestens beraten worden. Die Vermittlung eines Privatkochs war zügig und Details zur gewünschten Gestaltung konnten per Tel. oder Whats App unkompliziert und individuell besprochen werden. Adel hat für uns ein 5-Gänge-Menü gezaubert. Es war ein Augen-und Gaumenschmaus! Der Abend war perfekt und darum - vielen Dank an das engagierte PeopleEat Team und den sehr sympatischen Koch.',
        authorName: 'Brigitte Z.',
    },
    {
        body: 'Wir haben Uta aus Ottobrunn im Januar für ein Home-Dinner gebucht. Sie bereite bei uns in der offenen Küche ein hervorragendes 3-Gänge-Menü vor, während wir gemütlich am Tisch mit Freunden plauderten. Trotzdem konnten wir Uta zwischendurch über die Schulter schauen und uns ein paar wertvolle Rezepttipps und Infos zu „geheimen“ Zutaten abholen. Rundum ein gelungener Abend - und ich musste noch nicht mal aufräumen. Danke an Uta, kann ich nur weiterempfehlen. Eine ganz tolles Event!',
        authorName: 'Katrin D.',
    },
];

const bulletPointList1 = [
    {
        id: 1,
        name: 'Einkauf der Zutaten',
        description: 'Du erhältst frische und regionale Lebensmittel von deinem Koch zu dir nachhause geliefert und vor Ort zubereitet.',
        icon: ShoppingBasket,
    },
    {
        id: 2,
        name: 'Servieren der Gerichte',
        description: 'Lehn dich zurück, lass dich und deine Lieben kulinarisch verwöhnen und kreiert Erinnerungen die bleiben.',
        icon: HandPlatter,
    },
    {
        id: 3,
        name: 'Saubere Küche',
        description: 'Lass den Abend ausklingen und mache dir keine Gedanken mehr über das Aufräumen der Küche danach.',
        icon: Sparkles,
    },
];

const bulletPointList2 = [
    {
        id: 1,
        role: '24 / 7 Support',
        description:
            'Als Gastgeber möchtest du, dass alles perfekt verläuft! Wir reagieren schnell, antworten genau und lösen alle Probleme. Ganz ehrlich. Was auch immer passiert, wir sind für dich da.',
        icon: Phone,
    },
    {
        id: 2,
        role: 'Sichere Bezahlung',
        description: 'Deine Zahlung ist geschützt und wird erst freigegeben, nachdem die Buchung von deinem Koch bestätigt wird.',
        icon: ShieldCheck,
    },
    {
        id: 3,
        role: 'Einfache Kommunikation',
        description:
            'Vergiss dutzende von E-Mails oder Telefonanrufen, wir halten deine Bestelldetails an einem Ort fest und sorgen für eine reibungslose Kommunikation mit deinem Koch.',
        icon: MessageCircleMore,
    },
];

const bulletPointList3 = [
    {
        name: 'Finde einen Koch in deiner Region',
        description: 'Unsere Köche bieten für jeden Geschmack und jedes Budget ein passendes Menü an',
        href: '#',
        icon: SearchCheck,
    },
    {
        name: 'Buche dein Lieblingsmenü',
        description:
            'Du stellst aus verschiedenen Gerichten ein Menü zusammen und erhältst direkt den Preis, den wir anhand deiner Angaben berechnen',
        href: '#',
        icon: Utensils,
    },
    {
        name: 'Kommuniziere via Chat mit deinem Koch',
        description:
            'Stimme dich jederzeit mit deinem Koch via Chat über die letzten Einzelheiten wie Menübeginn, Ankunftszeit, oder die Vorbereitungszeit ab',
        href: '#',
        icon: MessagesSquare,
    },
];

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    searchParams: SearchParams;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);
    const searchParams = toValidatedSearchParams(query);

    try {
        const result = await apolloClient.query({ query: GetPageDataDocument });

        return {
            props: {
                signedInUser: result.data.users.signedInUser ?? null,
                searchParams,
            },
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default function HomePage({ signedInUser, searchParams }: ServerSideProps) {
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

    const [createOneSearchRequest] = useMutation(CreateOneSearchRequestDocument);

    return (
        <>
            <Head>
                <title>Koch für Zuhause | Privatkoch mieten | PeopleEat</title>
                <meta
                    name="description"
                    content="Finde einen Privatkoch in der Nähe für jeden Anlass bei dir Zuhause. Mache aus deinem nächsten Team-Event, Candle-Light-Dinner oder Geburtstagsfeier eine unvergessliche Experience."
                />
                <meta
                    name="keywords"
                    content="PeopleEat, Koch für Zuhause, Privatkoch, Koch mieten, Private Chef, Frankfurt, Hamburg, München, Köln, Berlin, Kundenevent, Team Event, Geburtstag, Jugendseeleabschied Ideen"
                />
                <link rel="alternate" href="https://people-eat.com/" hrefLang="x-default" />
                <link rel="alternate" href="https://people-eat.com/" hrefLang="de" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <PEHeader signedInUser={signedInUser} onOpenNewsletter={() => setNewsletterOpen(true)} />

                <NewsletterDialog open={newsletterOpen} />

                <CookieBannerDialog />

                <div>
                    <div className="relative bg-gray-900">
                        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                            <Image
                                unoptimized
                                src="/home/wein-dinner.png"
                                alt=""
                                className="h-full w-full object-cover object-center"
                                width={1400}
                                height={800}
                            />
                        </div>

                        <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50" />

                        <div className="relative mx-auto flex max-w-3xl flex-col px-6 py-32 text-center sm:py-64 lg:px-0 items-stretch">
                            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
                                Hier erwarten dich Privatköche für jeden Anlass bei dir Zuhause
                            </h1>

                            <p className="mt-4 mb-8 text-xl text-white">
                                Erlebe kulinarische Genussmomente mit deinen Lieben. Finde einen Koch in deiner Stadt
                            </p>

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
                                                origin: 'HOME',
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
                                                origin: 'HOME',
                                            },
                                        },
                                    });
                                }}
                            />

                            <div className="sm:flex mt-8 self-center">
                                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-white ring-1 ring-white hover:ring-gray-900/20">
                                    Du hast kein Menü gefunden oder hast individuelle Präferenzen?{' '}
                                    <Link
                                        className="whitespace-nowrap font-semibold text-orange-500"
                                        href={{
                                            pathname: '/global-booking-request',
                                            query: toQueryParams({ selectedLocation, date, adults, children }),
                                        }}
                                    >
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        Anfrage senden <span aria-hidden="true">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Spare deine Zeit und Energie auf der Suche nach deinem Privatkoch
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Bringe die talentiertesten Köche und ihre Menüs aus ganz Deutschland ganz einfach und bequem zu dir
                                Nachhause.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                {bulletPointList3.map((feature) => (
                                    <div key={feature.name} className="flex flex-col">
                                        <dt className="text-base font-semibold leading-7 text-gray-900">
                                            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                                                <feature.icon strokeWidth={1} className="h-6 w-6 text-white" aria-hidden="true" />
                                            </div>
                                            {feature.name}
                                        </dt>
                                        <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                            <p className="flex-auto">{feature.description}</p>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl bg-orange-200 lg:bg-transparent lg:px-8">
                    <div className="lg:grid lg:grid-cols-12">
                        <div className="relative z-10 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:bg-transparent lg:py-16">
                            <div className="absolute inset-x-0 h-1/2 bg-gray-50 lg:hidden" aria-hidden="true" />
                            <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-none lg:p-0">
                                <div className="aspect-h-6 aspect-w-10 sm:aspect-h-1 sm:aspect-w-2 lg:aspect-w-1">
                                    <Image
                                        className="rounded-3xl object-cover object-center shadow-2xl"
                                        src="/home/Gutschein Koch.png"
                                        alt=""
                                        width={1824}
                                        height={1080}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative bg-orange-200 lg:col-span-10 lg:col-start-3 lg:row-start-1 lg:grid lg:grid-cols-10 lg:items-center lg:rounded-3xl">
                            <div className="relative mx-auto max-w-md space-y-6 px-6 py-12 sm:max-w-3xl sm:py-16 lg:col-span-6 lg:col-start-4 lg:max-w-none lg:p-0 flex flex-col gap-2">
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-indigo-950" id="join-heading">
                                    Bereite deinen Lieben ein <br /> unvergessliches Geschenk
                                </h2>
                                <p className="text-lg text-indigo-950">
                                    Verschenke deinen Lieben ein unvergessliches kulinarisches Erlebnis und bringe Restaurant Erlebnisse zu
                                    ihnen nachhause. Dieses außergewöhnliche Geschenk ist eine völlig neue Art, um einzigartige
                                    Menükreationen, zubereitet von einem Privatkoch zu genießen. Der Erlebnisgutschein eignet sich perfekt
                                    für romantische Abende, besondere Genussmomente Zuhause, entspannte Dinnerpartys oder um einfach mal
                                    jemandem danke zu sagen. Ein Moment, der für immer in Erinnerung bleiben wird.
                                </p>

                                <div>
                                    <PELink title="Gutschein kaufen" href="/gift-cards" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8 overflow-hidden">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
                            <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    Feiere einzigartige Anlässe und kreiere unvergessliche Momente an jedem Ort
                                </h2>
                                <p className="mt-6 text-xl leading-8 text-gray-600">
                                    Ein Privatkoch ist die ideale Gelegenheit jeden Anlass zu feiern. Egal, ob du ein Treffen mit deinen
                                    Freunden, ein Team-Event, einen Geburtstag planst oder ein Familienessen organisierst, PeopleEat bietet
                                    dir die Plattform auf der du deine Lebensmomente mit kulinarischen Erlebnissen verbindest.
                                </p>
                                <div className="mt-10 flex">
                                    <PELink
                                        title="Jetzt Buchen"
                                        href={{
                                            pathname: '/global-booking-request',
                                            query: toQueryParams({ selectedLocation, date, adults, children }),
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
                                <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                                    <Image
                                        unoptimized
                                        src="/home/13.jpg"
                                        alt="Koch für private Feier"
                                        className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                                        width={600}
                                        height={400}
                                    />
                                </div>
                                <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
                                    <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                                        <Image
                                            unoptimized
                                            src="/home/12.jpg"
                                            alt="Miete einen Koch"
                                            className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                                            width={600}
                                            height={400}
                                        />
                                    </div>
                                    <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                                        <Image
                                            unoptimized
                                            src="/home/15.jpg"
                                            alt="Koch zu mieten"
                                            className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                                            width={600}
                                            height={400}
                                        />
                                    </div>
                                    <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                                        <Image
                                            unoptimized
                                            src="/home/14.jpg"
                                            alt="Koch mieten für zuhause"
                                            className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                                            width={600}
                                            height={400}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden py-16 lg:py-24">
                    <div className="relative mx-auto max-w-xl px-6 lg:max-w-7xl lg:px-8">
                        <svg
                            className="absolute left-full hidden -translate-x-1/2 -translate-y-1/4 transform lg:block"
                            width={404}
                            height={784}
                            fill="none"
                            viewBox="0 0 404 784"
                            aria-hidden="true"
                        >
                            <defs>
                                <pattern
                                    id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-orange-400" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={784} fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)" />
                        </svg>

                        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
                            <div className="relative">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    Du schaffst einzigartige Restaurant Dining Experiences bei dir Zuhause
                                </h2>
                                <p className="mt-3 text-lg text-gray-500">
                                    Beeindrucke deine Gäste und schaffe unvergessliche Erlebnismomente in deinen eigenen vier Wänden. Den
                                    Rest übernehmen wir.
                                </p>

                                <dl className="mt-10 space-y-10">
                                    {bulletPointList1.map((item) => (
                                        <div key={item.id} className="relative">
                                            <dt>
                                                <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl text-orange-500">
                                                    <item.icon strokeWidth={1} className="h-8 w-8" aria-hidden="true" />
                                                </div>
                                                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">{item.name}</p>
                                            </dt>
                                            <dd className="ml-16 mt-2 text-base text-gray-500">{item.description}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="relative -mx-4 mt-10 lg:mt-0" aria-hidden="true">
                                <svg
                                    className="absolute left-1/2 -translate-x-1/2 translate-y-16 transform lg:hidden"
                                    width={784}
                                    height={404}
                                    fill="none"
                                    viewBox="0 0 784 404"
                                >
                                    <defs>
                                        <pattern
                                            id="ca9667ae-9f92-4be7-abcb-9e3d727f2941"
                                            x={0}
                                            y={0}
                                            width={20}
                                            height={20}
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <rect x={0} y={0} width={4} height={4} className="text-orange-500" fill="currentColor" />
                                        </pattern>
                                    </defs>
                                    <rect width={784} height={404} fill="url(#ca9667ae-9f92-4be7-abcb-9e3d727f2941)" />
                                </svg>
                                <Image
                                    unoptimized
                                    className="relative mx-auto rounded-xl "
                                    width={1000}
                                    height={600}
                                    src="/home/dinner.jpeg"
                                    alt=""
                                />
                            </div>
                        </div>

                        <svg
                            className="absolute right-full hidden translate-x-1/2 translate-y-12 transform lg:block"
                            width={404}
                            height={784}
                            fill="none"
                            viewBox="0 0 404 784"
                            aria-hidden="true"
                        >
                            <defs>
                                <pattern
                                    id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-orange-400" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={784} fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
                        </svg>
                    </div>
                </div>

                <div className="bg-gray-50 my-12">
                    <div className="mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4">
                        <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
                            <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
                                <div className="flex flex-col gap-8">
                                    <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                                        Kein passendes Menü gefunden?
                                        <br />
                                        Sende uns eine individuelle Anfrage
                                    </h2>

                                    <ol className="text-lg text-gray-500">
                                        <li>1. Setze dein Budget sowie individuelle Präferenzen fest</li>
                                        <li>2. Erhalte einen personalisierten Menüvorschlag</li>
                                        <li>3. Stimme dich direkt via Chat mit deinem PeopleEat Chef ab.</li>
                                    </ol>

                                    <div>
                                        <PELink
                                            title="Jetzt Buchen"
                                            href={{
                                                pathname: '/global-booking-request',
                                                query: toQueryParams({ selectedLocation, date, adults, children }),
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
                                    <Image
                                        unoptimized
                                        className="object-cover object-center"
                                        src="/home/diing-2.jpg"
                                        alt=""
                                        width={500}
                                        height={500}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-16 lg:mx-0 lg:max-w-none lg:flex-row">
                            <div className="w-full lg:max-w-lg lg:flex-auto">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    Unsere Stärken liegen in deinem Komfort
                                </h2>
                                <Image
                                    unoptimized
                                    src="/home/dining.png"
                                    alt=""
                                    className="mt-16 aspect-[6/5] w-full rounded-2xl bg-gray-50 object-cover lg:aspect-auto lg:h-[34.5rem]"
                                    width={500}
                                    height={600}
                                />
                            </div>
                            <div className="w-full lg:max-w-xl lg:flex-auto">
                                <ul className="-my-8 divide-y divide-gray-100">
                                    {bulletPointList2.map((opening) => (
                                        <li key={opening.id} className="py-8">
                                            <dl className="relative flex flex-wrap gap-x-3">
                                                <dd className="w-full flex-none text-lg font-semibold tracking-tight text-gray-900 flex gap-2">
                                                    <opening.icon strokeWidth={1} className="h-8 w-8 text-orange-500" aria-hidden="true" />
                                                    {opening.role}
                                                </dd>

                                                <dd className="mt-2 w-full flex-none text-base leading-7 text-gray-600">
                                                    {opening.description}
                                                </dd>
                                            </dl>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <h2 className="text-lg font-semibold leading-8 tracking-tight text-orange-500">Gastgeberstimmen</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Das sagen Gastgeber über ihre Erlebnisse und Erfahrungen mit PeopleEat
                            </p>
                        </div>
                        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                            <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
                                {ratings.map((testimonial) => (
                                    <RatingCard key={testimonial.authorName} authorName={testimonial.authorName} body={testimonial.body} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
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

                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:max-w-none">
                            <h2 className="text-lg font-semibold leading-8 text-gray-900">Wir werden unterstützt von</h2>
                            <div className="mx-auto mt-10 grid grid-cols-4 items-start gap-x-8 gap-y-10 sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:grid-cols-5">
                                <Link href="https://entrepreneurship-centre.fs.de/portfolio/peopleeat" target="_blank">
                                    <Image
                                        unoptimized
                                        className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
                                        src="/home/frankfurt-school-logo.png"
                                        alt="Frankfurt Business School of Finance"
                                        width={158}
                                        height={48}
                                    />
                                </Link>
                                <Link href="https://startupverband.de" target="_blank">
                                    <Image
                                        unoptimized
                                        className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
                                        src="/home/startup-verband.png"
                                        alt="Statamic"
                                        width={158}
                                        height={48}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <PEFooter />
            </div>
        </>
    );
}
