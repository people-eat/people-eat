import { PEFooter, PEHeader } from '@people-eat/web-components';
import { CheckCircleIcon } from 'lucide-react';
import Image from 'next/image';

export default function WarumSollteIchEinenPrivatkochBuchenBlogArticle() {
    return (
        <div>
            <PEHeader signedInUser={null} />

            <div className="bg-white px-6 py-32 lg:px-8">
                <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                    {/* <p className="text-base font-semibold leading-7 text-indigo-600">Introducing</p> */}
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Warum sollte ich einen Privatkoch buchen?
                    </h1>
                    <p className="mt-6 text-xl leading-8">
                        Dass Essen ist weit mehr als nur eine Notwendigkeit. Es ist ein Erlebnis, das unsere Sinne anspricht, uns verbindet
                        und Erinnerungen schafft. Ein Privatkoch ist der Schlüssel zu diesem besonderen kulinarischen Erlebnis, das weit
                        über den gewöhnlichen Restaurantbesuch hinausgeht. In diesem Blogbeitrag erfährst du, warum du einen Privatkoch
                        buchen solltest, um einzigartige Genussmomente in deinen eigenen vier Wänden zu erleben.
                    </p>
                    <figure className="mt-16">
                        <Image
                            className="aspect-video rounded-xl bg-gray-50 object-cover"
                            src="/blogs/privatkoch-köln.jpeg"
                            alt=""
                            width={800}
                            height={600}
                        />
                    </figure>
                    <div className="mt-10 max-w-2xl">
                        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Personalisierte Menüs</strong> Ein Privatkoch erstellt
                                    ein maßgeschneidertes Menü, das deinen persönlichen Vorlieben und Ernährungsbedürfnissen entspricht. Du
                                    hast die Freiheit, Gerichte auszuwählen oder anzupassen, die du liebst. Dies führt zu einem
                                    einzigartigen Geschmackserlebnis, das deinen individuellen Präferenzen entspricht.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Private Atmosphäre</strong> Ein privates Essen zu Hause
                                    bietet eine intime und gemütliche Atmosphäre. Du kannst dich als Gastgeber voll und ganz auf deine Gäste
                                    konzentrieren und einzigartige Momente gemeinsam mit Ihnen teilen.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Zeitersparnis</strong> Die Vor- und Zubereitung von
                                    Gerichten erfordert viel Zeit und Geschick. Ein Privatkoch nimmt dir die gesamte Vorbereitungsarbeit ab,
                                    sodass du mehr Zeit für dich selbst und deine Gäste hast. Lehn dich zurück und lass es dir schmecken.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Exklusiver Service</strong> Dein Privatkoch ist für dich
                                    und deine Gäste da und bietet ein einzigartiges Erlebnis. Du musst dir um Bestellungen, Wartezeiten oder
                                    den Service am Tisch keine Gedanken machen. Alles erfolgt nach deinen Wünschen und Bedürfnissen.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Lerne von Profis</strong> Wenn du kulinarisch
                                    interessiert bist, bietet dir das Buchen eines Privatkochs die Möglichkeit, von Profis zu lernen. Du
                                    kannst zuschauen, Fragen stellen und sogar an der Zubereitung teilnehmen, um neue Fähigkeiten und
                                    Kochtechniken kennenzulernen.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Besondere Anlässe feiern</strong> Ein Privatkoch kann
                                    deine besonderen Anlässe zu unvergesslichen Momenten machen. Ob es sich um Jubiläen, Geburtstage, ein
                                    Abend mit Freunden oder andere wichtige Ereignisse handelt, ein Privatkoch schafft ein einzigartiges
                                    kulinarisches Erlebnis, das in Erinnerung bleibt.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Gesundheitsbewusste Ernährung</strong> Wenn du auf eine
                                    spezielle Diät oder gesunde Ernährung angewiesen bist, kann ein Privatkoch Mahlzeiten zubereiten, die
                                    deine Bedürfnisse erfüllen. Du kannst dir sicher sein, dass die Gerichte frisch, gesund und hochwertig
                                    zubereitet werden.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Vielfalt genießen</strong> Ein Privatkoch kann Gerichte
                                    aus verschiedenen Küchen und Kulturen zaubern. Du kannst exotische Aromen und Geschmacksrichtungen in
                                    deinem Zuhause entdecken, ohne es verlassen zu müssen.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Exquisite Zutaten</strong> Privatköche haben oft Zugang
                                    zu hochwertigen Zutaten und Produkten, die in Restaurants möglicherweise nicht verfügbar sind. Dies
                                    garantiert, dass die zubereiteten Menüs von höchster Qualität sind.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Stressfreies Genießen</strong> Schluss mit der Hektik in
                                    der Küche und dem Stress, ein perfektes Essen zu zaubern. Mit einem Privatkoch kannst du dich einfach
                                    zurücklehnen und die köstlichen Kreationen genießen, ohne sich um die Details zu kümmern.
                                </span>
                            </li>
                        </ul>
                    </div>
                    <p className="mt-6 text-xl leading-8">
                        Ein Privatkoch zu buchen, ist nicht nur ein kulinarisches Erlebnis, sondern auch eine Investition in deine
                        Lebensqualität. Ob für besondere Anlässe oder einfach, um sich und seine Lieben selbst zu verwöhnen, ein Privatkoch
                        bringt einzigartige Erlebnisse und Freude in deine eigenen vier Wände. Gönne dir und deinen Gästen das Vergnügen
                        eines exklusiven Essens, das deine Erwartungen übertrifft.
                    </p>
                    <p className="mt-6 text-xl leading-8">
                        Wenn du ein unvergessliches kulinarisches Erlebnis wünschst, ist es an der Zeit, einen Privatkoch zu buchen. Es
                        warten talentierte Köche, dich und deine Gäste zu verwöhnen und dich zum perfekten Gastgeber werden zu. lassen.
                    </p>
                </div>
            </div>

            <PEFooter />
        </div>
    );
}
