import { MealCard } from '@people-eat/web-components';
import { PEDialog, PELabelMultiSelection } from '@people-eat/web-core-components';
import { MealType, mealTypeTranslations, mealTypes } from '@people-eat/web-domain';
import { useState } from 'react';

interface Meal {
    mealId: string;
    title: string;
    description: string;
    type: MealType;
    imageUrl?: string | null;
}

export interface PEAddMealToCourseDialogProps {
    open: boolean;
    meals: Meal[];
    selectedMeals: Meal[];
    onAdd: (selectedMeal: string) => void;
}

export function PEAddMealToCourseDialog({ open, meals, selectedMeals, onAdd }: PEAddMealToCourseDialogProps) {
    const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
    const filteredMeals = (selectedMealTypes.length > 0 ? meals.filter(({ type }) => selectedMealTypes.includes(type)) : meals).filter(
        (meal) => !selectedMeals.some((selected) => selected.mealId === meal.mealId),
    );
    return (
        <PEDialog open={open}>
            <div className="bg-white p-8 rounded-2xl w-full flex flex-col gap-8">
                <p className="font-semibold text-xl">Gericht hinzufügen</p>

                <PELabelMultiSelection
                    options={mealTypes}
                    selectedOptions={selectedMealTypes}
                    selectedOptionsChanged={setSelectedMealTypes}
                    optionTitle={(mealType) => mealTypeTranslations[mealType]}
                    optionIdentifier={(mealType) => mealType}
                />

                {selectedMealTypes.length > 0 && (
                    <>
                        <p>Für die ausgewählten Kategorien scheinst du noch keine Gerichte erstellt zu haben.</p>
                        <p>Füge einer dieser Kategorien jetzt dein erstes Gericht hinzu.</p>
                    </>
                )}

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                    {filteredMeals.map((meal) => (
                        <MealCard
                            key={meal.mealId}
                            type="BUTTON"
                            button={{
                                title: 'Hinzufügen',
                                type: 'SECONDARY',
                                onClick: () => onAdd(meal.mealId),
                            }}
                            title={meal.title}
                            description={meal.description}
                            imageUrl={meal.imageUrl}
                            onInfoClick={() => undefined}
                        />
                    ))}
                </ul>
            </div>
        </PEDialog>
    );
}
