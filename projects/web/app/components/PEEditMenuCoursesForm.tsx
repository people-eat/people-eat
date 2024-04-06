import { CreateMenuCourseForm, MealCard } from '@people-eat/web-components';
import { PEButton, PEDialog, PETextField } from '@people-eat/web-core-components';
import { GetCookProfileMenuPageDataQuery, Unpacked, UpdateCookMenuCourseTitleDocument } from '@people-eat/web-domain';
import classNames from 'classnames';
import { Plus, Save } from 'lucide-react';
import { CreateMenuCourseFormInputs } from 'projects/web/components/src/_forms/CreateMenuCourseForm';
import { useEffect, useState } from 'react';
import { PEAddMealToCourseDialog } from './PEAddMealToCourseDialog';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';

interface PEEditMenuCoursesFormInputs {
    greetingFromKitchen: string;
    courseTitles: {
        title: string;
    }[];
}

export interface PEEditMenuCoursesFormProps {
    cookId: string;
    menu: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['cooks']['menus']>['findOne']>;
    meals: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['users']['signedInUser']>['cook']>['meals'];
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

    const {
        register,
        watch,
        formState: { errors },
        setValue,
        control,
    } = useForm<PEEditMenuCoursesFormInputs>({
        defaultValues: {
            greetingFromKitchen: '',
            courseTitles: menu.courses.map(({ title }) => ({ title })),
        },
    });

    const { fields: courseTitles } = useFieldArray({ control, name: 'courseTitles' });

    const { courseTitles: liveCourseTitles } = watch();

    const [requestCourseTitleUpdate] = useMutation(UpdateCookMenuCourseTitleDocument);

    useEffect(
        () =>
            setValue(
                'courseTitles',
                menu.courses.map(({ title }) => ({ title })),
            ),
        [menu, setValue],
    );

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
                                        <button>
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
                            <button onClick={() => onRemoveCourse(course.courseId)}>Gang entfernen</button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {coursesInEditMode && (
                            <button
                                role="button"
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

                    {/* {coursesInEditMode && (
                        <button
                            role="button"
                            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            onClick={() => {
                                setCreateCourseDialogOpen(true);
                                setSelectedCourse(course);
                            }}
                        >
                            <Plus className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                            <span className="mt-2 block text-sm text-gray-900">Gang hinzufügen</span>
                        </button>
                    )} */}
                </div>
            ))}

            {/* TODO: delete this following block after the index topic is fixed on the server side */}
            {coursesInEditMode && (
                <button
                    role="button"
                    className="relative block rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    onClick={() => {
                        setCreateCourseDialogOpen(true);
                    }}
                >
                    <Plus className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                    <span className="mt-2 block text-sm text-gray-900">Gang hinzufügen</span>
                </button>
            )}

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
