import { MealType, mealTypeTranslations, mealTypes } from '@people-eat/web-domain';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { PEButton, PELabelMultiSelection, PETextField } from '../_core';
import { MealCard } from '../cards/meal-card/MealCard';
import { MealDetailsDialog } from '../MealDetailsDialog';

export interface CreateMenuCourseFormProps {
    meals: {
        mealId: string;
        cookId: string;
        title: string;
        type: MealType;
        description: string;
        imageUrl?: string | null;
        createdAt: Date;
    }[];
    onCreateMeal?: () => void;
    onCreate: (data: CreateMenuCourseFormInputs) => void;
}

export interface CreateMenuCourseFormInputs {
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
}

export function CreateMenuCourseForm({ meals, onCreateMeal, onCreate }: CreateMenuCourseFormProps) {
    const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
    const filteredMeals = selectedMealTypes.length > 0 ? meals.filter(({ type }) => selectedMealTypes.includes(type)) : meals;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateMenuCourseFormInputs>({
        defaultValues: {
            mealOptions: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'mealOptions',
        rules: {
            required: 'Es muss mindestens ein Gericht ausgewählt sein.',
            minLength: 1,
        },
    });

    const [selectedMeal, setSelectedMeal] = useState<
        | undefined
        | {
              title: string;
              description: string;
              imageUrl?: string | null;
          }
    >(undefined);

    return (
        <form onSubmit={handleSubmit((data) => onCreate(data))} className="flex flex-col gap-8">
            <p className="font-semibold text-xl">Wie möchtest du deinen Gang nennen?</p>

            <PETextField
                id="title"
                placeholder="Vorspeise - Hauptgang - Dessert"
                type="text"
                errorMessage={errors.title?.message}
                {...register('title', {
                    required: 'Dein Gang braucht noch einen Namen.',
                    minLength: {
                        value: 5,
                        message: 'Der Name deines Gangs ist zu kurz.',
                    },
                })}
            />

            <p className="font-semibold text-xl">Welche Gerichte möchtest du in diesem Gang anbieten?</p>

            <PELabelMultiSelection
                options={mealTypes}
                selectedOptions={selectedMealTypes}
                selectedOptionsChanged={setSelectedMealTypes}
                optionTitle={(mealType) => mealTypeTranslations[mealType]}
                optionIdentifier={(mealType) => mealType}
            />

            {filteredMeals.length < 1 && (
                <>
                    <p>Für die ausgewählten Kategorien scheinst du noch keine Gerichte erstellt zu haben.</p>
                    <p>Füge einer dieser Kategorien jetzt dein erstes Gericht hinzu.</p>
                </>
            )}

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                {filteredMeals.map((meal) => (
                    <MealCard
                        type="SELECTION"
                        key={meal.mealId}
                        title={meal.title}
                        description={meal.description}
                        imageUrl={meal.imageUrl}
                        selected={fields.some((selected) => selected.mealId === meal.mealId)}
                        onSelect={() => append(meal)}
                        onDeselect={() => remove(fields.findIndex((f) => f.mealId === meal.mealId))}
                        onInfoClick={() => setSelectedMeal(meal)}
                    />
                ))}
            </ul>

            {selectedMeal && <MealDetailsDialog onClose={() => setSelectedMeal(undefined)} meal={selectedMeal} />}

            {onCreateMeal && <PEButton title="Neues Gericht erstellen" type="secondary" onClick={onCreateMeal} />}

            <PEButton title="Gang erstellen" type="submit" />

            {errors.mealOptions?.root?.message && (
                <span className="ml-2 text-sm font-semibold text-red-500">{errors.mealOptions?.root?.message}</span>
            )}
        </form>
    );
}
