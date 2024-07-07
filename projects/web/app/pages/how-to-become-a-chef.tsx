import { Disclosure } from '@headlessui/react';
import { PEFooter, PEHeader } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';
import { GetPageDataDocument, SignedInUser } from '@people-eat/web-domain';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { AnalyticsClarity } from '../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../components/analytics/CookieSettings';
import { createApolloClient } from '../network/apolloClients';

const faqs = [
    {
        question: 'Wer kann sich als Koch registrieren?',
        answer: 'Um als Koch zu starten, sind eine Ausbildung sowie erste Berufserfahrungen als Koch erforderlich. Falls du keine Ausbildung, jedoch erste Berufserfahrungen sammeln konntest, freuen wir uns auf deine Registrierung. In einem weiteren Gespräch finden wir gemeinsam raus, ob PeopleEat das richtige für dich ist.',
    },

    {
        question: 'Muss ich bezahlen, um PeopleEat zu benutzen?',
        answer: 'PeopleEat ist komplett kostenfrei. Registriere dich, erstelle ein Profil und biete deine Services an. Wir erheben erst eine Service Fee (18%) mit Abschluss einer Buchungsanfrage.',
    },

    {
        question: 'Wie erhalte ich Buchungen auf PeopleEat?',
        answer: `Buchungen über PeopleEat erhältst du in nur wenigen Schritten:

1. Erstelle ein Kochprofil: Lege ein Profil an, lade ein Profilbild hoch und erstelle eine Kurzbeschreibung zu dir.
2. Verifiziere dein Account:Verifiziere dich und lege dein Auszahlungskonto fest.
3. Erstelle mindestens ein Menü: Erstelle erste Gerichte und kreiere dein erstes Menü zu deinen Preisen.
`,
    },

    {
        question: 'Benötige ich ein Gesundheitszeugnis?',
        answer: 'Ja. Du benötigst ein Gesundheitszeugnis, da du in Kontakt mit Lebensmittel kommst. Falls du Hilfe oder weitere Informationen benötigst, helfen wir dir gerne weiter.',
    },

    {
        question: 'Benötige ich ein Gewerbe um zu beginnen?',
        answer: 'Grundsätzlich empfehlen wir dir zumindest ein Kleingewerbe zu gründen, das kann aber je nach persönlicher Situation variieren. Falls du dir unsicher bist, empfehlen wir dir rechtlichen Rat bei einem Steuerberater einzuholen.',
    },

    {
        question: 'Wie erstelle ich ein Menü?',
        answer: `Ein Menü zu erstellen ist kinderleicht:

1. Gerichte erstellen: Erstelle in wenigen Sekunden ein Gericht, füge ein passendes Bild hinzu und eine kurze Beschreibung.
2. Menü erstellen: Nachdem du deine Gerichte erstellt hast, kannst du direkt ein Menü erstellen. Erstelle verschiedene Gänge, füge beliebig viele Gerichte je Gang hinzu und setze deinen finalen Preis fest.

3. Menü fertigstellen: Veröffentliche das Menü auf deinem Profil. Gastgeber können direkt über dein Profil ihre Lieblingskreationen für ihren Anlass buchen.`,
    },

    {
        question: 'Wann erhalte ich die Auszahlung?',
        answer: 'Wir sorgen für eine bequeme Zahlungsabwicklung. Deine Auszahlung wird ein Tag nach Erfüllungstag angestoßen und in der Regel innerhalb von 3-4 Werktagen auf dein Konto verbucht.  Du hast jederzeit die Möglichkeit deine aktuellen Zahlung über dein Dashboard einzusehen',
    },

    {
        question: 'Ich erhalte eine Buchungsanfrage, was nun?',
        answer: 'Sobald du eine Buchungsanfrage erhältst, hast du 48 Stunden Zeit diese anzunehmen oder abzulehnen. Solltest du innerhalb dieses Zeitrahmens nicht reagieren, verfällt die Anfrage und wird ggf. an einen anderen Koch weitergeleitet. Falls du Fragen zur Buchung hast kannst dich jederzeit bei uns melden.',
    },
];

const timeline = [
    {
        name: 'Registrierung',
        description: 'Gebe deine Daten im Registrierungsformular ein und fange direkt an dein Profil zu vervollständigen',
        date: 'Schritt 1',
        dateTime: '',
    },
    {
        name: 'Wir melden uns bei dir',
        description: 'Wir nehmen Kontakt mit dir auf, um alle Details zu besprechen damit du starten kannst',
        date: 'Schritt 2',
        dateTime: '',
    },
    {
        name: 'Freischaltung',
        description: 'Sobald du dein Profil und ein erstes Menü fertiggestellt hast, wird dein Profil freigeschalten',
        date: 'Schritt 3',
        dateTime: '',
    },
    {
        name: 'Startklar',
        description: 'Erhalte Buchungsanfragen, gleichzeitig unterstützen wir dich jederzeit bei jeglichen Anliegen und Kundenanfragen',
        date: 'Startklar',
        dateTime: '',
    },
];

const features = [
    { name: 'Bleibe Flexibel', description: 'Entscheide selbst den Ort und Radius in dem du deinen Service anbieten möchtest' },
    { name: 'Freiraum für deine Kreativität', description: 'Verwirkliche eigene Menükreationen behalte Sie jederzeit an einem Ort' },
    { name: 'Schnelle Zahlungsabwicklung', description: 'Erhalte deine Bezahlung einfach und unkompliziert' },
    { name: '24 / 7 für dich da', description: 'Wir helfen dir rund um die Uhr bei jeglichen Fragen weiter' },
    {
        name: 'Gastgeber stellen ihre Anfragen direkt bei dir',
        description: 'Kunden gelangen direkt über die Profilseite zu deinen Menüvorschlägen',
    },
    {
        name: 'Kommuniziere unkompliziert mit deinen Kunden',
        description:
            'Sobald du die Buchungsanfrage akzeptierst, kannst du direkt mit dem Gastgeber via Chat alle Einzelheiten final abstimmen',
    },
];

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetPageDataDocument });

        return {
            props: {
                signedInUser: data.users.signedInUser ?? null,
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

export default function HowToBecomeAChefPage({ signedInUser, cookieSettings }: ServerSideProps) {
    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <Head>
                <title>Koch werden | Mit Kochen Geld verdienen | PeopleEat</title>
                <meta
                    name="description"
                    content="Werde Mietkoch, genieße die Freiheit und Flexibilität wann du deine Privatkoch Dienstleistungen anbieten möchtest. Teile deine Leidenschaft mit deinen Gästen und schaffe einzigartige Erlebnismomente."
                />
                <meta name="keywords" content="PeopleEat, Privatkoch werden, Eventkoch, Koch werden, eigenes Restaurant eröffnen" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="alternate" href="https://people-eat.com/how-to-chef/" hrefLang="x-default" />
                <link rel="alternate" href="https://people-eat.com/how-to-chef/" hrefLang="de" />
            </Head>

            <div>
                <PEHeader signedInUser={signedInUser} />

                <div>
                    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
                        <div
                            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
                            aria-hidden="true"
                        />
                        <div className="mx-auto max-w-[88rem] px-6 py-32 sm:py-40 lg:px-8">
                            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
                                <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
                                    Koche deine Menüs. <br />
                                    In ihrer Küche. <br />
                                    Zu deinen Konditionen.
                                </h1>
                                <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                                    <p className="text-lg leading-8 text-gray-600">
                                        Hier lebst du die volle Freiheit und deine Leidenschaft. Du entscheidest nicht nur über den
                                        Geschmack, sondern auch die Preisgestaltung für deine Menükreationen und schaffe dabei
                                        unvergessliche Genussmomente
                                    </p>
                                    <div className="mt-10 flex items-center gap-x-6">
                                        {!signedInUser?.isCook && <PELink title="Jetzt Registrieren" href="/chef-sign-up" />}
                                        {signedInUser?.isCook && <PELink title="Zu deinem Kochprofil" href="/chef-profile" />}
                                    </div>
                                </div>
                                <Image
                                    src="/how-to-become-a-chef/chef.jpg"
                                    alt=""
                                    className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
                                    width={500}
                                    height={400}
                                />
                            </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
                    </div>
                </div>

                <div className="pb-24">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                Beginne in nur wenigen Schritten
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Egal ob Mietkoch, Privatkoch oder angestellter Koch - Wir unterstützen dich im Onboarding, damit du
                                erfolgreich starten kannst.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pb-24">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
                            {timeline.map((item) => (
                                <div key={item.name}>
                                    <time
                                        dateTime={item.dateTime}
                                        className="flex items-center text-sm font-semibold leading-6 text-orange-500"
                                    >
                                        <svg viewBox="0 0 4 4" className="mr-4 h-1 w-1 flex-none" aria-hidden="true">
                                            <circle cx={2} cy={2} r={2} fill="currentColor" />
                                        </svg>
                                        {item.date}
                                        <div
                                            className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                                            aria-hidden="true"
                                        />
                                    </time>
                                    <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{item.name}</p>
                                    <p className="mt-1 text-base leading-7 text-gray-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pb-24">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 sm:px-6 lg:max-w-[88rem] lg:grid-cols-2 lg:px-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">Was du von uns erwarten kannst</h2>
                            <p className="mt-8 text-gray-500">
                                Wir legen sehr viel Wert darauf, dass du dich auf das fokussierst, was dir Spaß macht. Mit PeopleEat genießt
                                du unzählige Vorteile. Hier findest du ein Paar davon:
                            </p>

                            <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                                {features.map((feature) => (
                                    <div key={feature.name} className="border-t border-gray-200 pt-4">
                                        <dt className="font-medium text-gray-900">{feature.name}</dt>
                                        <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div>
                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                                <Image
                                    src="/how-to-become-a-chef/1.jpg"
                                    alt="Black kettle with long pour spot and angled body on marble counter next to coffee mug and pour-over system."
                                    className="h-full w-full object-cover object-center"
                                    width={800}
                                    height={800}
                                />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-6 lg:mt-8 lg:gap-8">
                                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                                    <Image
                                        src="/how-to-become-a-chef/2.jpg"
                                        alt="Detail of temperature setting button on kettle bass with digital degree readout."
                                        className="h-full w-full object-cover object-center"
                                        width={600}
                                        height={600}
                                    />
                                </div>
                                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                                    <Image
                                        src="/how-to-become-a-chef/3.jpg"
                                        alt="Kettle spout pouring boiling water into coffee grounds in pour-over mug."
                                        className="h-full w-full object-cover object-center"
                                        width={600}
                                        height={600}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pb-24">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Bist du bereit zu starten?
                            <br />
                            Werde Teil des am schnellsten wachsenden Kochnetzwerks.
                        </h2>
                        <div className="mt-10 flex items-center gap-x-6">
                            {!signedInUser?.isCook && <PELink title="Jetzt Registrieren" href="/chef-sign-up" />}
                            {signedInUser?.isCook && <PELink title="Zu deinem Kochprofil" href="/chef-profile" />}
                        </div>
                    </div>
                </div>

                <section className="pb-24">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            <div className="flex flex-col pb-10 sm:pb-16 lg:pb-0 lg:pr-8 xl:pr-20">
                                <figure className="mt-10 flex flex-auto flex-col justify-between">
                                    <blockquote className="text-lg leading-8 text-gray-900">
                                        <p>
                                            Sollte es mal Probleme mit einem Kunden geben, werden schnelle Lösungen durch den Support
                                            gefunden, sodass beide Seiten happy sind. Das Team legt sehr viel Wert auf eine erfolgreiche
                                            Zusammenarbeit. Klasse Idee, macht weiter so.
                                        </p>
                                    </blockquote>
                                    <figcaption className="mt-10 flex items-center gap-x-6">
                                        <span className="inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100">
                                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </span>
                                        <div className="text-base">
                                            <div className="font-semibold text-gray-900">René W.</div>
                                            <div className="mt-1 text-gray-500">Professioneller Koch</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </div>
                            <div className="flex flex-col border-t border-gray-900/10 pt-10 sm:pt-16 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-20">
                                <figure className="mt-10 flex flex-auto flex-col justify-between">
                                    <blockquote className="text-lg leading-8 text-gray-900">
                                        <p>
                                            Ohne die simple Lösung, Kochdienstleistungen online zu managen, hätte ich meinen Weg zum
                                            Privatkoch nie so einfach gemeistert. Ich habe bereits sehr enge Kundenbindungen aufbauen können
                                            und freue mich stetig diese zu erweitern. Falls du mit dem Gedanken spielst dein Talent mit mehr
                                            Menschen zu teilen mach es mit PeopleEat.
                                        </p>
                                    </blockquote>
                                    <figcaption className="mt-10 flex items-center gap-x-6">
                                        <span className="inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100">
                                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </span>
                                        <div className="text-base">
                                            <div className="font-semibold text-gray-900">Chris K.</div>
                                            <div className="mt-1 text-gray-500">Privatkoch</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pb-24">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                        <div className="mx-auto max-w-[88rem] divide-y divide-gray-900/10">
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

                <PEFooter />
            </div>
        </>
    );
}
