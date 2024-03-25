import { MealCard, PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import {
    PEButton,
    PECheckbox,
    PELabelMultiSelection,
    PELabelSingleSelection,
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
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { HandCoins, Plus, Rows4, Soup } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { PEEditMenuPriceForm } from '../../../components/PEEditMenuPriceForm';
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
    const [preparationTime, setPreparationTime] = useState(
        preparationTimeOptions.find((o) => o.value === menu.preparationTime) ?? preparationTimeOptions[1],
    );

    const [coursesInEditMode, setCoursesInEditMode] = useState(false);

    const {
        register,
        formState: { errors },
    } = useForm<CreateMenuFormInputs>({
        defaultValues: {
            title: menu.title,
            description: menu.description,
        },
    });

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
                            onChange={(event) => setSelectedTab(Number(event.target.value))}
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

                {selectedTab === 2 && <PEEditMenuPriceForm menu={menu} onChange={() => undefined} />}
            </div>
        </div>
    );
}
