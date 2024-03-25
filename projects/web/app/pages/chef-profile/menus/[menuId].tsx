import { MealCard, PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import {
    PEButton,
    PECheckbox,
    PELabelMultiSelection,
    PELabelSingleSelection,
    PENumberTextField,
    PESingleSelection,
    PETextArea,
    PETextField,
} from '@people-eat/web-core-components';
import {
    CategoryOption,
    GetCookProfileMenuPageDataDocument,
    GetCookProfileMenuPageDataQuery,
    GetSignedInUserDocument,
    KitchenOption,
    SignedInUser,
    calculateMenuPrice,
    formatPrice,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { ArrowDown, ArrowUp, Car, HandCoins, Plus, Rows4, Soup } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { ParticipantsPicker } from 'projects/web/components/src/search-bar/PEParticipantsPicker';
import { useState } from 'react';
import { createApolloClient } from '../../../network/apolloClients';
import { useForm } from 'react-hook-form';
import { CreateMenuFormInputs } from './create';

const tabs = [
    { name: 'Allgemeines', icon: Rows4 },
    { name: 'Gänge', icon: Soup },
    { name: 'Preis', icon: HandCoins },
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

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    categories: CategoryOption[];
    kitchens: KitchenOption[];
    meals: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['users']['signedInUser']>['cook']>['meals'];
    menu: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['cooks']['menus']>['findOne']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    const { menuId } = query;

    if (typeof menuId !== 'string') throw new Error();

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;
        const cookId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetCookProfileMenuPageDataDocument, variables: { cookId, menuId } });
        const menu = result.data.cooks.menus.findOne!;

        return {
            props: {
                signedInUser,
                categories: result.data.categories.findAll,
                kitchens: result.data.kitchens.findAll,
                meals: result.data.users.signedInUser?.cook?.meals ?? [],
                menu,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function CookProfileMenuPage({ signedInUser, categories, kitchens, meals, menu }: ServerSideProps) {
    const [selectedTab, setSelectedTab] = useState(0);

    const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]);
    const [selectedKitchen, setSelectedKitchen] = useState<KitchenOption | undefined>();
    const [greetingFromKitchenEnabled, setGreetingFromKitchenEnabled] = useState<boolean>(false);
    const [preparationTime, setPreparationTime] = useState(preparationTimeOptions[1]);

    const [coursesInEditMode, setCoursesInEditMode] = useState(false);

    const [priceInEditMode, setPriceInEditMode] = useState(false);

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
            basePrice: menu.basePrice,
            basePriceCustomers: menu.basePriceCustomers,
            pricePerAdult: menu.pricePerAdult,
            isVisible: true,
        },
    });

    const { basePrice, basePriceCustomers, pricePerAdult, pricePerChild } = watch();

    const [childrenDiscount, setChildrenDiscount] = useState(childrenDiscountOptions[0]);
    // useEffect(() => {
    //     if (childrenDiscount.value === undefined) {
    //         setValue('pricePerChild', undefined);
    //     } else {
    //         setValue('pricePerChild', (pricePerAdult * (100 - childrenDiscount.value)) / 100);
    //     }
    // }, [pricePerAdult, childrenDiscount, setValue]);

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

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-16">
                <PECookProfileNavigation current="MENUS" />

                <div>
                    <div className="sm:hidden">
                        <label htmlFor="tabs" className="sr-only">
                            Select a tab
                        </label>
                        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                        <select
                            id="tabs"
                            name="tabs"
                            className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                            defaultValue={selectedTab}
                        >
                            {tabs.map((tab) => (
                                <option key={tab.name}>{tab.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="hidden sm:block">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map((tab, index) => (
                                    <button
                                        key={tab.name}
                                        onClick={() => setSelectedTab(index)}
                                        className={classNames(
                                            selectedTab === index
                                                ? 'border-orange-500 text-orange-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                            'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium',
                                        )}
                                        aria-current={selectedTab === index ? 'page' : undefined}
                                    >
                                        <tab.icon
                                            className={classNames(
                                                selectedTab === index ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500',
                                                '-ml-0.5 mr-2 h-5 w-5',
                                            )}
                                            aria-hidden="true"
                                        />
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {selectedTab === 0 && (
                    <>
                        <PETextField
                            id="title"
                            labelTitle="Name"
                            type="text"
                            // errorMessage={errors.title?.message}
                            // {...register('title', {
                            //     required: 'Dein Menü braucht noch einen Namen.',
                            //     minLength: {
                            //         value: 5,
                            //         message: 'Der Name deines Menüs ist zu kurz.',
                            //     },
                            // })}
                        />

                        <PETextArea
                            id="description"
                            labelTitle="Beschreibung"
                            // errorMessage={errors.description?.message}
                            // {...register('description', { required: 'Dein Menü braucht noch eine Beschreibung.' })}
                        />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <span>Kategorien</span>
                            <PELabelMultiSelection
                                options={categories}
                                selectedOptions={selectedCategories}
                                selectedOptionsChanged={setSelectedCategories}
                                optionTitle={({ title }) => title}
                                optionIdentifier={({ categoryId }) => categoryId}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <span>Küche</span>
                            <PELabelSingleSelection
                                options={kitchens}
                                selectedOption={selectedKitchen}
                                selectedOptionChanged={setSelectedKitchen}
                                optionTitle={({ title }) => title}
                                optionIdentifier={({ kitchenId }) => kitchenId}
                            />
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
                            className="w-[400px]"
                        />

                        <PECheckbox
                            id="isVisible"
                            label={{ title: 'Menü ist privat und nur für dich einsehbar' }}
                            // {...register('isVisible')}
                        />
                    </>
                )}

                {selectedTab === 1 && (
                    <>
                        {menu.courses.map((course, index) => (
                            <div key={index} className={classNames('flex flex-col gap-4', 'text-md font-semibold')}>
                                <div className="flex justify-between">
                                    <h3>{course.title}</h3>
                                    {coursesInEditMode && <button onClick={() => undefined}>Gang entfernen</button>}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {coursesInEditMode && (
                                        <button
                                            type="button"
                                            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                        >
                                            <Plus className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                                            <span className="mt-2 block text-sm text-gray-900">Gericht hinzufügen</span>
                                        </button>
                                    )}
                                    {course.mealOptions.map((mealOption, mealOptionIndex) => (
                                        <MealCard
                                            type="BUTTON"
                                            key={mealOption.meal.mealId}
                                            title={mealOption.meal.title}
                                            description={mealOption.meal.description}
                                            imageUrl={mealOption.meal.imageUrl}
                                            onInfoClick={() => undefined}
                                            button={{
                                                title: 'Entfernen',
                                                onClick: () => undefined,
                                                type: 'SECONDARY',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end gap-4">
                            {!coursesInEditMode && (
                                <PEButton title="Bearbeiten" onClick={() => setCoursesInEditMode(true)} type="secondary" />
                            )}
                            {coursesInEditMode && (
                                <>
                                    <PEButton title="Abbrechen" type="secondary" onClick={() => setCoursesInEditMode(false)} />
                                    <PEButton title="Speichern" onClick={() => setCoursesInEditMode(false)} />
                                </>
                            )}
                        </div>
                    </>
                )}

                {selectedTab === 2 && (
                    <>
                        <div className="flex gap-4 items-start">
                            <span>Der Menüpreis beträgt</span>

                            {priceInEditMode && (
                                <PENumberTextField
                                    id="basePrice"
                                    className="w-16"
                                    errorMessage={errors.basePrice?.message}
                                    {...register('basePrice', {
                                        required: 'Ungültig',
                                        min: { value: 25, message: 'Ungültig' },
                                        max: { value: 10000, message: 'Ungültig' },
                                    })}
                                />
                            )}

                            {!priceInEditMode && <b>{basePrice}</b>}
                            <span> für</span>

                            {priceInEditMode && (
                                <PENumberTextField
                                    className="w-16"
                                    id="basePriceCustomers"
                                    errorMessage={errors.basePriceCustomers?.message}
                                    {...register('basePriceCustomers', {
                                        required: 'Ungültig',
                                        min: { value: 1, message: 'Ungültig' },
                                        max: { value: 100, message: 'Ungültig' },
                                    })}
                                />
                            )}

                            {!priceInEditMode && <b>{basePriceCustomers}</b>}

                            <span>Personen.</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span>Für jede weitere Person wird ein Preis in Höhe von</span>
                            {priceInEditMode && (
                                <PENumberTextField
                                    id="pricePerAdult"
                                    className="w-16"
                                    errorMessage={errors.pricePerAdult?.message}
                                    {...register('pricePerAdult', {
                                        required: 'Ungültig',
                                        min: { value: 1, message: 'Ungültig' },
                                        max: { value: 1000, message: 'Ungültig' },
                                    })}
                                />
                            )}
                            {!priceInEditMode && <b>{pricePerAdult}</b>}
                            <span> € angesetzt.</span>
                        </div>
                        <div className="flex flex-col items-start">
                            <h3 className="font-semibold text-xl mb-2 md:text-text-m-bold">Möchtest du einen Kinderrabatt anbieten?</h3>
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
                                        Der Kinderrabatt (z.B. 50%) berechnet sich auf Grundlage des angesetzten Betrags den du für jede
                                        weitere Person (z.B. 50 EUR) angegeben hast.
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
                                <button className="text-gray-500" onClick={(): void => setCostDetailsShown(!costDetailsShown)}>
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

                        <div className="flex justify-end gap-4">
                            {!priceInEditMode && <PEButton title="Bearbeiten" onClick={() => setPriceInEditMode(true)} type="secondary" />}
                            {priceInEditMode && (
                                <>
                                    <PEButton title="Abbrechen" type="secondary" onClick={() => setPriceInEditMode(false)} />
                                    <PEButton title="Speichern" onClick={() => setPriceInEditMode(false)} />
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
