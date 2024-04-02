import { useLazyQuery, useMutation } from '@apollo/client';
import { PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import {
    PECheckbox,
    PELabelMultiSelection,
    PELabelSingleSelection,
    PESingleSelection,
    PETextArea,
    PETextField,
} from '@people-eat/web-core-components';
import {
    CategoryOption,
    CreateManyCookMenuCourseMealOptionsDocument,
    CreateOneCookMenuCourseDocument,
    DeleteOneCookMenuCourseMealOptionDocument,
    GetCookProfileMenuDocument,
    GetCookProfileMenuPageDataDocument,
    GetCookProfileMenuPageDataQuery,
    GetSignedInUserDocument,
    KitchenOption,
    SignedInUser,
    UpdateCookMenuBasePriceCustomersDocument,
    UpdateCookMenuBasePriceDocument,
    UpdateCookMenuPricePerAdultDocument,
    UpdateCookMenuPricePerChildDocument,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { ArrowLeft, HandCoins, Rows4, Soup } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEEditMenuCoursesForm } from '../../../components/PEEditMenuCoursesForm';
import { PEEditMenuPriceForm } from '../../../components/PEEditMenuPriceForm';
import { createApolloClient } from '../../../network/apolloClients';
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

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface ServerSideProps {
    initialSelectedTab: number;
    signedInUser: SignedInUser;
    categories: CategoryOption[];
    kitchens: KitchenOption[];
    meals: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['users']['signedInUser']>['cook']>['meals'];
    menu: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['cooks']['menus']>['findOne']>;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    const { menuId, tab } = query;

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
                initialSelectedTab: tab ? Number(tab) ?? 0 : 0,
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

export default function CookProfileMenuPage({
    initialSelectedTab,
    signedInUser,
    categories,
    kitchens,
    meals,
    menu: initialMenu,
}: ServerSideProps) {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(initialSelectedTab);

    function updateSelectedTab(changedTab: number) {
        if (changedTab === 0) {
            delete router.query.tab;
        } else {
            router.query.tab = String(changedTab);
        }
        router.push(router);
        setSelectedTab(changedTab);
    }

    const [menu, setMenu] = useState(initialMenu);

    const cookId = signedInUser.userId;
    const menuId = menu.menuId;

    const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]);
    const [selectedKitchen, setSelectedKitchen] = useState<KitchenOption | undefined>();
    const [preparationTime, setPreparationTime] = useState(
        preparationTimeOptions.find((o) => o.value === menu.preparationTime) ?? preparationTimeOptions[1],
    );

    const {
        register,
        formState: { errors },
    } = useForm<CreateMenuFormInputs>({
        defaultValues: {
            title: menu.title,
            description: menu.description,
        },
    });

    // , { loading: loadingUpdatedMenu }, { loading: loadingUpdatedMenu }
    const [getUpdatedMenu] = useLazyQuery(GetCookProfileMenuDocument, {
        variables: { cookId, menuId },
    });

    function updateMenu() {
        getUpdatedMenu().then(({ data }) => {
            const updatedMenu = data?.cooks.menus.findOne;
            if (!updatedMenu) return;
            setMenu(updatedMenu);
        });
    }

    const [requestBasePriceUpdate] = useMutation(UpdateCookMenuBasePriceDocument);
    const [requestBasePriceCustomersUpdate] = useMutation(UpdateCookMenuBasePriceCustomersDocument);
    const [requestPricePerAdultUpdate] = useMutation(UpdateCookMenuPricePerAdultDocument);
    const [requestPricePerChildUpdate] = useMutation(UpdateCookMenuPricePerChildDocument);

    const [requestMealOptionAdditions] = useMutation(CreateManyCookMenuCourseMealOptionsDocument);
    const [requestMealOptionRemoval] = useMutation(DeleteOneCookMenuCourseMealOptionDocument);
    const [requestCourseCreation] = useMutation(CreateOneCookMenuCourseDocument);

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-16">
                <PECookProfileNavigation current="MENUS" />

                <Link className="flex gap-2 text-gray-500" href="/chef-profile/menus">
                    <ArrowLeft strokeWidth={1} />
                    Zurück zur Menü Übersicht
                </Link>

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
                            onChange={(event) => updateSelectedTab(Number(event.target.value))}
                        >
                            {tabs.map((tab, index) => (
                                <option key={tab.name} value={index}>
                                    {tab.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="hidden sm:block">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map((tab, index) => (
                                    <button
                                        key={tab.name}
                                        onClick={() => updateSelectedTab(index)}
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
                            errorMessage={errors.title?.message}
                            {...register('title', {
                                required: 'Dein Menü braucht noch einen Namen.',
                                minLength: {
                                    value: 5,
                                    message: 'Der Name deines Menüs ist zu kurz.',
                                },
                            })}
                        />

                        <PETextArea
                            id="description"
                            labelTitle="Beschreibung"
                            errorMessage={errors.description?.message}
                            {...register('description', { required: 'Dein Menü braucht noch eine Beschreibung.' })}
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
                            {...register('isVisible')}
                        />
                    </>
                )}

                {selectedTab === 1 && (
                    <PEEditMenuCoursesForm
                        menu={menu}
                        meals={meals}
                        onAddMealToCourse={(courseId, mealOption) =>
                            requestMealOptionAdditions({ variables: { cookId, menuId, courseId, mealOptions: [mealOption] } }).then(
                                updateMenu,
                            )
                        }
                        onRemoveMealFromCourse={({ mealId, courseId }) =>
                            requestMealOptionRemoval({ variables: { cookId, menuId, courseId, mealId } }).then(updateMenu)
                        }
                        onCreateCourse={({ title, mealOptions }) =>
                            requestCourseCreation({
                                variables: {
                                    cookId,
                                    menuId,
                                    request: {
                                        index: menu.courses.length,
                                        title,
                                        mealOptions: mealOptions.map(({ mealId }, index) => ({ index, mealId })),
                                    },
                                },
                            }).then(updateMenu)
                        }
                    />
                )}

                {selectedTab === 2 && (
                    <PEEditMenuPriceForm
                        menu={menu}
                        onChange={({ basePrice, basePriceCustomers, pricePerAdult, pricePerChild }) => {
                            Promise.all([
                                requestBasePriceUpdate({ variables: { cookId, menuId, basePrice: basePrice * 100 } }),
                                requestBasePriceCustomersUpdate({ variables: { cookId, menuId, basePriceCustomers } }),
                                requestPricePerAdultUpdate({ variables: { cookId, menuId, pricePerAdult: pricePerAdult * 100 } }),
                                requestPricePerChildUpdate({
                                    variables: { cookId, menuId, pricePerChild: pricePerChild ? pricePerChild * 100 : undefined },
                                }),
                            ]).then(updateMenu);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
