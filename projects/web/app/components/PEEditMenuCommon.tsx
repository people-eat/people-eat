import { useMutation } from '@apollo/client';
import {
    PEAlert,
    PEButton,
    PECheckbox,
    PELabelMultiSelection,
    PELabelSingleSelection,
    PESingleSelection,
    PETextArea,
    PETextField,
} from '@people-eat/web-components';
import {
    CategoryOption,
    DeleteOneCookMenuDocument,
    GetCookProfileMenuPageDataQuery,
    KitchenOption,
    UpdateCookMenuDescriptionDocument,
    UpdateCookMenuIsVisibleDocument,
    UpdateCookMenuKeyMealOptionDocument,
    UpdateCookMenuKitchenIdDocument,
    UpdateCookMenuPreparationTimeDocument,
    UpdateCookMenuTitleDocument,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export interface PEEditMenuCommonFormInputs {
    title: string;
    description: string;
    kitchen?: KitchenOption;
    categories: CategoryOption[];
    preparationTime: number;
    isVisible: boolean;
    keyMealOption?: {
        imageUrl: string;
        courseId: string;
        index: number;
    };
}

export interface PEEditMenuCommonProps {
    cookId: string;
    onChangesApplied: () => void;
    menu: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['cooks']['menus']>['findOne']>;
    categories: CategoryOption[];
    kitchens: KitchenOption[];
}

const preparationTimeOptions = [
    { value: 30, label: '30min' },
    { value: 45, label: '45min' },
    { value: 60, label: '1h' },
    { value: 90, label: '1h 30min' },
    { value: 120, label: '2h' },
];

function compareSets<T>(xs: Set<T>, ys: Set<T>): boolean {
    return xs.size === ys.size && [...xs].every((x) => ys.has(x));
}

export function PEEditMenuCommon({ cookId, onChangesApplied, menu, categories: categoryOptions, kitchens }: PEEditMenuCommonProps) {
    const menuId = menu.menuId;

    const router = useRouter();

    const [editModeOn, setEditModeOn] = useState(false);

    const {
        register,
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<PEEditMenuCommonFormInputs>({
        defaultValues: {
            title: menu.title,
            description: menu.description,
            categories: menu.categories,
            kitchen: menu.kitchen ?? undefined,
            preparationTime: menu.preparationTime,
            isVisible: menu.isVisible,
            keyMealOption: menu.imageUrl
                ? {
                      imageUrl: menu.imageUrl,
                      courseId: '',
                      index: 0,
                  }
                : undefined,
        },
    });

    const { fields: categories, append, remove } = useFieldArray({ control, name: 'categories' });

    const { title, description, kitchen, preparationTime, isVisible, keyMealOption } = watch();

    const [requestTitleUpdate] = useMutation(UpdateCookMenuTitleDocument);
    const [requestDescriptionUpdate] = useMutation(UpdateCookMenuDescriptionDocument);
    // const [] = useMutation(UpdateCookMenuKitchenIdDocument);
    const [requestKitchenUpdate] = useMutation(UpdateCookMenuKitchenIdDocument);
    const [requestPreparationTimeUpdate] = useMutation(UpdateCookMenuPreparationTimeDocument);
    const [requestIsVisibleUpdate] = useMutation(UpdateCookMenuIsVisibleDocument);
    const [requestKeyMealOptionUpdate] = useMutation(UpdateCookMenuKeyMealOptionDocument);
    const [deleteMenu] = useMutation(DeleteOneCookMenuDocument);

    function onSave() {
        if (title !== menu.title) requestTitleUpdate({ variables: { cookId, menuId, title } }).then(onChangesApplied);
        if (description !== menu.description)
            requestDescriptionUpdate({ variables: { cookId, menuId, description } }).then(onChangesApplied);
        if (kitchen?.kitchenId !== menu.kitchen?.kitchenId)
            requestKitchenUpdate({ variables: { cookId, menuId, kitchenId: kitchen?.kitchenId } }).then(onChangesApplied);
        if (preparationTime !== menu.preparationTime)
            requestPreparationTimeUpdate({ variables: { cookId, menuId, preparationTime } }).then(onChangesApplied);
        if (isVisible !== menu.isVisible) requestIsVisibleUpdate({ variables: { cookId, menuId, isVisible } }).then(onChangesApplied);

        if (keyMealOption?.imageUrl !== menu.imageUrl)
            requestKeyMealOptionUpdate({
                variables: {
                    cookId,
                    menuId,
                    keyMealOption: keyMealOption ? { courseId: keyMealOption.courseId, index: keyMealOption.index } : undefined,
                },
            }).then(onChangesApplied);

        setEditModeOn(false);
    }

    const [showDeleteMenuAlert, setShowDeleteMenuAlert] = useState(false);

    async function onDelete() {
        const { data } = await deleteMenu({ variables: { cookId, menuId } });
        if (!data?.cooks.menus.success) return;
        router.push('/profile/menus');
    }

    const originalCategoryIdSet = new Set(menu.categories.map(({ categoryId }) => categoryId));
    const categoryIdSet = new Set(categories.map(({ categoryId }) => categoryId));
    const changesToBeSaved =
        title !== menu.title ||
        description !== menu.description ||
        kitchen?.kitchenId !== menu.kitchen?.kitchenId ||
        preparationTime !== menu.preparationTime ||
        isVisible !== menu.isVisible ||
        !compareSets(originalCategoryIdSet, categoryIdSet) ||
        keyMealOption?.imageUrl !== menu.imageUrl;

    if (editModeOn) {
        return (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
                <div className="flex gap-4">
                    <PEButton
                        title="Abbrechen"
                        type="secondary"
                        onClick={() => {
                            setEditModeOn(false);
                            reset();
                        }}
                    />
                    {changesToBeSaved && <PEButton title="Speichern" type="submit" />}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {menu.courses.map((course, courseIndex) =>
                        course.mealOptions.map((mealOption, mealOptionIndex) => (
                            <>
                                {mealOption.meal.imageUrl && (
                                    <Image
                                        key={mealOptionIndex}
                                        src={mealOption.meal.imageUrl}
                                        alt=""
                                        width={400}
                                        height={400}
                                        className={classNames('rounded-2xl shadow-lg', {
                                            'ring-2 ring-orange-600': keyMealOption?.imageUrl === mealOption.meal.imageUrl,
                                        })}
                                        onClick={() =>
                                            setValue('keyMealOption', {
                                                imageUrl: mealOption.meal.imageUrl!,
                                                courseId: course.courseId,
                                                index: mealOption.index,
                                            })
                                        }
                                    />
                                )}
                            </>
                        )),
                    )}
                </div>

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
                    {...register('description')}
                />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <span>Kategorien</span>
                    <PELabelMultiSelection
                        options={categoryOptions}
                        selectedOptions={categories}
                        onSelect={(o) => append(o)}
                        onDeselect={(o) => remove(categories.findIndex((c) => c.categoryId === o.categoryId))}
                        optionTitle={({ title }) => title}
                        optionIdentifier={({ categoryId }) => categoryId}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <span>Küche</span>
                    <PELabelSingleSelection
                        options={kitchens}
                        selectedOption={kitchen}
                        selectedOptionChanged={(o) => {
                            setValue('kitchen', o);
                        }}
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
                    selectedOption={preparationTimeOptions.find((o) => o.value === preparationTime)!}
                    selectedOptionChanged={(o) => o && setValue('preparationTime', o.value)}
                    optionTitle={({ label }) => label}
                    optionIdentifier={({ value }) => `${value}`}
                    className="w-[400px]"
                />

                <PECheckbox
                    className="mt-8"
                    id="isVisible"
                    label={{ title: isVisible ? 'Menü ist veröffentlicht' : 'Menü ist privat und nur für dich einsehbar' }}
                    {...register('isVisible')}
                />
            </form>
        );
    }

    return (
        <section className="flex flex-col gap-8">
            <div className="flex gap-4 justify-between">
                <PEButton title="Bearbeiten" type="secondary" onClick={() => setEditModeOn(true)} />
                <button className="text-gray-500" onClick={() => setShowDeleteMenuAlert(true)} type="button">
                    Menü löschen
                </button>
            </div>

            {menu.imageUrl && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Image src={menu.imageUrl} alt="" width={400} height={400} className="rounded-2xl shadow-lg" />
                </div>
            )}

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{menu.title}</h1>
                {menu.kitchen && <p className="text-gray-500 font-bold">{menu.kitchen.title}</p>}
            </div>

            <p className="text-gray-500">{menu.description}</p>

            <ul className="flex flex-wrap gap-2">
                {menu.categories.map(({ categoryId, title }) => (
                    <li
                        key={categoryId}
                        className={classNames('px-4 py-2.5', 'text-sm font-semibold text-white', 'rounded-full bg-orange-500 shadow-sm')}
                    >
                        {title}
                    </li>
                ))}
            </ul>

            <PEAlert
                open={showDeleteMenuAlert}
                type="DELETION"
                title="Bist du dir sicher dass du dieses Menü löschen möchtest?"
                subtitle="Diese Aktion kann nicht rückgaängig gemacht werden."
                primaryButton={{ title: 'Löschen', onClick: onDelete }}
                secondaryButton={{ title: 'Abbrechen', onClick: () => setShowDeleteMenuAlert(false) }}
            />

            <span className="font-semibold">
                Vorbereitungszeit von {preparationTimeOptions.find((o) => o.value === menu.preparationTime)?.label}
            </span>

            <span className="font-semibold">{isVisible ? 'Menü ist veröffentlicht' : 'Menü ist privat und nur für dich einsehbar'}</span>
        </section>
    );
}
