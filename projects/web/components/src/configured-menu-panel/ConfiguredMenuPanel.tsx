import { ConfiguredMenuFragment } from '@people-eat/web-domain';
import { useState } from 'react';
import { MealCard } from '../_cards/meal-card/MealCard';
import { MealDetailsDialog } from '../MealDetailsDialog';

export interface ConfiguredMenuPanelProps {
    configuredMenu: ConfiguredMenuFragment;
}

export function ConfiguredMenuPanel({ configuredMenu }: ConfiguredMenuPanelProps) {
    const [selectedMeal, setSelectedMeal] = useState<
        | undefined
        | {
              title: string;
              description: string;
              imageUrl?: string | null;
          }
    >(undefined);

    return (
        <>
            <div className="flex flex-col gap-8 overflow-y-auto p-4">
                <h2 className="text-2xl font-bold">{configuredMenu.title}</h2>
                {configuredMenu.description && <h3>{configuredMenu.description}</h3>}
                {configuredMenu.greetingFromKitchen && configuredMenu.greetingFromKitchen !== '' && (
                    <div>{configuredMenu.greetingFromKitchen}</div>
                )}
                <div className="flex flex-col gap-4">
                    {configuredMenu.courses.map((course) => (
                        <div key={course.index} className="flex flex-col gap-4 ml-2">
                            <div>{course.title}</div>
                            <ul className="grid grid-cols-1 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                                <MealCard
                                    key={course.index}
                                    type="SIMPLE"
                                    title={course.mealTitle}
                                    description={course.mealDescription}
                                    imageUrl={course.mealImageUrl ?? undefined}
                                    onInfoClick={() =>
                                        setSelectedMeal({
                                            title: course.mealTitle,
                                            description: course.mealDescription,
                                            imageUrl: course.mealImageUrl ?? undefined,
                                        })
                                    }
                                />
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMeal && <MealDetailsDialog onClose={() => setSelectedMeal(undefined)} meal={selectedMeal} />}
        </>
    );
}
