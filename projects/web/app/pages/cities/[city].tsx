import { MenuCard, PEFooter, PEHeader, PELink, RatingCard } from '@people-eat/web-components';
import { CityHub, cityHubs, formatPrice, GetCityHubPageDataDocument, GetCityHubPageDataQuery, SignedInUser } from '@people-eat/web-domain';
import classNames from 'classnames';
import { CheckCircle, CircleCheck, FileHeart, SquarePen } from 'lucide-react';
import { GetServerSideProps, Redirect } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { AnalyticsClarity } from '../../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../../components/analytics/CookieSettings';
import { createApolloClient } from '../../network/apolloClients';

const howItWorksSteps = [
    {
        name: 'Unverbindliche Anfrage stellen',
        href: '#',
        description:
            'Teile uns deine kulinarischen Wünsche mit, und wir matchen dich mit dem perfekten Privatkoch – ganz ohne Verpflichtungen.',
        icon: SquarePen,
    },
    {
        name: 'Personalisierten Menüvorschlag erhalten',
        href: '#',
        description:
            'Erhalte einen individuellen Menüvorschlag, der genau auf deine Vorlieben abgestimmt ist. Wir klären die letzten Details, um dein perfektes Dinner-Erlebnis sicherzustellen.',
        icon: FileHeart,
    },
    {
        name: 'Bezahlung und direkter Kontakt zum Koch',
        href: '#',
        description:
            'Nach der sicheren Online-Bezahlung kannst du über den Chat direkt mit deinem Koch kommunizieren, um letzte Details zu besprechen.',
        icon: CircleCheck,
    },
];

const faqs = [
    {
        id: 1,
        question: 'Wie funktioniert die Buchung eines Privatkochs über PeopleEat?',
        answer: 'Die Buchung über PeopleEat ist einfach: Du erstellst eine unverbindliche Anfrage, wir finden den perfekten Koch für dich und du erhältst einen individuellen Menüvorschlag. Nach deiner Bestätigung erfolgt die sichere Bezahlung und du kannst im Chat direkt mit deinem Koch in Kontakt treten.',
    },
    {
        id: 2,
        question: 'Was kostet ein Privatkoch?',
        answer: 'Die Kosten für einen Privatkoch hängen von deinen individuellen Wünschen, dem Menü und der Anzahl der Gäste ab. Du erhältst nach der Anfrage ein maßgeschneidertes Angebot, das zu deinem Budget passt und dir ein unvergessliches Erlebnis bietet.',
    },
    {
        id: 3,
        question: 'Was beinhaltet der Service eines Privatkochs?',
        answer: 'Der Service umfasst alles: Der Koch bringt die Zutaten mit, bereitet das Menü frisch in deiner Küche zu und serviert es. Nach dem Essen kümmert er sich um das Aufräumen, damit du dich voll und ganz auf dein exklusives kulinarisches Erlebnis konzentrieren kannst.',
    },
    {
        id: 4,
        question: 'Kann ich das Menü an meine Vorlieben und Diätwünsche anpassen?',
        answer: 'Ja, dein Menü wird individuell auf deine Vorlieben und diätetischen Anforderungen zugeschnitten. Egal ob vegan, vegetarisch, glutenfrei oder eine besondere Zubereitung – dein Koch gestaltet das Menü nach deinen Wünschen.',
    },
    {
        id: 5,
        question: 'Wie erfolgt die Bezahlung?',
        answer: 'Die Bezahlung erfolgt sicher und unkompliziert über unser System. Du kannst aus verschiedenen Zahlungsoptionen wählen, nachdem du das Menü bestätigt hast, und dich auf ein sorgenfreies Erlebnis freuen.',
    },
    {
        id: 6,
        question: 'Kann ich mit meinem Koch direkt kommunizieren?',
        answer: 'Ja, über den integrierten Chat kannst du nach der Buchung direkt mit deinem Koch in Kontakt treten, um letzte Details zu besprechen und das Erlebnis auf deine Wünsche abzustimmen.',
    },
    {
        id: 7,
        question: 'Was passiert, wenn ich meine Buchung stornieren muss?',
        answer: 'Alle Details zu Stornierungen findest du in unseren AGBs. Dort sind die Fristen und Kosten genau beschrieben, um dir maximale Flexibilität zu bieten.',
    },
    {
        id: 8,
        question: 'Muss ich etwas vorbereiten?',
        answer: 'Nein, du musst nichts vorbereiten. Dein Koch bringt alles mit, von den Zutaten bis zum Equipment. Du kannst dich entspannen und das Gourmet-Erlebnis in deinem eigenen Zuhause genießen.',
    },
    {
        id: 9,
        question: 'Welche Regionen deckt PeopleEat ab?',
        answer: 'Wir bieten unseren Service in vielen Regionen an. Gib einfach deine Postleitzahl ein, um zu prüfen, ob wir auch in deiner Gegend verfügbar sind, und buche deinen Privatkoch für Zuhause.',
    },
];

const ratings = [
    {
        body: 'Dank Lara, unserem Mietkoch, konnten wir den Abend voll und ganz mit unseren Gästen genießen. Ihr Gourmet Menü war exquisit, jeder Gang wurde perfekt präsentiert. Lara, die Köchin hat uns perfekt versorgt und die einzelnen Gänge vorgestellt. Im Restaurant wäre es wahrscheinlich sogar teurer gewesen. Einen Koch für zuhause mieten ist absolut empfehlenswert!',
        authorName: 'Thomas K.',
    },
    {
        body: 'Wir haben einen Mietkoch für zuhause gebucht und waren begeistert! Das Gourmet Menü war abwechslungsreich, perfekt zubereitet und toll präsentiert. Die gesamte Erfahrung, einen Privatkoch für einen Abend zu mieten, war absolut fantastisch!',
        authorName: 'Lucie K.',
    },
    {
        body: 'Unser Mietkoch hat ein exquisites Gourmet Menü für uns gezaubert. Jeder Gang war perfekt abgestimmt und köstlich. Einen Koch für zuhause zu mieten, war die perfekte Wahl für unseren besonderen Anlass. Einfach großartig!',
        authorName: 'Nikolas L.',
    },
    {
        body: 'Wir haben einen Privatkoch für einen Abend gemietet und waren begeistert! Die Planung war unkompliziert, das Gourmet Menü ein echter Genuss. Der Mietkoch hat alles wunderbar zubereitet und präsentiert – absolut zu empfehlen!',
        authorName: 'Jana P.',
    },
    {
        body: 'Unser Mietkoch hat uns mit einem beeindruckenden Gourmet Menü verwöhnt. Jeder Gang war ein kulinarisches Highlight. Einen Koch für zuhause zu mieten, hat unsere Feier perfekt gemacht – jederzeit wieder!',
        authorName: 'Irina H.',
    },
];

const publicCooksRedirect: { redirect: Redirect } = { redirect: { permanent: false, destination: '/chefs' } };

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    cookieSettings: CookieSettings | null;
    cityHub: CityHub;
    cooks: NonNullable<GetCityHubPageDataQuery['publicCooks']['findMany']>;
    menus: NonNullable<GetCityHubPageDataQuery['publicMenus']['findMany']>;
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
            variables: {
                cooksRequest: { location: cityHub.city.location, dateTime: new Date(), adultParticipants: 4 },
                menusRequest: { location: cityHub.city.location, dateTime: new Date(), adultParticipants: 4 },
                location: cityHub.city.location,
            },
        });

        return {
            props: {
                signedInUser: data.sessions.current.user ?? null,
                cookieSettings: data.sessions.current.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
                cityHub,
                cooks: data.publicCooks.findMany,
                menus: data.publicMenus.findMany,
            },
        };
    } catch (error) {
        return publicCooksRedirect;
    }
};

export default function PublicCookPage({ signedInUser, cookieSettings, cityHub, cooks, menus }: ServerSideProps) {
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
                    <div className="mx-auto max-w-[88rem] px-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8 py-16">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
                            <h1 className={classNames('mt-10 max-w-lg font-bold tracking-tight text-gray-900', ' text-5xl')}>
                                Finde deinen perfekten Privatkoch in {cityHub.city.name}
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Erlebe ein exklusives Dinner in {cityHub.city.name}! Buche deinen Privatkoch für besondere Anlässe wie
                                Geburtstage, Jubiläen, Familienfeiern oder romantische Abende und genieße ein maßgeschneidertes Menü, direkt
                                bei dir zu Hause.
                            </p>
                            <div className="mt-6 flex items-center gap-x-6">
                                <PELink title="Kostenloses Menü anfragen" href="/global-booking-request" />
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
                                alt="Tisch Deko-Essen mit Freunden"
                            />
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-[88rem] px-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8 pb-16">
                    <div className="mx-auto lg:mx-0 lg:flex-auto">
                        <h2 className={classNames('font-bold tracking-tight text-gray-900', 'text-4xl')}>
                            Ein Privatkoch für jeden Anlass direkt bei dir zu Hause
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Mit den privaten Köchen von PeopleEat wird jede Anlass unvergesslich. Egal, ob du Ideen für deinen Geburtstag,
                            den Junggesellenabschied, ein Treffen mit der Familie oder ein Team- oder Business-Event suchst – wir sorgen
                            dafür, dass es eine besondere Experience wird, deine Gäste überrascht sind und ihr gemeinsam tolle Erinnerungen
                            schafft.
                        </p>
                    </div>
                </div>

                {menus.length > 0 && (
                    <section aria-labelledby="features-heading" className="mx-auto max-w-[88rem] sm:px-2 lg:px-8">
                        <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                            <div className="max-w-3xl">
                                <h2 className={classNames('font-bold tracking-tight text-gray-900', 'text-4xl')}>
                                    Beliebte Menüs in {cityHub.city.name}
                                </h2>
                            </div>

                            <ul
                                role="list"
                                className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8 m-4 mt-8"
                            >
                                {menus.map(({ menuId, title, imageUrl, kitchen, cook, categories, courseCount, totalPrice }) => (
                                    <Link key={menuId} href={{ pathname: '/menus/' + menuId }}>
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
                                                amount: totalPrice.amount / 4,
                                                currencyCode: '€',
                                            })}
                                            categoryTitles={categories.map(({ title }) => title)}
                                        />
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                <div className="bg-white mt-32">
                    {/* Header */}
                    <div className="relative pb-32">
                        <div className="absolute inset-0">
                            <Image
                                alt="privatkoch-für-geburtstag-familienfeier-jga-romantisches-dinner"
                                src="/cities/dinner-table.jpg"
                                className="h-full w-full object-cover opacity-25"
                                width={2000}
                                height={500}
                            />
                            {/* <div aria-hidden="true" className="absolute inset-0 bg-gray-300 mix-blend-multiply" /> */}
                        </div>
                        <div className="relative mx-auto max-w-[88rem] px-6 py-24 sm:py-32 lg:px-8">
                            <h1 className={classNames('font-bold tracking-tight', 'text-4xl')}>Wie es funktioniert</h1>
                            <p className="mt-6 max-w-3xl text-xl">
                                Bringe die talentiertesten Köche und ihre Menüs aus ganz Deutschland ganz einfach und bequem zu dir
                                Nachhause.
                            </p>
                        </div>
                    </div>

                    {/* Overlapping cards */}
                    <section aria-labelledby="contact-heading" className="relative z-10 mx-auto -mt-32 max-w-[88rem] px-6 pb-32 lg:px-8">
                        <h2 id="contact-heading" className="sr-only">
                            Wie es funktioniert
                        </h2>
                        <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
                            {howItWorksSteps.map((link) => (
                                <div key={link.name} className="flex flex-col rounded-2xl bg-white shadow-xl">
                                    <div className="relative flex-1 px-6 pb-8 pt-16 md:px-8">
                                        <div className="absolute top-0 inline-block -translate-y-1/2 transform rounded-xl bg-orange-500 p-5 shadow-lg">
                                            <link.icon aria-hidden="true" className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-900">{link.name}</h3>
                                        <p className="mt-4 text-base text-gray-500">{link.description}</p>
                                    </div>
                                    {/* <div className="rounded-bl-2xl rounded-br-2xl bg-gray-50 p-6 md:px-8">
                                        <a href={link.href} className="text-base font-medium text-orange-600 hover:text-orange-500">
                                            Contact us<span aria-hidden="true"> &rarr;</span>
                                        </a>
                                    </div> */}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <h2 className="text-lg font-semibold leading-8 tracking-tight text-orange-500">Gastgeberstimmen</h2>
                            <p className="mt-2 font-bold tracking-tight text-gray-900 text-4xl">Das sagen unsere Gäste</p>
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

                {/* <section className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                        <h2 className="font-bold tracking-tight text-gray-900 text-4xl">Das sagen unsere Gäste</h2>
                        <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            <div className="flex flex-col pb-10 sm:pb-16 lg:pb-0 lg:pr-8 xl:pr-20">
                                <figure className="mt-10 flex flex-auto flex-col justify-between">
                                    <blockquote className="text-lg leading-8 text-gray-900">
                                        <p>
                                            “Unser Junggesellenabschied wurde dank people Eat zu einem unvergesslichen Erlebnis! Wir hatten
                                            das Glück, Laras als Köchin bei unserer Feier dabei zu haben, und sie hat uns mit ihrer
                                            Kochkunst wirklich verzaubert. Jede Speise, die sie zubereitete, war nicht nur geschmacklich auf
                                            den Punkt, sondern auch optisch ein Highlight. Lara hat mit ihrer Leidenschaft fürs Kochen und
                                            ihrer herzlichen Art für eine wunderbare Atmosphäre gesorgt, in der wir uns rundum wohlgefühlt
                                            haben. Die Organisation und der Service von PeopleEat waren ebenfalls erstklassig –
                                            professionell, freundlich und unkompliziert. Vielen Dank für diesen fantastischen Abend, den wir
                                            noch lange in Erinnerung behalten werden!”
                                        </p>
                                    </blockquote>
                                    <figcaption className="mt-10 flex items-center gap-x-6">
                                        <div className="text-base">
                                            <div className="font-semibold text-gray-900">Alice</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </div>
                            <div className="flex flex-col border-t border-gray-900/10 pt-10 sm:pt-16 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-20">
                                <figure className="mt-10 flex flex-auto flex-col justify-between">
                                    <blockquote className="text-lg leading-8 text-gray-900">
                                        <p>
                                            “Es hat alles von Anfang bis zum Schluss einwandfrei geklappt. Beim ersten Anruf wurden unsere
                                            Wünsche erfragt, so dass mehrere Menüvorschläge für uns sehr hilfreich und sehr
                                            abwechslungsreiche waren. Nach eine gewisse Zeit bekamen wir eine Köchin zugeteilt, die bei
                                            unserer Feier voll abgeliefert, toll gekocht, exzellent auf dem Teller präsentiert hat. Es war
                                            alles zu unserer Zufriedenheit.”
                                        </p>
                                    </blockquote>
                                    <figcaption className="mt-10 flex items-center gap-x-6">
                                        <div className="text-base">
                                            <div className="font-semibold text-gray-900">Lydia</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </div>
                        </div>
                    </div>
                </section> */}

                <section className="mx-auto max-w-[88rem] divide-y divide-gray-900/10 px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
                    <h2 className="text-4xl font-bold leading-10 tracking-tight text-gray-900">
                        FAQ – Alles, was du über die Buchung eines Privatkochs bei PeopleEat wissen musst
                    </h2>
                    <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                                <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">{faq.question}</dt>
                                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                                    <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* <div className="mx-auto max-w-[88rem] items-center justify-between gap-x-6 p-6 lg:px-8 mb-8" aria-label="Global">
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
                </div> */}

                <div className="py-24 sm:pb-32 sm:pt-8">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:max-w-none">
                            <h2 className="text-4xl font-semibold leading-8 text-gray-900">Wir werden unterstützt von</h2>
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
                                <Link href="https://www.deutsche-startups.de" target="_blank">
                                    <Image
                                        unoptimized
                                        className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
                                        src="/partners/deutsche-startups.png"
                                        alt="Deutsche Startups"
                                        width={158}
                                        height={48}
                                    />
                                </Link>
                                <Link href="https://www.foundersleague.de" target="_blank">
                                    <Image
                                        unoptimized
                                        className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
                                        src="/partners/founders-league.png"
                                        alt="Founders League"
                                        width={158}
                                        height={48}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mx-auto max-w-[88rem] sm:px-2 lg:px-8">
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Weitere Städte</h2>
                        </div>

                        <ul
                            role="list"
                            className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8 m-4 mt-8"
                        >
                            {cityHubs.map((cityHub) => (
                                <Link
                                    key={cityHub.pathName}
                                    href={'/cities/' + cityHub.pathName}
                                    className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                                >
                                    Privatkoch in {cityHub.city.name}
                                </Link>
                            ))}
                        </ul>
                    </div>
                </section>

                <PEFooter />
            </div>
        </>
    );
}
