import { Dialog, Transition } from '@headlessui/react';
import { MealCard, PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import { PEButton, PELabelMultiSelection, PELabelSingleSelection, PELink, PETextArea, PETextField } from '@people-eat/web-core-components';
import {
    GetCookProfileMealsPageDataDocument,
    GetCookProfileMealsPageDataQuery,
    GetSignedInUserDocument,
    MealType,
    SignedInUser,
    Unpacked,
    mealTypeTranslations,
    mealTypes,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { Trash, Upload, X } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEProfileCard } from '../../../components/PEProfileCard';
import { createApolloClient } from '../../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface EditMealFormInputs {
    title: string;
    description: string;
    type: MealType;
}

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialMeals: GetCookProfileMealsPageDataQuery['cooks']['meals']['findMany'];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;
        const cookId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetCookProfileMealsPageDataDocument, variables: { cookId } });

        return {
            props: {
                signedInUser,
                initialMeals: result.data.cooks.meals.findMany,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function CookProfileMealsPage({ signedInUser, initialMeals }: ServerSideProps) {
    const [meals] = useState(initialMeals);
    const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);

    const filteredMeals = selectedMealTypes.length > 0 ? meals.filter(({ type }) => selectedMealTypes.includes(type)) : meals;

    const [selectedMeal, setSelectedMeal] = useState<
        Unpacked<GetCookProfileMealsPageDataQuery['cooks']['meals']['findMany']> | undefined
    >();

    const [showDeleteMealAlert, setShowDeleteMealAlert] = useState(false);
    const [showUpdateImageDialog, setShowUpdateImageDialog] = useState(false);
    const [editSelectedMealOn, setEditSelectedMealOn] = useState(false);

    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm<EditMealFormInputs>();

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PECookProfileNavigation current="MEALS" />

                <PEProfileCard className="flex gap-8 justify-between items-center">
                    <PELabelMultiSelection
                        options={mealTypes}
                        selectedOptions={selectedMealTypes}
                        selectedOptionsChanged={setSelectedMealTypes}
                        optionTitle={(mealType) => mealTypeTranslations[mealType]}
                        optionIdentifier={(mealType) => mealType}
                    />
                    <div>
                        <PELink title="Neues Gericht" href="/chef-profile/meals/create" className="hidden lg:inline" />
                        <PELink title="+" href="/chef-profile/meals/create" className="lg:hidden" />
                    </div>
                </PEProfileCard>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                    {filteredMeals.map(({ mealId, type, title, description, imageUrl, createdAt }) => (
                        <MealCard
                            key={mealId}
                            type="SIMPLE"
                            title={title}
                            description={description}
                            imageUrl={imageUrl}
                            onInfoClick={() => {
                                setSelectedMeal({ mealId, type, title, description, imageUrl, createdAt });
                                setValue('title', title);
                                setValue('description', description);
                                setValue('type', type);
                            }}
                        />
                    ))}
                </ul>

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
                                                {!editSelectedMealOn && (
                                                    <button
                                                        type="button"
                                                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                                                        onClick={() => setSelectedMeal(undefined)}
                                                    >
                                                        <span className="sr-only">Close</span>
                                                        <X className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                )}

                                                <form
                                                    className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8"
                                                    onSubmit={handleSubmit((data) => undefined)}
                                                >
                                                    {editSelectedMealOn && (
                                                        <section className="flex gap-2 col-span-full">
                                                            <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                                                                Gericht bearbeiten
                                                            </h2>
                                                        </section>
                                                    )}

                                                    <div className="sm:col-span-4 lg:col-span-5 flex flex-col gap-4">
                                                        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                                                            <Image
                                                                unoptimized
                                                                src={selectedMeal.imageUrl ?? '/placeholders/meal.png'}
                                                                alt=""
                                                                className="object-cover object-center"
                                                                width={600}
                                                                height={600}
                                                            />
                                                        </div>
                                                        {editSelectedMealOn && (
                                                            <div className="flex gap-8 justify-center">
                                                                <button onClick={() => setShowDeleteMealAlert(true)}>
                                                                    <Trash color="red" />
                                                                </button>
                                                                <button onClick={() => setShowUpdateImageDialog(true)}>
                                                                    <Upload />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className={classNames('sm:col-span-8 lg:col-span-7', 'flex flex-col gap-6')}>
                                                        {!editSelectedMealOn && (
                                                            <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                                                                {selectedMeal.title}
                                                            </h2>
                                                        )}

                                                        {editSelectedMealOn && (
                                                            <PETextField
                                                                id="title"
                                                                labelTitle="Name"
                                                                type="text"
                                                                errorMessage={errors.title?.message}
                                                                {...register('title', {
                                                                    required: 'Dein Gericht braucht noch einen Namen.',
                                                                    minLength: {
                                                                        value: 5,
                                                                        message:
                                                                            'Der Name des Gerichts muss mindestens 5 Zeichen lang sein',
                                                                    },
                                                                })}
                                                            />
                                                        )}

                                                        {editSelectedMealOn && (
                                                            <PETextArea
                                                                id="description"
                                                                labelTitle="Beschreibung"
                                                                errorMessage={errors.description?.message}
                                                                {...register('description', {
                                                                    required: 'Dein Gericht braucht noch eine Beschreibung.',
                                                                })}
                                                            />
                                                        )}

                                                        {!editSelectedMealOn && <p>{selectedMeal.description}</p>}

                                                        {editSelectedMealOn && (
                                                            <div>
                                                                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                                    Gerichtsart
                                                                </label>
                                                                <PELabelSingleSelection
                                                                    options={mealTypes}
                                                                    selectedOption={getValues().type}
                                                                    selectedOptionChanged={(type) =>
                                                                        type && setValue('type', type, { shouldValidate: true })
                                                                    }
                                                                    optionTitle={(mealType) => mealTypeTranslations[mealType]}
                                                                    optionIdentifier={(mealType) => mealType}
                                                                />
                                                            </div>
                                                        )}

                                                        {!editSelectedMealOn && (
                                                            <p className="text-gray-500">{mealTypeTranslations[selectedMeal.type]}</p>
                                                        )}
                                                    </div>

                                                    <section className="flex justify-end gap-2 col-span-full">
                                                        {!editSelectedMealOn && (
                                                            <PEButton
                                                                title="Bearbeiten"
                                                                type="secondary"
                                                                onClick={() => setEditSelectedMealOn(true)}
                                                            />
                                                        )}
                                                        {editSelectedMealOn && (
                                                            <>
                                                                <PEButton
                                                                    title="Abbrechen"
                                                                    type="secondary"
                                                                    onClick={() => setEditSelectedMealOn(false)}
                                                                />
                                                                <PEButton title="Speichern" type="submit" />
                                                            </>
                                                        )}
                                                    </section>
                                                </form>
                                            </div>
                                        )}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </div>
        </div>
    );
}
