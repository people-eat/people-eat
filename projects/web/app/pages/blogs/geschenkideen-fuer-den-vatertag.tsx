import { PEHeader } from '@people-eat/web-components';
import { CheckCircleIcon } from 'lucide-react';
import Image from 'next/image';

export default function Example() {
    return (
        <div>
            <PEHeader signedInUser={null} />
            <div className="bg-white px-6 py-32 lg:px-8">
                <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Top 10 einzigartige Geschenkideen für den Vatertag: Mache diesen Tag unvergesslich
                    </h1>
                    <figure className="mt-16">
                        <Image
                            width={1000}
                            height={800}
                            className="aspect-video rounded-xl bg-gray-50 object-cover"
                            src="/blogs/vatertag.jpeg"
                            alt=""
                        />
                    </figure>
                    <p className="mt-6 text-xl leading-8">
                        Der Vatertag steht vor der Tür, und du möchtest deinem Vater zeigen, wie sehr du ihn schätzt. Aber was könnte das
                        perfekte Geschenk sein? Statt etwas Gewöhnlichem zu wählen, warum überraschst du ihn nicht mit einem unvergesslichen
                        Erlebnis?
                    </p>
                    <div className="mt-10 max-w-2xl">
                        <p>
                            Hier sind 10 einzigartige Geschenkideen zum Vatertag, begeistern- inklusive der Möglichkeit, einen Privatkoch zu
                            buchen, um das Geschenk zu einem unvergesslichen Erlebnis zu machen.
                        </p>
                        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Privates Grillevent im eigenen Garten:</strong>{' '}
                                    Überrasche deinen Vater mit einem exklusiven Grillabend im eigenen Garten. Ein erfahrener Privatkoch
                                    kann die perfekten Grillgerichte zaubern, während dein Vater sich entspannt und den Abend genießt.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Gourmet-Dinner zu Hause:</strong> Schenke deinem Vater
                                    ein Gourmet-Dinner in den eigenen vier Wänden. Lass einen Privatkoch ein maßgeschneidertes Menü kreieren
                                    und das Abendessen zu einem unvergesslichen kulinarischen Erlebnis machen.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Kochkurs mit einem Privatkoch:</strong> Wenn dein Vater
                                    gerne kocht, wäre ein privater Kochkurs das ideale Geschenk. Er kann neue Techniken erlernen und
                                    köstliche Gerichte unter Anleitung eines Profis zubereiten.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Wein- und Speisenverkostung zu Hause:</strong>{' '}
                                    Organisiere eine private Wein- und Speisenverkostung für deinen Vater und seine Freunde. Ein erfahrener
                                    Sommelier und Privatkoch können eine Auswahl exquisiter Weine und passender Speisen präsentieren.
                                    Leckereweine.org bietet hierfür einzigartige Weinsets zum verschenken an.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Entspanntes Brunch-Erlebnis:</strong> Überrasche deinen
                                    Vater mit einem entspannten Brunch zu Hause. Ein Privatkoch kann eine Vielzahl von Frühstücksklassikern
                                    zubereiten, während dein Vater sich zurücklehnt und den Tag genießt.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Romantisches Candle-Light-Dinner:</strong> Wenn dein
                                    Vater eine besondere Person in seinem Leben hat, überrasche ihn mit einem romantischen
                                    Candle-Light-Dinner zu Hause. Ein Privatkoch kann ein intimes und unvergessliches Abendessen für zwei
                                    zaubern.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Themenbasiertes Dinner-Erlebnis:</strong> Organisiere
                                    ein themenbasiertes Dinner-Erlebnis für deinen Vater und seine Freunde. Von einem italienischen Abend
                                    bis zu einem exotischen asiatischen Abendessen - ein Privatkoch kann die perfekte Atmosphäre schaffen.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Kulinarisches Picknick im Freien:</strong> Plane ein
                                    kulinarisches Picknick im Freien für deinen Vater und die Familie. Ein Privatkoch kann eine Vielzahl von
                                    köstlichen Speisen zubereiten, die perfekt für ein entspanntes Picknick sind.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Sushi-Abend zu Hause:</strong> Wenn dein Vater Sushi
                                    liebt, organisiere einen Sushi-Abend zu Hause mit einem Privatkoch. Er kann frische und köstliche
                                    Sushi-Kreationen zaubern, die deinen Vater begeistern werden.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-orange-600" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Kochbuch mit persönlicher Signatur:</strong> Schenke
                                    deinem Vater ein Kochbuch mit persönlicher Widmung von seinem Lieblingskoch oder einem Privatkoch, der
                                    seine kulinarische Inspiration teilt.
                                </span>
                            </li>
                        </ul>
                        <p className="mt-8">
                            Buche noch heute ein unvergessliches Privatkoch-Erlebnis zum Vatertag und mache diesen Tag zu etwas ganz
                            Besonderem für deinen Vater. Zeige ihm, wie sehr du ihn schätzt, indem du ihm ein einzigartiges und
                            kulinarisches Geschenk machst, das lange in Erinnerung bleiben wird.
                        </p>
                        <p className="mt-8">
                            Auf PeopleEat kannst du direkt einen individuellen Gutschein für den Vatertag erstellen lassen. Über diesen Link
                            kannst du deine Anfrage direkt stellen.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
