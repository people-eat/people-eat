import {
    PEButton,
    PECheckbox,
    PELabelMultiSelection,
    PELabelSingleSelection,
    PESingleSelection,
    PETextArea,
    PETextField,
} from '@people-eat/web-core-components';
import { CategoryOption, GetCookProfileMenuPageDataQuery, KitchenOption } from '@people-eat/web-domain';
import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export interface PEEditMenuCommonFormInputs {
    title: string;
    description: string;
    kitchen?: KitchenOption;
    categories: CategoryOption[];
    preparationTime: number;
    isVisible: boolean;
}

export interface PEEditMenuCommonProps {
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

export function PEEditMenuCommon({ menu, categories: categoryOptions, kitchens }: PEEditMenuCommonProps) {
    const [editModeOn, setEditModeOn] = useState(false);

    const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<PEEditMenuCommonFormInputs>({
        defaultValues: {
            title: menu.title,
            description: menu.description,
            categories: menu.categories,
            kitchen: menu.kitchen ?? undefined,
            preparationTime: menu.preparationTime,
            isVisible: menu.isVisible,
        },
    });

    const { title, description, kitchen, categories, preparationTime, isVisible } = watch();

    function onSave(data: PEEditMenuCommonFormInputs) {}

    const changesToBeSaved =
        title !== menu.title ||
        description !== menu.description ||
        kitchen?.kitchenId !== menu.kitchen?.kitchenId ||
        preparationTime !== menu.preparationTime ||
        isVisible !== menu.isVisible;

    if (editModeOn) {
        return (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
                <div className="flex gap-4">
                    <PEButton title="Abbrechen" type="secondary" onClick={() => setEditModeOn(false)} />
                    {changesToBeSaved && <PEButton title="Speichern" onClick={() => setEditModeOn(false)} />}
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
                        options={categoryOptions}
                        selectedOptions={categories}
                        selectedOptionsChanged={() => undefined}
                        optionTitle={({ title }) => title}
                        optionIdentifier={({ categoryId }) => categoryId}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <span>Küche</span>
                    <PELabelSingleSelection
                        options={kitchens}
                        selectedOption={kitchen}
                        selectedOptionChanged={() => undefined}
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
                    id="isVisible"
                    label={{ title: 'Menü ist privat und nur für dich einsehbar' }}
                    {...register('isVisible', { setValueAs: (v) => Boolean(v) })}
                />
            </form>
        );
    }

    return (
        <section className="flex flex-col gap-4">
            <div>
                <PEButton title="Bearbeiten" type="secondary" onClick={() => setEditModeOn(true)} />
            </div>
            <h1 className="text-2xl font-bold">{menu.title}</h1>
            {menu.kitchen && <p className="text-gray-500 font-bold">{menu.kitchen.title}</p>}

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
        </section>
    );
}
