import { PEHeader } from '@people-eat/web-components';
import { GetPageDataDocument, SignedInUser } from '@people-eat/web-domain';
import { CheckCircleIcon } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { AnalyticsClarity } from '../../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../../components/analytics/CookieSettings';
import { createApolloClient } from '../../network/apolloClients';

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
                signedInUser: data.sessions.current.user ?? null,
                cookieSettings: data.sessions.current.cookieSettings
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

export default function Example({ signedInUser, cookieSettings }: ServerSideProps) {
    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <Head>
                <title>Wie man ein unvergessliches Dinner-Party-Erlebnis mit einem Privatkoch schafft</title>
                <meta
                    name="description"
                    content="Plane deine perfekte Küchen-Party mit einem Privatkoch für Zuhause. Entdecke Tipps und Ideen für unvergessliche Dinner-Partys, von Gourmet-Menüs bis hin zu kulinarischen Erlebnissen. Erfahre mehr im PeopleEat Blog!"
                />
                <meta
                    name="keywords"
                    content="Privatkoch für Zuhause, Küchen-Party, Dinner-Party Ideen, Gourmet-Menü, kulinarische Erlebnisse, PeopleEat Blog, exklusive Dinner-Partys, Koch buchen"
                />
            </Head>

            <PEHeader signedInUser={signedInUser} />

            <div className="bg-white px-6 py-32 lg:px-8">
                <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Wie man ein unvergessliches Dinner-Party-Erlebnis mit einem Privatkoch schafft
                    </h1>
                    <figure className="mt-16">
                        <Image
                            width={1000}
                            height={800}
                            className="aspect-video rounded-xl bg-gray-50 object-cover"
                            src="/blogs/kuechen-party.jpeg"
                            alt=""
                        />
                    </figure>
                    <p className="mt-6 text-xl leading-8">
                        Ein unvergessliches Dinner-Party-Erlebnis zu schaffen, das deine Gäste beeindruckt und begeistert, erfordert mehr
                        als nur gutes Essen. Mit einem Privatkoch sorgst du dafür, dass dein besonderer Anlass perfekt wird. Von der
                        Zubereitung der Gerichte, bis hin zum Verlassen einer sauberen Küche sorgt der Koch dafür, dass du und deine Gäste
                        einen unvergesslichen Abend habt.
                    </p>
                    <div className="mt-10 max-w-2xl">
                        <p>Hier sind einige Schritte, die sicherstellen, dass deine Dinner-Party zum Gesprächsthema wird:</p>
                        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Eine Auswahl an verschiedenen Köchen:</strong> Der erste
                                    Schritt, um ein unvergessliches Dinner-Party-Erlebnis zu schaffen, ist die Auswahl des richtigen Kochs.
                                    Es ist wichtig, das dich die Profilbeschreibung und der erste Eindruck des Kochs von seinen Fähigkeiten
                                    beeindrucken. PeopleEat bietet hierfür die besten Köche in deiner Umgebung an, damit du dir sicher sein
                                    kannst, dass der Koch einen bleibenden EIndruck hinterlässt. Es ist wichtig von Anfang an in der Buchung
                                    wichtig die Ernährungsbeschränkungen richtig anzugeben, um ein maßgeschneidertes Menü zu erstellen, das
                                    deine Gäste begeistern wird.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Kreative Menügestaltung:</strong> Ein Privatkoch bringt
                                    nicht nur kulinarisches Können, sondern auch Kreativität mit. Lass dich von seinen Menükreationen
                                    inspirieren und beeindrucken.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Exquisite Zutaten:</strong> Ein wichtiger Vorteil eines
                                    Privatkochs ist der Zugang zu hochwertigen und frischen Zutaten. Nutze diese Möglichkeit, um deine Gäste
                                    ein erstklassiges kulinarisches Erlebnis zu bieten. Von lokalen Delikatessen bis hin zu internationalen
                                    Spezialitäten - dein Privatkoch wird dafür sorgen, dass jede Zutat perfekt ausgewählt ist.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Professionelle Zubereitung:</strong> Während deiner
                                    Dinner-Party kannst du dich zurücklehnen und den Abend mit deinen Gästen entspannen, denn dein
                                    Privatkoch wird sich um alles kümmern. Von der Vorbereitung deiner Küche bis hin zur Präsentation der
                                    Gerichte mit Stil und Eleganz - ein Profi am Herd sorgt für einen reibungslosen Ablauf und eine
                                    beeindruckende Präsentation.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Aufmerksamer Service:</strong> Ein Privatkoch ist nicht
                                    nur für das Kochen verantwortlich, sondern auch für einen erstklassigen Service während deiner
                                    Dinner-Party. Von der Begrüßung der Gäste bis zur Verabschiedung am Ende des Abends - ein aufmerksamer
                                    und freundlicher Service trägt wesentlich zum Gesamterlebnis bei.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Einbindung der Gäste:</strong> Ermutige deinen Privaten
                                    Koch, mit den Gästen zu interagieren und ihnen Einblicke in die kulinarische Welt zu geben. Von der
                                    Erklärung der einzelnen Gänge bis hin zur Beantwortung von Fragen - eine persönliche Note macht das
                                    Erlebnis noch unvergesslicher.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Nachbesprechung und Feedback:</strong> Nach der
                                    Dinner-Party ist es wichtig, mit dem Koch über das Erlebnis zu sprechen und Feedback zu geben. Bei
                                    PeopleEat haben Gastgeber die Möglichkeit den Koch direkt nach dem Event zu bewerten. Eine offene
                                    Kommunikation hilft dabei, zukünftige Veranstaltungen noch besser zu gestalten.
                                </span>
                            </li>
                        </ul>
                        <p className="mt-8">
                            Mit einem Privatkoch an deiner Seite kannst du sicher sein, dass deine Dinner-Party ein unvergessliches Erlebnis
                            wird, das noch lange in Erinnerung bleiben wird.
                        </p>
                        <p className="mt-8">
                            Über diesen Link kannst du nach einem Privatkoch in deiner Umgebung suchen und direkt buchen. Falls du keinen
                            Koch in deiner Umgebung gefunden hast, kannst du auch eine individuelle Anfrage senden.
                        </p>
                        <p className="mt-8">Hoffentlich sehen wir uns auf deiner nächsten Party!</p>
                    </div>
                </div>
            </div>
        </>
    );
}
