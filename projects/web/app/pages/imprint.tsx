import { GetPageDataDocument, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { createApolloClient } from '../network/apolloClients';
import { PEFooter, PEHeader } from '@people-eat/web-components';
import Head from 'next/head';

interface ServerSideProps {
    signedInUser: SignedInUser | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
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

export default function ImprintPage({ signedInUser }: ServerSideProps) {
    return (
        <>
            <Head>
                <title>PeopleEat Impressum</title>
                <meta name="description" content="Impressum – PeopleEat: Dein Privatkoch für Zuhause" />
                <meta
                    name="keywords"
                    content="Impressum, PeopleEat, Privatkoch für Zuhause, rechtliche Informationen, Kontakt, Firmeninformationen"
                />
            </Head>
            <div>
                <PEHeader signedInUser={signedInUser} />

                <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-16">Impressum</h1>
                </div>

                <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                    <p>
                        Unser Impressum gilt für die Seiten www.people-eat.com sowie für die People-Eat-Seiten auf Facebook, Instagram,
                        Google+, LinkedIn, Google my Business und Twitter. Angaben gemäß § 5 TMG: PeopleEat UG. Montgolfier-Allee 24, 60486
                        Frankfurt am Main.
                    </p>

                    <br />

                    <p>
                        E-Mail: contact@people-eat.com Tel: +49 (0) 15144249750 Plattform der EU-Kommission zur Online-Streitbeilegung:
                        https://www.ec.europa.eu/consumers/odr Haftungsausschluss – Disclaimer:
                    </p>

                    <br />

                    <p>
                        Haftung für Inhalte Alle Inhalte unseres Internetauftritts wurden mit größter Sorgfalt und nach bestem Gewissen
                        erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                        verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                        gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                        Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
                        Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
                        Kenntniserlangung einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von den o.g. Rechtsverletzungen werden
                        wir diese Inhalte unverzüglich entfernen. Haftungsbeschränkung für externe Links.
                    </p>

                    <br />

                    <p>
                        Unsere Webseite enthält Links auf externe Webseiten Dritter. Auf die Inhalte dieser direkt oder indirekt verlinkten
                        Webseiten haben wir keinen Einfluss. Daher können wir für die „externen Links“ auch keine Gewähr auf Richtigkeit der
                        Inhalte übernehmen. Für die Inhalte der externen Links sind die jeweilige Anbieter oder Betreiber (Urheber) der
                        Seiten verantwortlich. Die externen Links wurden zum Zeitpunkt der Linksetzung auf eventuelle Rechtsverstöße
                        überprüft und waren im Zeitpunkt der Linksetzung frei von rechtswidrigen Inhalten. Eine ständige inhaltliche
                        Überprüfung der externen Links ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht möglich. Bei direkten
                        oder indirekten Verlinkungen auf die Webseiten Dritter, die außerhalb unseres Verantwortungsbereichs liegen, würde
                        eine Haftungsverpflichtung ausschließlich in dem Fall nur bestehen, wenn wir von den Inhalten Kenntnis erlangen und
                        es uns technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger Inhalte zu verhindern. Diese
                        Haftungsausschlusserklärung gilt auch innerhalb des eigenen Internetauftrittes „Name Ihrer Domain“ gesetzten Links
                        und Verweise von Fragestellern, Blogeinträgern, Gästen des Diskussionsforums. Für illegale, fehlerhafte oder
                        unvollständige Inhalte und insbesondere für Schäden, die aus der Nutzung oder Nichtnutzung solcherart dargestellten
                        Informationen entstehen, haftet allein der Diensteanbieter der Seite, auf welche verwiesen wurde, nicht derjenige,
                        der über Links auf die jeweilige Veröffentlichung lediglich verweist. Werden uns Rechtsverletzungen bekannt, werden
                        die externen Links durch uns unverzüglich entfernt.
                    </p>

                    <br />

                    <p>
                        Urheberrecht Die auf unserer Webseite veröffentlichen Inhalte und Werke unterliegen dem deutschen Urheberrecht
                        (http://www.gesetze-im-internet.de/bundesrecht/urhg/gesamt.pdf) . Die Vervielfältigung, Bearbeitung, Verbreitung und
                        jede Art der Verwertung des geistigen Eigentums in ideeller und materieller Sicht des Urhebers außerhalb der Grenzen
                        des Urheberrechtes bedürfen der vorherigen schriftlichen Zustimmung des jeweiligen Urhebers i.S.d. Urhebergesetzes
                        (http://www.gesetze-im-internet.de/bundesrecht/urhg/gesamt.pdf ). Downloads und Kopien dieser Seite sind nur für den
                        privaten und nicht kommerziellen Gebrauch erlaubt. Sind die Inhalte auf unserer Webseite nicht von uns erstellt
                        wurden, sind die Urheberrechte Dritter zu beachten. Die Inhalte Dritter werden als solche kenntlich gemacht. Sollten
                        Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei
                        Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte unverzüglich entfernen.
                    </p>
                </div>

                <PEFooter />
            </div>
        </>
    );
}
