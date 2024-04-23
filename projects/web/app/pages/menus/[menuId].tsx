import { useMutation } from '@apollo/client';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import {
    BookBar,
    BookForm,
    LoadingDialog,
    MealSelectionCard,
    PECostBreakdownPanel,
    PEFooter,
    PEHeader,
    Payment,
} from '@people-eat/web-components';
import { PEButton, PEDialog, PEFullPageSheet } from '@people-eat/web-core-components';
import {
    AllergyOption,
    CostBreakdown,
    CreateBookingRequestRequest,
    CreateOneUserBookingRequestDocument,
    GetPublicMenuPageDataDocument,
    GetPublicMenuPageDataQuery,
    LineItem,
    LocationSearchResult,
    SearchParams,
    SignedInUser,
    Time,
    Unpacked,
    calculateMenuPrice,
    formatPrice,
    geoDistance,
    toValidatedSearchParams,
} from '@people-eat/web-domain';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import debounce from 'lodash/debounce';
import { CheckCircleIcon, Circle, CircleUser, HandPlatter, MinusIcon, PlusIcon, ShoppingBasket, Sparkles, Utensils, X } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { PEAuthDialog } from '../../components/PEAuthDialog';
import { createApolloClient } from '../../network/apolloClients';
import getLocationSuggestions from '../../network/getLocationSuggestions';
import Link from 'next/link';

const publicMenusRedirect = { redirect: { permanent: false, destination: '/menus' } };

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

interface ToCostBreakdownInput {
    adults: number;
    children: number;
    distance?: number;
    isOutOfCookTravelRadius: boolean;
    menu: NonNullable<GetPublicMenuPageDataQuery['publicMenus']['findOne']>;
}

function toCostBreakdown({ adults, children, distance, isOutOfCookTravelRadius, menu }: ToCostBreakdownInput): CostBreakdown {
    const travelExpenses: number | undefined = distance && distance * menu.cook.travelExpenses;

    const menuPrice = calculateMenuPrice(adults, children, menu.basePrice, menu.basePriceCustomers, menu.pricePerAdult, menu.pricePerChild);

    const customerFee = menuPrice * 0.04;
    const stripeTransactionPrice = menuPrice + (travelExpenses ?? 0) + customerFee;
    const finalPrice = (stripeTransactionPrice + 25) / (1 - 0.015);
    const stripeFee = finalPrice - stripeTransactionPrice;
    const serviceFee = stripeFee + customerFee;

    const lineItems: LineItem[] = [];

    lineItems.push({
        title: 'Menüpreis',
        price: { amount: menuPrice, currencyCode: '€' },
    });

    if (travelExpenses && !isOutOfCookTravelRadius) {
        lineItems.push({
            title: 'Reisekosten',
            price: { amount: travelExpenses, currencyCode: '€' },
        });
    }

    lineItems.push({
        title: 'Service Gebühren',
        price: { amount: serviceFee, currencyCode: '€' },
    });

    return {
        lineItems: lineItems,
        total: {
            title: 'Gesamtpreis',
            price: {
                amount: finalPrice,
                currencyCode: '€',
            },
        },
    };
}

interface ServerSideProps {
    initialSignedInUser: SignedInUser | null;
    menu: NonNullable<GetPublicMenuPageDataQuery['publicMenus']['findOne']>;
    allergies: AllergyOption[];
    searchParams: SearchParams;
    stripePublishableKey: string | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);
    const searchParams = toValidatedSearchParams(query);

    const { menuId } = query;

    if (typeof menuId !== 'string') return publicMenusRedirect;

    try {
        const result = await apolloClient.query({
            query: GetPublicMenuPageDataDocument,
            variables: {
                menuId,
            },
        });

        const menu = result.data.publicMenus.findOne!;

        return {
            props: {
                initialSignedInUser: result.data.users.signedInUser ?? null,
                menu,
                allergies: result.data.allergies.findAll,
                searchParams,
                stripePublishableKey: result.data.stripePublishableKey ?? null,
            },
        };
    } catch (error) {
        return publicMenusRedirect;
    }
};

export default function PublicMenuPage({ initialSignedInUser, menu, allergies, searchParams, stripePublishableKey }: ServerSideProps) {
    // hack to not run useEffect for signedInUser change on initial render
    const isInitialMount = useRef(true);
    const [signedInUser, setSignedInUser] = useState(initialSignedInUser);
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

    const [selectedAllergies, setSelectedAllergies] = useState<AllergyOption[]>([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onLocationSearchTextChange = useCallback(
        debounce((text: string) => getLocationSuggestions(text, (results) => setLocationSearchResults(results)), 300),
        [],
    );

    const [selectedMeal, setSelectedMeal] = useState<
        | {
              courseId: string;
              index: number;
              meal: Unpacked<
                  Unpacked<Unpacked<NonNullable<GetPublicMenuPageDataQuery['publicMenus']['findOne']>>['courses']>['mealOptions']
              >['meal'];
          }
        | undefined
    >();

    const sortedCourses = [...menu.courses].sort((courseA, courseB) => courseA.index - courseB.index);

    const [courseMealSelections, setCourseMealSelections] = useState<
        Map<
            string,
            Unpacked<Unpacked<Unpacked<NonNullable<GetPublicMenuPageDataQuery['publicMenus']['findOne']>>['courses']>['mealOptions']>
        >
    >(new Map());

    useEffect(() => {
        const map = new Map(courseMealSelections);
        menu.courses.forEach((course) => map.set(course.courseId, course.mealOptions[0]!));
        setCourseMealSelections(map);
    }, []);

    const distance: number | undefined = selectedLocation && geoDistance({ location1: selectedLocation, location2: menu.cook.location });

    const isOutOfCookTravelRadius =
        !!menu.cook.maximumTravelDistance && distance !== undefined && distance > menu.cook.maximumTravelDistance;

    const costBreakdown: CostBreakdown = toCostBreakdown({ adults, children, distance, isOutOfCookTravelRadius, menu });

    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);

    // booking request related section
    const [createMenuBookingRequest] = useMutation(CreateOneUserBookingRequestDocument);

    const [stripeClientSecret, setStripeClientSecret] = useState<string | undefined>();
    const [completionState, setCompletionState] = useState<undefined | 'SUCCESSFUL' | 'FAILED'>(undefined);
    const [loading, setLoading] = useState(false);
    const [bookingRequestId, setBookingRequestId] = useState<string | undefined>(undefined);

    const dateTime = new Date(date);
    dateTime.setHours(time.hours);
    dateTime.setMinutes(time.minutes);

    function onBook(): void {
        const menuBookingRequest: CreateBookingRequestRequest = {
            menu: {
                adultParticipants: adults,
                children,
                dateTime,
                duration: 120,
                location: {
                    latitude: selectedLocation?.latitude ?? 0,
                    longitude: selectedLocation?.latitude ?? 0,
                    text: selectedLocation?.text,
                },
                occasion,
                // allergyIds: selectedAllergies.map(({ allergyId }) => allergyId),
                message,
                cookId: menu.cook.cookId,
                preparationTime: 120,
                configuredMenu: {
                    menuId: menu.menuId,
                    courses: Array.from(courseMealSelections.entries()).map(([courseId, mealOption]) => ({
                        courseId,
                        mealId: mealOption.meal.mealId,
                    })),
                },
                travelExpensesAmount: 0,
            },
        };

        setLoading(true);

        void createMenuBookingRequest({
            variables: {
                userId: signedInUser?.userId ?? '',
                request: menuBookingRequest,
            },
        })
            .then(({ data }) => {
                if (data?.users.bookingRequests.createOne.success) {
                    setCompletionState('SUCCESSFUL');
                    setStripeClientSecret(data.users.bookingRequests.createOne.clientSecret);
                    setBookingRequestId(data.users.bookingRequests.createOne.bookingRequestId);
                    setShowPaymentDialog(true);
                } else setCompletionState('FAILED');
            })
            .catch(() => setCompletionState('FAILED'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (signedInUser) onBook();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signedInUser]);

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading} />

            {completionState === 'SUCCESSFUL' && stripeClientSecret && stripePublishableKey && (
                <PEDialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} title="Zahlungsmittel hinterlegen">
                    <Elements stripe={loadStripe(stripePublishableKey)} options={{ clientSecret: stripeClientSecret }}>
                        <Payment userId={signedInUser!.userId} bookingRequestId={bookingRequestId!}>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-semibold">{menu.title}</h3>

                                {/* {courseMealSelections.map(({ courseId, courseTitle, mealTitle }) => (
                                        <VStack key={courseId}>
                                            <b>{courseTitle}</b>
                                            <div>{mealTitle}</div>
                                        </VStack>
                                    ))} */}

                                {/* <Spacer /> */}

                                {/*<Divider flexItem /> */}

                                <PECostBreakdownPanel costBreakdown={costBreakdown} />

                                {/* {moreThanTwoWeeksInTheFuture <= 14 && (
                                        <div className="text-text-sm" style={{ color: 'gray' }}>
                                            Der Gesamtbetrag wird erst dann eingezogen wenn der Koch die Anfrage akzeptiert hat.
                                        </div>
                                    )}

                                    {moreThanTwoWeeksInTheFuture > 14 && (
                                        <div className="text-text-sm" style={{ color: 'gray' }}>
                                            Nachdem der Koch die Anfrage akzeptiert hat, wird die Gesamtsumme 2 Wochen vor dem Event eingezogen
                                            (zuvor wird eine Ankündigungsmail verschickt).
                                        </div>
                                    )} */}
                            </div>
                        </Payment>
                    </Elements>
                </PEDialog>
            )}

            <PEAuthDialog
                open={authDialogOpen}
                onClose={() => setAuthDialogOpen(false)}
                signInButtonTitle="Anfrage senden"
                signUpButtonTitle="Registrieren"
                onSignedInUserFetched={(changedSignedInUser) => {
                    setSignedInUser(changedSignedInUser);
                    setAuthDialogOpen(false);
                    // setShowPaymentDialog(true);
                }}
            />

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
                    costBreakdown={costBreakdown}
                    searchButton={{
                        title: 'Anfrage senden',
                        onClick: () => (signedInUser ? onBook() : setAuthDialogOpen(true)),
                    }}
                    allergies={{
                        allergyOptions: allergies,
                        selectedAllergies: selectedAllergies,
                        onChange: setSelectedAllergies,
                    }}
                />
            </PEFullPageSheet>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex gap-8">
                    <div className="flex-1 flex flex-col gap-8">
                        <h1 className="font-bold text-4xl tracking-tight text-gray-900 break-all">{menu.title}</h1>

                        {menu.kitchen && (
                            <div className="flex gap-4 text-gray-500 text-base font-semibold">
                                <Utensils />
                                <div>{menu.kitchen.title}</div>
                            </div>
                        )}

                        {menu.categories.length > 0 && (
                            <div className="flex gap-4 text-gray-500 text-base font-semibold">
                                {menu.categories.map(({ title }) => title).join(', ')}
                            </div>
                        )}

                        <Link href={'/chefs/' + menu.cook.cookId}>
                            <figcaption className="flex items-center gap-x-4">
                                {!menu.cook.user.profilePictureUrl && (
                                    <CircleUser strokeWidth={1.5} className="text-orange-500 w-10 h-10" />
                                )}
                                {menu.cook.user.profilePictureUrl && (
                                    <Image
                                        src={menu.cook.user.profilePictureUrl}
                                        width={100}
                                        height={100}
                                        alt=""
                                        className="object-cover object-center rounded-full w-10"
                                    />
                                )}
                                <span className="text-gray-900 text-2xl">{menu.cook.user.firstName}</span>
                            </figcaption>
                        </Link>

                        {menu.description && (
                            <div className="flex flex-col gap-2">
                                <div className="font-bold text-gray-900 text-3xl">Über das Menü</div>
                                <div className="text-gray-500">{menu.description}</div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <div className="font-bold text-gray-900 text-3xl">Stelle dein Wunschmenü zusammen</div>
                            <span className="textxl text-gray-500">
                                Klicke auf <i>Auswählen</i> und stelle dein Menü zusammen. Wird nur ein Gericht in einem Gang angezeigt, so
                                ist dieses automatisch ausgewählt.
                            </span>
                        </div>

                        {sortedCourses.map(({ courseId, title, mealOptions }) => (
                            <div key={courseId} className="flex flex-col gap-10 mb-8">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h2>
                                    <span className="textxl text-gray-500">
                                        {courseMealSelections.get(courseId)?.meal.title} ausgewählt
                                    </span>
                                </div>

                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                                    {mealOptions.map(({ index, meal }) => (
                                        <MealSelectionCard
                                            key={meal.mealId}
                                            title={meal.title}
                                            description={meal.description}
                                            imageUrl={meal.imageUrl}
                                            selected={courseMealSelections.get(courseId)?.index === index}
                                            onSelect={() => {
                                                const map = new Map(courseMealSelections);
                                                map.set(courseId, { index, meal });
                                                setCourseMealSelections(map);
                                            }}
                                            onInfoClick={() => setSelectedMeal({ meal, courseId, index })}
                                        />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <BookBar
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
                        costBreakdown={costBreakdown}
                        searchButton={{
                            title: 'Anfrage senden',
                            onClick: () => (signedInUser ? onBook() : setAuthDialogOpen(true)),
                        }}
                        allergies={{
                            allergyOptions: allergies,
                            selectedAllergies: selectedAllergies,
                            onChange: setSelectedAllergies,
                        }}
                    />
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

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
                    {costBreakdown.total?.price && <span>{formatPrice(costBreakdown.total.price)}</span>}
                    <PEButton title="Jetzt buchen" onClick={() => setShowBook(true)} />
                </div>
            </div>

            <Transition.Root show={Boolean(selectedMeal)} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setSelectedMeal(undefined)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                                enterTo="opacity-100 translate-y-0 md:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            >
                                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                    {selectedMeal && (
                                        <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-2xl">
                                            <button
                                                type="button"
                                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                                                onClick={() => setSelectedMeal(undefined)}
                                            >
                                                <span className="sr-only">Close</span>
                                                <X className="h-6 w-6" aria-hidden="true" />
                                            </button>

                                            <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                                                <div className="sm:col-span-4 lg:col-span-5">
                                                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                                                        <Image
                                                            src={selectedMeal.meal.imageUrl ?? '/placeholders/meal.png'}
                                                            alt=""
                                                            className="object-cover object-center"
                                                            width={600}
                                                            height={600}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-8 lg:col-span-7">
                                                    <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{selectedMeal.meal.title}</h2>

                                                    <section aria-labelledby="information-heading" className="mt-3">
                                                        <h3 id="information-heading" className="sr-only">
                                                            Product information
                                                        </h3>

                                                        <div className="mt-6">
                                                            <h4 className="sr-only">Description</h4>
                                                            <p className="text-sm text-gray-700">{selectedMeal.meal.description}</p>
                                                        </div>
                                                    </section>

                                                    <section aria-labelledby="options-heading" className="mt-6">
                                                        {courseMealSelections.get(selectedMeal.courseId)?.index === selectedMeal.index && (
                                                            <div className="inline-flex items-center gap-x-2 rounded-full bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm">
                                                                <span>Ausgewählt</span>
                                                                <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                                                            </div>
                                                        )}
                                                        {courseMealSelections.get(selectedMeal.courseId)?.index !== selectedMeal.index && (
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center gap-x-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                                onClick={() => {
                                                                    const map = new Map(courseMealSelections);
                                                                    map.set(selectedMeal.courseId, {
                                                                        index: selectedMeal.index,
                                                                        meal: selectedMeal.meal,
                                                                    });
                                                                    setCourseMealSelections(map);
                                                                }}
                                                            >
                                                                <span>Auswählen</span>
                                                                <Circle className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                                                            </button>
                                                        )}
                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <PEFooter />
        </div>
    );
}
