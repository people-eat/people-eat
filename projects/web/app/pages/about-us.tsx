import { PEFooter, PEHeader } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';
import { GetPageDataDocument, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { createApolloClient } from '../network/apolloClients';
import Head from 'next/head';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const result = await apolloClient.query({ query: GetPageDataDocument });

        return {
            props: {
                signedInUser: result.data.users.signedInUser ?? null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function AboutUsPage({ signedInUser }: ServerSideProps) {
    return (
        <>
            <Head>
                <title>Über Uns - PeopleEat: Erstklassige Köche und Einzigartige Kulinarische Erlebnisse</title>
                <meta
                    name="description"
                    content="Erfahre mehr über PeopleEat, die Plattform für Privatköche für Zuhause. Entdecke unsere Mission, erstklassige kulinarische Erlebnisse zu schaffen, und lerne unser engagiertes Team kennen. Buche deinen persönlichen Koch und genieße unvergessliche Momente. Jetzt informieren!"
                />
                <meta
                    name="keywords"
                    content="PeopleEat Team, Über uns, Kochevent Zuhause, Privatkoch für Zuhause, Gourmet-Koch, Fine Dining, exklusive Menüs"
                />
            </Head>

            <div>
                <PEHeader signedInUser={signedInUser} />

                <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Willkommen bei PeopleEat</h2>
                    </div>
                </div>

                <div className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            <div className="lg:pr-4">
                                <Image
                                    src="/about-us/founders.png"
                                    width={1000}
                                    height={800}
                                    className="object-cover w-full rounded-3xl"
                                    alt=""
                                />
                            </div>
                            <div>
                                <div className="text-base leading-7 text-gray-700 lg:max-w-lg">
                                    <p className="text-base font-semibold leading-7 text-orange-600">Wie wir gestartet haben</p>
                                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                        Wir revolutionieren die Art Gastgeber zu sein
                                    </h1>
                                    <div className="max-w-xl">
                                        <p className="mt-6">
                                            Willkommen, Wir sind Natalia und Daniel, die Gründer von PeopleEat!
                                            <br />
                                            <br />
                                            Alles begann, als Natalia vor ihrem Auszug aus ihrer Wohnung in Mannheim stand und sich Daniel
                                            dazu entschloss, dieses besondere Ereignis mit einem Abendessen, zubereitet von einem Koch, zu
                                            feiern. Als Daniel sich auf die Suche nach einem Koch machte, wurde schnell klar, dass es gar
                                            nicht so einfach ist, einen Koch in der Umgebung zu finden. So wurde die Suche zu eine
                                            überraschenden Herausforderung. Nach stundenlanger Suche fand sich schließlich ein verfügbarer
                                            Koch in München, der bereit war, die 3.5 Stunden Fahrt nach Mannheim auf sich zu nehmen. Als der
                                            Koch ankam, wurden alle Erwartungen übertroffen. Natalia und Daniel konnten die Kulinarik neu
                                            für sich entdecken, genießen und einzigartige Einblicke in die Arbeit eines Kochs erhalten. An
                                            diesem Abend wurde nicht nur der Grundstein für PeopleEat gelegt, sondern auch die klare Vision,
                                            Menschen den Zugang zu erstklassigen Köchen zu ermöglichen und unvergessliche Momente mit ihren
                                            Lieben zu schaffen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-20 mt-8">
                    <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
                        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Unsere Mission</h2>
                        <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-gray-300">
                            Unsere Mission bei PeopleEat ist es, die Art des Gastgebens auf ein neues Level zu heben, indem wir Menschen den
                            Zugang zu erstklassigen Köchen ermöglichen und unvergessliche kulinarische Erlebnisse schaffen. Wir haben uns
                            zum Ziel gesetzt, die Freude am Essen und die Bedeutung von besonderen Anlässen im Leben zu feiern, indem wir
                            einzigartige kulinarische Momente kreieren, die Menschen näher zusammenbringen und lebenslange Erinnerungen
                            schaffen. Gleichzeitig möchten wir Köchen die Möglichkeit geben, ihre Leidenschaft und Kreativität zu leben. Mit
                            unserer Plattform wollen wir Innovation, Köche und Gastfreundschaft vereinen und die Art und Weise, wie Menschen
                            Essen genießen und Ereignisse teilen, neu definieren.
                        </p>
                        <svg
                            viewBox="0 0 1024 1024"
                            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                            aria-hidden="true"
                        >
                            <circle cx={512} cy={512} r={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
                            <defs>
                                <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                                    <stop stopColor="#fb923c" />
                                    <stop offset={1} stopColor="#fb923c" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                <div className="bg-white">
                    <div className="relative isolate">
                        <div
                            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                            aria-hidden="true"
                        >
                            <div
                                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#fb923c] to-[#fb923c] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                                style={{
                                    clipPath:
                                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                }}
                            />
                        </div>
                        <div className="py-24 sm:py-32 lg:pb-40">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <div className="mx-auto max-w-2xl text-center">
                                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Lerne unser Team kennen</h1>
                                    <p className="mt-6 text-lg leading-8 text-gray-600">
                                        Unser Team zeichnet sich durch vielfältige Persönlichkeiten und umfangreiche Erfahrungen aus. Uns
                                        verbindet das gemeinsame Ziel, die Art und Weise zu revolutionieren, wie Menschen Essen genießen und
                                        Ereignisse teilen. Tag für Tag arbeiten wir entschlossen daran, dieses Anliegen Realität werden zu
                                        lassen.
                                    </p>
                                </div>
                                <div className="mt-16 flow-root sm:mt-24">
                                    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                        <Image
                                            src="/about-us/team.jpg"
                                            alt="App screenshot"
                                            width={2432}
                                            height={1442}
                                            className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                        />
                                    </div>
                                </div>
                                <div className="mx-auto max-w-6xl text-center">
                                    <p className="mt-20 text-lg leading-8 text-gray-600">
                                        Daniel und Natalia, Co-Founder von PeopleEat, bringen Erfahrungen im Bereich, Sales und Financial
                                        Controlling ein (SAP SE, Raiffeisenbank). Cem (rechts) ist erfahrener Full-Stack Developer mit
                                        Expertise in App- und Webentwicklung (SAP SE) Dirk (links) und Chris (rechts) sind unsere
                                        Branchenexperten: Dirk bringt jahrelange Erfahrung als Küchenchef in der gehobenen Gastronomie und
                                        Privatkoch mit. Chris bringt als Küchenmeister umfangreiche gastronomische Expertise mit. Des
                                        weiteren ist er seit mehreren Jahren als Miet- und Privatkoch (Food-Fighter) tätig.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                            aria-hidden="true"
                        >
                            <div
                                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#fb923c] to-[#fb923c] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                                style={{
                                    clipPath:
                                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-20 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-10">
                        Möchtest du Teil unseres Teams werden?
                        <br />
                        Wir freuen uns auf deine Nachricht.
                    </h2>
                    <PELink href="mailto:contact@people-eat.com" title="Nachricht senden" />
                </div>

                <PEFooter />
            </div>
        </>
    );
}
