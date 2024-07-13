import { useLazyQuery, useMutation } from '@apollo/client';
import {
    CreateMenuCourseForm,
    LoadingDialog,
    MealCard,
    MealDetailsDialog,
    PECookProfileNavigation,
    PEHeader,
} from '@people-eat/web-components';
import {
    PEAlert,
    PEButton,
    PECheckbox,
    PEDialog,
    PELabelMultiSelection,
    PELabelSingleSelection,
    PENumberTextField,
    PESingleSelection,
    PETextArea,
    PETextField,
} from '@people-eat/web-core-components';
import {
    CategoryOption,
    CreateOneCookMenuDocument,
    GetCookProfileMenusCreatePageDataDocument,
    GetCookProfileMenusCreatePageDataQuery,
    GetMealsDocument,
    KitchenOption,
    MealType,
    SignedInUser,
    calculateMenuPrice,
    formatPrice,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { ArrowDown, ArrowUp, Car, CheckIcon, HandCoins, Plus } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParticipantsPicker } from 'projects/web/components/src/search-bar/PEParticipantsPicker';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { CreateMealDialog } from '../../../components/CreateMealDialog';
import { PEAddMealToCourseDialog } from '../../../components/PEAddMealToCourseDialog';
import { PEProfileCard } from '../../../components/PEProfileCard';
import { useNotLeave } from '../../../hooks/useNotLeave';
import { createApolloClient } from '../../../network/apolloClients';
import { CookieSettings } from '../../../components/analytics/CookieSettings';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    cookieSettings: CookieSettings | null;
    categories: CategoryOption[];
    kitchens: KitchenOption[];
    meals: NonNullable<NonNullable<GetCookProfileMenusCreatePageDataQuery['users']['signedInUser']>['cook']>['meals'];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetCookProfileMenusCreatePageDataDocument });
        const signedInUser = data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook || !signedInUser.cook) return howToBecomeAChefRedirect;

        return {
            props: {
                signedInUser,
                categories: data.categories.findAll,
                kitchens: data.kitchens.findAll,
                meals: signedInUser.cook.meals,
                cookieSettings: data.sessions.current?.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        console.error(error);
        throw new Error();
    }
};

export interface CreateMenuFormInputs {
    title: string;
    description: string;
    greetingFromKitchen: string;
    courses: {
        title: string;
        mealOptions: {
            mealId: string;
            cookId: string;
            title: string;
            type: MealType;
            description: string;
            imageUrl?: string | null;
            createdAt: Date;
        }[];
    }[];
    basePrice: number;
    basePriceCustomers: number;
    pricePerAdult: number;
    pricePerChild?: number;
    isVisible: boolean;
}

const steps = [
    { id: '1', name: 'Schritt 1' },
    { id: '2', name: 'Schritt 2' },
    { id: '3', name: 'Schritt 3' },
];

const preparationTimeOptions = [
    { value: 30, label: '30min' },
    { value: 45, label: '45min' },
    { value: 60, label: '1h' },
    { value: 90, label: '1h 30min' },
    { value: 120, label: '2h' },
];

const childrenDiscountOptions = [
    { value: undefined, title: 'Kein Kinderrabatt' },
    { value: 25, title: '25%' },
    { value: 50, title: '50%' },
    { value: 75, title: ' 75%' },
    { value: 100, title: 'Kostenlos' },
];

export default function CookProfileCreateMenuPage({ signedInUser, categories, kitchens, meals: initialMeals }: ServerSideProps) {
    const cookId = signedInUser.userId;
    const router = useRouter();

    const [meals, setMeals] = useState(initialMeals);

    const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]);
    const [selectedKitchen, setSelectedKitchen] = useState<KitchenOption | undefined>();
    const [greetingFromKitchenEnabled, setGreetingFromKitchenEnabled] = useState<boolean>(false);

    const [createCourseDialogOpen, setCreateCourseDialogOpen] = useState<boolean>(false);
    const [courseIndexToAddMealTo, setCourseIndexToAddMealTo] = useState<number | undefined>();
    const [createMealDialogOpen, setCreateMealDialogOpen] = useState<boolean>(false);
    const [preparationTime, setPreparationTime] = useState(preparationTimeOptions[1]);

    const {
        control,
        register,
        handleSubmit,
        trigger,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateMenuFormInputs>({
        defaultValues: {
            description: '',
            basePrice: 100,
            basePriceCustomers: 2,
            pricePerAdult: 50,
            isVisible: true,
        },
    });
    const {
        fields: courses,
        append,
        remove,
        update,
    } = useFieldArray({
        control,
        name: 'courses',
        rules: {
            required: 'Es muss mindestens ein Gang vorhanden sein.',
            minLength: 1,
        },
    });

    const numberOfMealOptionsWithImages = courses
        .flatMap(({ mealOptions }) => mealOptions.flatMap(({ imageUrl }) => imageUrl))
        .filter(Boolean).length;

    const [keyMealOption, setKeyMealOption] = useState<{ index: number; courseIndex: number }>({ index: 0, courseIndex: 0 });

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const { basePrice, basePriceCustomers, pricePerAdult, pricePerChild } = watch();

    const [childrenDiscount, setChildrenDiscount] = useState(childrenDiscountOptions[0]);
    useEffect(() => {
        if (childrenDiscount.value === undefined) {
            setValue('pricePerChild', undefined);
        } else {
            setValue('pricePerChild', (pricePerAdult * (100 - childrenDiscount.value)) / 100);
        }
    }, [pricePerAdult, childrenDiscount, setValue]);

    const [adults, setAdults] = useState(4);
    const [children, setChildren] = useState(0);
    const [costDetailsShown, setCostDetailsShown] = useState(false);

    const price = calculateMenuPrice(
        Number(adults),
        Number(children),
        Number(basePrice) * 100,
        Number(basePriceCustomers),
        Number(pricePerAdult) * 100,
        pricePerChild === undefined ? undefined : Number(pricePerChild) * 100,
    );

    const cookPrice = price * 0.82;
    const formattedFee = formatPrice({ amount: price * 0.18, currencyCode: 'EUR' });
    const formattedPrice = formatPrice({ amount: price, currencyCode: 'EUR' });
    const formattedCookPrice = formatPrice({ amount: cookPrice, currencyCode: 'EUR' });

    const [fetchMeals, { loading: loadingMeals }] = useLazyQuery(GetMealsDocument, { variables: { cookId } });

    const [createMenu, { loading, data, reset }] = useMutation(CreateOneCookMenuDocument);

    const showSuccessAlert = data?.cooks.menus.success ?? false;
    const showFailedAlert = data ? !data.cooks.menus.success : false;

    function onCreate({ title, description, greetingFromKitchen, isVisible }: CreateMenuFormInputs) {
        createMenu({
            variables: {
                cookId,
                menu: {
                    // @todo: add check if option for this index even exists
                    keyMealOptionCourseIndex: keyMealOption.courseIndex,
                    keyMealOptionIndex: keyMealOption.index,
                    title,
                    description,
                    basePrice: basePrice * 100,
                    basePriceCustomers,
                    pricePerAdult: pricePerAdult * 100,
                    pricePerChild: pricePerChild ? pricePerChild * 100 : undefined,
                    currencyCode: 'EUR',
                    greetingFromKitchen,
                    isVisible,
                    preparationTime: preparationTime.value,
                    kitchenId: selectedKitchen?.kitchenId,
                    categoryIds: selectedCategories.map(({ categoryId }) => categoryId),
                    courses: courses.map((course, index) => ({
                        index,
                        title: course.title,
                        mealOptions: course.mealOptions.map(({ mealId }, mealIndex) => ({ index: mealIndex, mealId })),
                    })),
                },
            },
        });
    }

    const [selectedMeal, setSelectedMeal] = useState<
        | undefined
        | {
              title: string;
              description: string;
              imageUrl?: string | null;
          }
    >(undefined);

    useNotLeave();

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PECookProfileNavigation current="MENUS" />

                <PEProfileCard className="flex flex-col gap-8">
                    <h1 className="font-bold text-3xl tracking-tight text-gray-900">Menü erstellen</h1>

                    <nav aria-label="Progress">
                        <ol role="list" className="flex items-center">
                            {steps.map((step, stepIdx) => (
                                <li
                                    key={step.name}
                                    className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20 w-full' : '', 'relative')}
                                >
                                    {stepIdx < currentStepIndex ? (
                                        <>
                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                <div className="h-0.5 w-full bg-orange-500" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStepIndex(stepIdx)}
                                                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-400"
                                            >
                                                <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                                <span className="sr-only">{step.name}</span>
                                            </button>
                                        </>
                                    ) : stepIdx === currentStepIndex ? (
                                        <>
                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                <div className="h-0.5 w-full bg-gray-200" />
                                            </div>
                                            <div
                                                className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-500 bg-white"
                                                aria-current="step"
                                            >
                                                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" aria-hidden="true" />
                                                <span className="sr-only">{step.name}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                <div className="h-0.5 w-full bg-gray-200" />
                                            </div>
                                            <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                                                <span className="h-2.5 w-2.5 rounded-full bg-transparent" aria-hidden="true" />
                                                <span className="sr-only">{step.name}</span>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onCreate)}>
                        {currentStepIndex === 0 && (
                            <>
                                <PETextField
                                    id="title"
                                    labelTitle="Name"
                                    type="text"
                                    errorMessage={errors.title?.message}
                                    {...register('title', {
                                        required: 'Dein Menü braucht noch einen Namen.',
                                        minLength: {
                                            value: 5,
                                            message: 'Der Name deines Menüs ist zu kurz.',
                                        },
                                    })}
                                />

                                <span>Kategorien</span>
                                <PELabelMultiSelection
                                    options={categories}
                                    selectedOptions={selectedCategories}
                                    selectedOptionsChanged={setSelectedCategories}
                                    optionTitle={({ title }) => title}
                                    optionIdentifier={({ categoryId }) => categoryId}
                                />

                                <span>Küche</span>
                                <PELabelSingleSelection
                                    options={kitchens}
                                    selectedOption={selectedKitchen}
                                    selectedOptionChanged={setSelectedKitchen}
                                    optionTitle={({ title }) => title}
                                    optionIdentifier={({ kitchenId }) => kitchenId}
                                />

                                <div className="flex gap-4">
                                    <PEButton
                                        className="w-full"
                                        title="Weiter"
                                        onClick={() => trigger(['title']).then((success) => success && setCurrentStepIndex(1))}
                                    />
                                </div>
                            </>
                        )}

                        {currentStepIndex === 1 && (
                            <>
                                <span className="text-xl font-semibold">Möchtest du einen Gruß aus der Küche anbieten?</span>
                                <div className="flex flex-col gap-4 items-start">
                                    <PELabelSingleSelection
                                        options={['Ja', 'Nein']}
                                        selectedOption={greetingFromKitchenEnabled ? 'Ja' : 'Nein'}
                                        selectedOptionChanged={(o) => setGreetingFromKitchenEnabled(o === 'Ja')}
                                        optionTitle={(o) => o}
                                        optionIdentifier={(o) => o}
                                    />

                                    {greetingFromKitchenEnabled && (
                                        <div className="w-full">
                                            <PETextField
                                                id="greetingFromKitchen"
                                                type="text"
                                                errorMessage={errors.greetingFromKitchen?.message}
                                                {...register('greetingFromKitchen', {
                                                    required: greetingFromKitchenEnabled ? 'Beschreibe deinen Gruß aus der Küche.' : false,
                                                    minLength: {
                                                        value: 5,
                                                        message: 'Der Name deines Gruß aus der Küche ist zu kurz.',
                                                    },
                                                })}
                                            />
                                        </div>
                                    )}
                                </div>

                                <span className="text-xl font-semibold">Gänge</span>

                                {errors.courses?.root?.message && (
                                    <span className="text-sm font-semibold text-red-500">{errors.courses?.root?.message}</span>
                                )}

                                {courses.map((course, index) => (
                                    <div key={index} className={classNames('flex flex-col gap-4', 'text-md font-semibold')}>
                                        <div className="flex justify-between">
                                            <h3>{course.title}</h3>
                                            <button type="button" onClick={() => remove(index)}>
                                                Gang entfernen
                                            </button>
                                        </div>
                                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:grid-cols-3 xl:gap-x-8">
                                            <button
                                                type="button"
                                                className="relative block rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                                onClick={() => setCourseIndexToAddMealTo(index)}
                                            >
                                                <Plus className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                                                <span className="mt-2 block text-sm text-gray-900">Gericht hinzufügen</span>
                                            </button>
                                            {course.mealOptions.map((meal, mealOptionIndex) => (
                                                <MealCard
                                                    type="BUTTON"
                                                    key={meal.mealId}
                                                    title={meal.title}
                                                    description={meal.description}
                                                    imageUrl={meal.imageUrl}
                                                    onInfoClick={() => setSelectedMeal(meal)}
                                                    button={
                                                        course.mealOptions.length > 1
                                                            ? {
                                                                  title: 'Entfernen',
                                                                  onClick: () =>
                                                                      update(index, {
                                                                          ...course,
                                                                          mealOptions: course.mealOptions.filter(
                                                                              (e, i) => i !== mealOptionIndex,
                                                                          ),
                                                                      }),
                                                                  type: 'SECONDARY',
                                                              }
                                                            : undefined
                                                    }
                                                />
                                            ))}
                                        </ul>

                                        {selectedMeal && (
                                            <MealDetailsDialog onClose={() => setSelectedMeal(undefined)} meal={selectedMeal} />
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="relative block rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                    onClick={() => setCreateCourseDialogOpen(true)}
                                >
                                    <Plus className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                                    <span className="mt-2 block text-sm text-gray-900">Gang hinzufügen</span>
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                </div>

                                <PETextArea
                                    id="description"
                                    labelTitle="Beschreibung"
                                    errorMessage={errors.description?.message}
                                    {...register('description')}
                                />

                                <div className="flex flex-col gap-4">
                                    <label className="block text-base font-medium leading-6 text-gray-900">
                                        Titelbild für dein Menü auswählen
                                    </label>

                                    {numberOfMealOptionsWithImages > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {courses.map((course, courseIndex) =>
                                                course.mealOptions.map((mealOption, mealOptionIndex) => (
                                                    <>
                                                        {mealOption.imageUrl && (
                                                            <Image
                                                                key={mealOptionIndex}
                                                                src={mealOption.imageUrl!}
                                                                alt=""
                                                                width={400}
                                                                height={400}
                                                                className={classNames('rounded-2xl shadow-lg', {
                                                                    'ring-2 ring-orange-600':
                                                                        keyMealOption.index === mealOptionIndex &&
                                                                        keyMealOption.courseIndex === courseIndex,
                                                                })}
                                                                onClick={() =>
                                                                    setKeyMealOption({ index: mealOptionIndex, courseIndex: courseIndex })
                                                                }
                                                            />
                                                        )}
                                                    </>
                                                )),
                                            )}
                                        </div>
                                    )}

                                    {numberOfMealOptionsWithImages < 1 && (
                                        <div className="text-gray-400">
                                            Keine der Gerichtsoptionen deiner konfigurierten Gänge hat ein Bild.
                                        </div>
                                    )}
                                </div>

                                <PEButton
                                    title="Weiter"
                                    onClick={() => {
                                        trigger(['greetingFromKitchen', 'description', 'courses']).then((success) => {
                                            if (success) {
                                                setCurrentStepIndex(2);
                                            }
                                        });
                                    }}
                                />
                            </>
                        )}

                        {currentStepIndex === 2 && (
                            <>
                                <h3 className="font-semibold text-xl">Wie viel soll das Menü kosten?</h3>

                                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2">
                                    <span>Der Mindestumsatz beträgt</span>

                                    <div className="flex gap-2">
                                        <PENumberTextField
                                            id="basePrice"
                                            errorMessage={errors.basePrice?.message}
                                            {...register('basePrice', {
                                                required: 'Ungültig',
                                                min: { value: 25, message: 'Ungültig' },
                                                max: { value: 10000, message: 'Ungültig' },
                                                valueAsNumber: true,
                                            })}
                                        />

                                        <span>€</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <span>für</span>

                                        <PENumberTextField
                                            className="w-16"
                                            id="basePriceCustomers"
                                            errorMessage={errors.basePriceCustomers?.message}
                                            {...register('basePriceCustomers', {
                                                required: 'Ungültig',
                                                min: { value: 1, message: 'Ungültig' },
                                                max: { value: 100, message: 'Ungültig' },
                                                valueAsNumber: true,
                                            })}
                                        />

                                        <span>Personen.</span>
                                    </div>
                                </div>

                                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2">
                                    <span>Jede weitere Personen kostet</span>

                                    <div className="flex gap-2">
                                        <PENumberTextField
                                            id="pricePerAdult"
                                            errorMessage={errors.pricePerAdult?.message}
                                            {...register('pricePerAdult', {
                                                required: 'Ungültig',
                                                min: { value: 1, message: 'Ungültig' },
                                                max: { value: 1000, message: 'Ungültig' },
                                                valueAsNumber: true,
                                            })}
                                        />

                                        <span>€.</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start">
                                    <h3 className="font-semibold text-xl mb-2 md:text-text-m-bold">
                                        Möchtest du einen Kinderrabatt anbieten?
                                    </h3>
                                    <p>Der Rabatt gilt für Kinder im Alter von 6-12 Jahren.</p>
                                    <div className="flex gap-8 items-center">
                                        <PESingleSelection
                                            options={childrenDiscountOptions}
                                            selectedOption={childrenDiscount}
                                            selectedOptionChanged={(o) => o && setChildrenDiscount(o)}
                                            optionTitle={({ title }) => title}
                                            optionIdentifier={({ value }) => `${value}`}
                                            className="w-full lg:w-[400px]"
                                        />
                                    </div>
                                </div>
                                {pricePerChild !== undefined && (
                                    <div className="flex flex-col items-start">
                                        <div className="flex flex-col items-start text-sm leading-6 text-gray-600">
                                            <span>Beispiel:</span>
                                            <span>
                                                Der Kinderrabatt (z.B. 50%) berechnet sich auf Grundlage des angesetzten Betrags den du für
                                                jede weitere Person (z.B. 50 EUR) angegeben hast.
                                            </span>
                                            <span>Mit dem gegebenen Beispielrabatt würde der Preis pro Kind beträgt 25 EUR betragen.</span>
                                        </div>
                                    </div>
                                )}

                                <p className="text-xl font-semibold">Preissimulation - Dein erwarteter Umsatz</p>
                                <div className="flex gap-16 w-full items-start flex-wrap">
                                    <ParticipantsPicker
                                        hideLabel
                                        adults={adults}
                                        setAdults={setAdults}
                                        children={children}
                                        setChildren={setChildren}
                                    />

                                    <span className="flex-1" />

                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col gap-8 bg-white items-start p-16 shadow-xl rounded-2xl">
                                            {costDetailsShown && (
                                                <>
                                                    <div className="flex justify-between w-full text-gray-400">
                                                        <span>Menüpreis</span>
                                                        <span>{formattedPrice}</span>
                                                    </div>

                                                    <div className="flex justify-between w-full text-gray-400">
                                                        <span>Servicegebühr</span>
                                                        <span>{formattedFee}</span>
                                                    </div>

                                                    <div className="relative self-stretch">
                                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                            <div className="w-full border-t border-gray-300" />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <div
                                                className="flex text-heading-xl md:text-text-m-bold w-full lg:w-[600px]"
                                                style={{ justifyContent: 'space-between' }}
                                            >
                                                <span className="text-2xl font-semibold">Du erhältst</span>
                                                <span className="text-2xl font-semibold">{formattedCookPrice}</span>
                                            </div>
                                            <span className="text-text-m-bold">Hinzu kommen</span>

                                            <div className="flex gap-4 items-center">
                                                <div className="flex flex-col justify-center bg-orange w-6 h-6 rounded-6">
                                                    <HandCoins strokeWidth={1} />
                                                </div>

                                                <p className="my-0 text-text-sm">Trinkgeld</p>

                                                <div className="flex flex-col justify-center bg-orange w-6 h-6 rounded-6">
                                                    <Car strokeWidth={1} />
                                                </div>

                                                <p className="my-0 text-text-sm">Fahrtkosten</p>
                                            </div>
                                            <span className="text-text-sm" style={{ color: 'gray' }}>
                                                Für Fahrtkosten und Trinkgeld fallen keine Servicegebühren an.
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="text-gray-500"
                                            onClick={(): void => setCostDetailsShown(!costDetailsShown)}
                                        >
                                            {!costDetailsShown && (
                                                <div className="flex flex-col items-center">
                                                    <span>Mehr anzeigen</span>
                                                    <ArrowDown />
                                                </div>
                                            )}
                                            {costDetailsShown && (
                                                <div className="flex flex-col items-center">
                                                    <span>Weniger anzeigen</span>
                                                    <ArrowUp />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                </div>

                                <PESingleSelection
                                    labelTitle="Vorbereitungszeit"
                                    options={preparationTimeOptions}
                                    selectedOption={preparationTime}
                                    selectedOptionChanged={(o) => o && setPreparationTime(o)}
                                    optionTitle={({ label }) => label}
                                    optionIdentifier={({ value }) => `${value}`}
                                    className="lg:w-[400px]"
                                />

                                <PECheckbox
                                    id="isVisible"
                                    label={{ title: 'Menü bei Fertigstellung veröffentlichen' }}
                                    {...register('isVisible')}
                                />

                                {/* <PEButton
                                    title="Weiter"
                                    onClick={() =>
                                        trigger(['basePrice', 'basePriceCustomers', 'pricePerAdult']).then((success) => {
                                            if (success) setCurrentStepIndex(3);
                                        })
                                    }
                                    /> */}
                                <PEButton title="Menü erstellen" type="submit" />
                            </>
                        )}
                    </form>
                </PEProfileCard>

                <PEDialog open={createCourseDialogOpen} onClose={() => setCreateCourseDialogOpen(false)}>
                    <CreateMenuCourseForm
                        meals={meals}
                        onCreateMeal={() => {
                            setCreateMealDialogOpen(true);
                            setCreateCourseDialogOpen(false);
                        }}
                        onCreate={(data) => {
                            append(data);
                            setCreateCourseDialogOpen(false);
                        }}
                    />
                </PEDialog>

                <PEAddMealToCourseDialog
                    open={courseIndexToAddMealTo !== undefined}
                    onClose={() => setCourseIndexToAddMealTo(undefined)}
                    meals={meals}
                    selectedMealIds={
                        courseIndexToAddMealTo !== undefined ? courses[courseIndexToAddMealTo].mealOptions.map(({ mealId }) => mealId) : []
                    }
                    onAdd={(selectedMeal) => {
                        const course = courses[courseIndexToAddMealTo!];
                        update(courseIndexToAddMealTo!, {
                            ...course,
                            mealOptions: [selectedMeal, ...course.mealOptions],
                        });
                        setCourseIndexToAddMealTo(undefined);
                    }}
                />

                <CreateMealDialog
                    cookId={signedInUser.userId}
                    open={createMealDialogOpen}
                    onClose={(reloadMeals) => {
                        setCreateMealDialogOpen(false);
                        if (reloadMeals) fetchMeals().then(({ data }) => data?.cooks.meals.findMany && setMeals(data.cooks.meals.findMany));
                        setCreateCourseDialogOpen(true);
                    }}
                />

                <LoadingDialog active={loadingMeals} />

                <PEAlert
                    open={showSuccessAlert}
                    title="Menü erfolgreich angelegt"
                    subtitle="Füge es gleich einem neuen oder einem deiner bestehenden Menüs als Option hinzu."
                    primaryButton={{ title: 'Zur Menüsübersicht', onClick: () => router.push('/chef-profile/menus') }}
                />

                <PEAlert
                    type="ERROR"
                    open={showFailedAlert}
                    title="Leider ist ein Fehler aufgetreten"
                    subtitle="Bitte versuche es später erneut"
                    primaryButton={{ title: 'Erneut versuchen', onClick: () => reset() }}
                />

                <LoadingDialog active={loading} />
            </div>
        </div>
    );
}
