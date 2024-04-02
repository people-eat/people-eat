import { CreateMenuCourseForm, MealCard } from '@people-eat/web-components';
import { PEButton, PEDialog } from '@people-eat/web-core-components';
import { GetCookProfileMenuPageDataQuery, Unpacked } from '@people-eat/web-domain';
import classNames from 'classnames';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEAddMealToCourseDialog } from './PEAddMealToCourseDialog';

interface PEEditMenuCoursesFormInputs {
    greetingFromKitchen: string;
}

export interface PEEditMenuCoursesFormProps {
    menu: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['cooks']['menus']>['findOne']>;
    meals: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['users']['signedInUser']>['cook']>['meals'];
    onAddMealToCourse: (mealId: string) => void;
    onRemoveMealFromCourse: (mealId: string) => void;
}

export function PEEditMenuCoursesForm({ menu, meals, onAddMealToCourse, onRemoveMealFromCourse }: PEEditMenuCoursesFormProps) {
    const [greetingFromKitchenEnabled, setGreetingFromKitchenEnabled] = useState<boolean>(false);
    const [coursesInEditMode, setCoursesInEditMode] = useState(false);

    const [selectedCourse, setSelectedCourse] = useState<
        Unpacked<NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['cooks']['menus']>['findOne']>['courses']> | undefined
    >();

    const [createCourseDialogOpen, setCreateCourseDialogOpen] = useState(false);
    const [addMealToCourseDialogOpen, setAddMealToCourseDialogOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PEEditMenuCoursesFormInputs>({
        defaultValues: {
            greetingFromKitchen: '',
        },
    });

    const { greetingFromKitchen } = watch();

    return (
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
                                onClick={() => {
                                    setSelectedCourse(course);
                                    setAddMealToCourseDialogOpen(true);
                                }}
                            >
                                <Plus className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                                <span className="mt-2 block text-sm text-gray-900">Gericht hinzufügen</span>
                            </button>
                        )}
                        {course.mealOptions.map((mealOption) => (
                            <div key={mealOption.index}>
                                {coursesInEditMode && (
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
                                )}
                                {!coursesInEditMode && (
                                    <MealCard
                                        type="SIMPLE"
                                        key={mealOption.meal.mealId}
                                        title={mealOption.meal.title}
                                        description={mealOption.meal.description}
                                        imageUrl={mealOption.meal.imageUrl}
                                        onInfoClick={() => undefined}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {coursesInEditMode && (
                        <button
                            type="button"
                            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            onClick={() => setCreateCourseDialogOpen(true)}
                        >
                            <Plus className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                            <span className="mt-2 block text-sm text-gray-900">Gang hinzufügen</span>
                        </button>
                    )}
                </div>
            ))}

            <div className="flex justify-end gap-4">
                {!coursesInEditMode && <PEButton title="Bearbeiten" onClick={() => setCoursesInEditMode(true)} type="secondary" />}
                {coursesInEditMode && (
                    <>
                        <PEButton title="Abbrechen" type="secondary" onClick={() => setCoursesInEditMode(false)} />
                        <PEButton title="Speichern" onClick={() => setCoursesInEditMode(false)} />
                    </>
                )}
            </div>

            <PEDialog open={createCourseDialogOpen}>
                <div className="bg-white p-8 rounded-2xl w-full flex flex-col gap-8">
                    <CreateMenuCourseForm
                        meals={meals}
                        // onCreateMeal={() => setCreateMealDialogOpen(true)}
                        onCreate={(data) => {
                            // append(data);
                            setCreateCourseDialogOpen(false);
                        }}
                    />
                </div>
            </PEDialog>

            <PEAddMealToCourseDialog
                open={addMealToCourseDialogOpen}
                meals={meals}
                selectedMeals={selectedCourse?.mealOptions ?? []}
                onAdd={onAddMealToCourse}
            />
        </>
    );
}
