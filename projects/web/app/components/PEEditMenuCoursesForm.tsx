import { useMutation } from '@apollo/client';
import { CreateMenuCourseForm, MealCard, MealDetailsDialog } from '@people-eat/web-components';
import { PEButton, PEDialog, PELabelSingleSelection, PETextField } from '@people-eat/web-components';
import {
    GetCookProfileMenuPageDataQuery,
    Unpacked,
    UpdateCookMenuCourseTitleDocument,
    UpdateCookMenuGreetingFromKitchenDocument,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { Plus, Save } from 'lucide-react';
import { CreateMenuCourseFormInputs } from 'projects/web/components/src/_forms/CreateMenuCourseForm';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { PEAddMealToCourseDialog } from './PEAddMealToCourseDialog';

interface PEEditMenuCoursesFormInputs {
    greetingFromKitchen: string;
    greetingFromKitchenEnabled: boolean;
    courseTitles: {
        title: string;
    }[];
}

export interface PEEditMenuCoursesFormProps {
    cookId: string;
    menu: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['cooks']['menus']>['findOne']>;
    meals: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['sessions']['current']['user']>['cook']>['meals'];
    onCreateCourse: (data: CreateMenuCourseFormInputs, index: number) => void;
    onRemoveCourse: (courseId: string) => void;
    onAddMealToCourse: (courseId: string, mealOption: { mealId: string; index: number }) => void;
    onRemoveMealFromCourse: (mealOption: { mealId: string; courseId: string }) => void;
    updateNeeded: () => void;
}

export function PEEditMenuCoursesForm({
    cookId,
    menu,
    meals,
    onCreateCourse,
    onRemoveCourse,
    onAddMealToCourse,
    onRemoveMealFromCourse,
    updateNeeded,
}: PEEditMenuCoursesFormProps) {
    const [coursesInEditMode, setCoursesInEditMode] = useState(false);

    // used for:
    // 1. store a course to be deleted while the popup is open
    // 2. store a course to append a new course after
    const [selectedCourse, setSelectedCourse] = useState<
        Unpacked<NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['cooks']['menus']>['findOne']>['courses']> | undefined
    >();

    const [createCourseDialogOpen, setCreateCourseDialogOpen] = useState(false);
    const [addMealToCourseDialogOpen, setAddMealToCourseDialogOpen] = useState(false);

    const [selectedMeal, setSelectedMeal] = useState<
        | undefined
        | {
              title: string;
              description: string;
              imageUrl?: string | null;
          }
    >(undefined);

    const {
        register,
        watch,
        formState: { errors },
        setValue,
        control,
    } = useForm<PEEditMenuCoursesFormInputs>({
        defaultValues: {
            greetingFromKitchen: menu.greetingFromKitchen ?? '',
            greetingFromKitchenEnabled: menu.greetingFromKitchen !== null && menu.greetingFromKitchen !== undefined,
            courseTitles: menu.courses.map(({ title }) => ({ title })),
        },
    });

    const { fields: courseTitles } = useFieldArray({ control, name: 'courseTitles' });

    const { courseTitles: liveCourseTitles, greetingFromKitchenEnabled, greetingFromKitchen } = watch();

    const [requestCourseTitleUpdate] = useMutation(UpdateCookMenuCourseTitleDocument);
    const [requestGreetingFromKitchenUpdate] = useMutation(UpdateCookMenuGreetingFromKitchenDocument, {
        variables: { cookId, menuId: menu.menuId, greetingFromKitchen: greetingFromKitchenEnabled ? greetingFromKitchen : null },
    });

    useEffect(() => {
        setValue(
            'courseTitles',
            menu.courses.map(({ title }) => ({ title })),
        );
        setValue('greetingFromKitchen', menu.greetingFromKitchen ?? '');
        setValue('greetingFromKitchenEnabled', menu.greetingFromKitchen !== null && menu.greetingFromKitchen !== undefined);
    }, [menu, setValue]);

    const greetingChangesToBeSaved =
        (greetingFromKitchenEnabled === true && (menu.greetingFromKitchen === null || menu.greetingFromKitchen === undefined)) ||
        (greetingFromKitchenEnabled === false && menu.greetingFromKitchen !== null && menu.greetingFromKitchen !== undefined) ||
        (typeof menu.greetingFromKitchen === 'string' && menu.greetingFromKitchen !== greetingFromKitchen);

    return (
        <>
            <div className="flex gap-4">
                {!coursesInEditMode && <PEButton title="Menü bearbeiten" onClick={() => setCoursesInEditMode(true)} type="secondary" />}
                {coursesInEditMode && (
                    <>
                        <PEButton title="Abbrechen" type="secondary" onClick={() => setCoursesInEditMode(false)} />
                        <PEButton title="Fertig" onClick={() => setCoursesInEditMode(false)} />
                    </>
                )}
            </div>

            {!coursesInEditMode && menu.greetingFromKitchen && (
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Gruß aus der Küche</h2>
                    <span className="text-xl text-gray-500">{menu.greetingFromKitchen}</span>
                </div>
            )}

            {coursesInEditMode && (
                <div className="flex flex-col gap-4">
                    <span className="text-xl font-semibold">Möchtest du einen Gruß aus der Küche anbieten?</span>
                    <div className="flex flex-col gap-4 items-start">
                        <div className="flex justify-between w-full">
                            <PELabelSingleSelection
                                options={['Ja', 'Nein']}
                                selectedOption={greetingFromKitchenEnabled ? 'Ja' : 'Nein'}
                                selectedOptionChanged={(o) => setValue('greetingFromKitchenEnabled', o === 'Ja')}
                                optionTitle={(o) => o}
                                optionIdentifier={(o) => o}
                            />
                            {greetingChangesToBeSaved && (
                                <PEButton
                                    title="Speichern"
                                    onClick={async () => {
                                        const { data } = await requestGreetingFromKitchenUpdate();
                                        if (!data?.cooks.menus.success) return;
                                        updateNeeded();
                                    }}
                                />
                            )}
                        </div>

                        {greetingFromKitchenEnabled && (
                            <div className="w-full">
                                <PETextField
                                    id="greetingFromKitchen"
                                    type="text"
                                    errorMessage={errors.greetingFromKitchen?.message}
                                    {...register('greetingFromKitchen', {
                                        required: greetingFromKitchenEnabled ? 'Beschreibe deinen Gruß aus der Küche.' : false,
                                        minLength: {
                                            value: 5,
                                            message: 'Der Name deines Gruß aus der Küche ist zu kurz.',
                                        },
                                    })}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {menu.courses.map((course, index) => (
                <div key={index} className={classNames('flex flex-col gap-4', 'text-md font-semibold')}>
                    <div className="flex justify-between">
                        {!coursesInEditMode && <h3>{course.title}</h3>}
                        {coursesInEditMode && (
                            <div className="flex gap-4">
                                <PETextField
                                    id={`course-title-${index}`}
                                    type="text"
                                    key={courseTitles[index]?.id}
                                    errorMessage={errors.courseTitles?.[index]?.message}
                                    {...register(`courseTitles.${index}.title`, { required: '' })}
                                />
                                {liveCourseTitles[index]?.title !== menu.courses[index]?.title && (
                                    <div>
                                        <button type="button">
                                            <Save
                                                onClick={async () => {
                                                    const { data } = await requestCourseTitleUpdate({
                                                        variables: {
                                                            cookId,
                                                            menuId: menu.menuId,
                                                            courseId: course.courseId,
                                                            title: liveCourseTitles[index]?.title,
                                                        },
                                                    });

                                                    if (!data?.cooks.menus.courses.updateTitle) return;

                                                    updateNeeded();
                                                }}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {coursesInEditMode && menu.courses.length > 1 && (
                            <button type="button" onClick={() => onRemoveCourse(course.courseId)}>
                                Gang entfernen
                            </button>
                        )}
                    </div>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:grid-cols-3 xl:gap-x-8">
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
                            <>
                                {coursesInEditMode && (
                                    <MealCard
                                        key={mealOption.meal.mealId}
                                        type="BUTTON"
                                        title={mealOption.meal.title}
                                        description={mealOption.meal.description}
                                        imageUrl={mealOption.meal.imageUrl}
                                        onInfoClick={() => setSelectedMeal(mealOption.meal)}
                                        button={
                                            course.mealOptions.length > 1
                                                ? {
                                                      title: 'Entfernen',
                                                      type: 'SECONDARY',
                                                      onClick: () =>
                                                          onRemoveMealFromCourse({
                                                              mealId: mealOption.meal.mealId,
                                                              courseId: course.courseId,
                                                          }),
                                                  }
                                                : undefined
                                        }
                                    />
                                )}
                                {!coursesInEditMode && (
                                    <MealCard
                                        key={mealOption.meal.mealId}
                                        type="SIMPLE"
                                        title={mealOption.meal.title}
                                        description={mealOption.meal.description}
                                        imageUrl={mealOption.meal.imageUrl}
                                        onInfoClick={() => setSelectedMeal(mealOption.meal)}
                                    />
                                )}
                            </>
                        ))}
                    </ul>

                    {selectedMeal && <MealDetailsDialog onClose={() => setSelectedMeal(undefined)} meal={selectedMeal} />}

                    {coursesInEditMode && (
                        <button
                            type="button"
                            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            onClick={() => {
                                setCreateCourseDialogOpen(true);
                                setSelectedCourse(course);
                            }}
                        >
                            <Plus className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                            <span className="mt-2 block text-sm text-gray-900">Gang hinzufügen</span>
                        </button>
                    )}
                </div>
            ))}

            <PEDialog open={createCourseDialogOpen} onClose={() => setCreateCourseDialogOpen(false)}>
                <CreateMenuCourseForm
                    meals={meals}
                    // onCreateMeal={() => setCreateMealDialogOpen(true)}
                    onCreate={(data) => {
                        onCreateCourse(data, selectedCourse ? selectedCourse.index + 1 : menu.courses.length);
                        setCreateCourseDialogOpen(false);
                        setSelectedCourse(undefined);
                    }}
                />
            </PEDialog>

            <PEAddMealToCourseDialog
                open={addMealToCourseDialogOpen}
                onClose={() => setAddMealToCourseDialogOpen(false)}
                meals={meals}
                selectedMealIds={selectedCourse?.mealOptions.map(({ meal }) => meal.mealId) ?? []}
                onAdd={({ mealId }) => {
                    onAddMealToCourse(selectedCourse?.courseId ?? '', { mealId, index: selectedCourse?.mealOptions.length ?? 0 });
                    setAddMealToCourseDialogOpen(false);
                }}
            />
        </>
    );
}
