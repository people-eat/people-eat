import { MealCard, MealDetailsDialog } from '@people-eat/web-components';
import { PEDialog, PELabelMultiSelection } from '@people-eat/web-core-components';
import { MealType, mealTypeTranslations, mealTypes } from '@people-eat/web-domain';
import { useState } from 'react';

interface Meal {
    mealId: string;
    cookId: string;
    title: string;
    type: MealType;
    description: string;
    imageUrl?: string | null;
    createdAt: Date;
}

export interface PEAddMealToCourseDialogProps {
    open: boolean;
    onClose: () => void;
    meals: Meal[];
    selectedMealIds: string[];
    onAdd: (selectedMeal: Meal) => void;
}

export function PEAddMealToCourseDialog({ open, onClose, meals, selectedMealIds, onAdd }: PEAddMealToCourseDialogProps) {
    const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
    const filteredMeals = (selectedMealTypes.length > 0 ? meals.filter(({ type }) => selectedMealTypes.includes(type)) : meals).filter(
        (meal) => !selectedMealIds.some((selected) => selected === meal.mealId),
    );

    const [selectedMeal, setSelectedMeal] = useState<
        | undefined
        | {
              title: string;
              description: string;
              imageUrl?: string | null;
          }
    >(undefined);

    return (
        <PEDialog open={open} onClose={onClose} title="Gericht hinzufügen">
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
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                {filteredMeals.map((meal) => (
                    <MealCard
                        key={meal.mealId}
                        type="BUTTON"
                        button={{
                            title: 'Hinzufügen',
                            type: 'SECONDARY',
                            onClick: () => onAdd(meal),
                        }}
                        title={meal.title}
                        description={meal.description}
                        imageUrl={meal.imageUrl}
                        onInfoClick={() => setSelectedMeal(meal)}
                    />
                ))}
            </ul>

            {selectedMeal && <MealDetailsDialog onClose={() => setSelectedMeal(undefined)} meal={selectedMeal} />}
        </PEDialog>
    );
}
