import { useMutation } from '@apollo/client';
import { PEImagePicker } from '@people-eat/web-components';
import { PEAlert, PEButton, PEDialog, PELabelSingleSelection, PETextArea, PETextField } from '@people-eat/web-core-components';
import {
    GetCookProfileMealsPageDataQuery,
    MealType,
    Unpacked,
    UpdateCookMealDescriptionDocument,
    UpdateCookMealImageDocument,
    UpdateCookMealTitleDocument,
    mealTypeTranslations,
    mealTypes,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface EditMealFormInputs {
    title: string;
    description: string;
    type: MealType;
}

export interface CookProfileMealDialogProps {
    cookId: string;
    meal: Unpacked<GetCookProfileMealsPageDataQuery['cooks']['meals']['findMany']>;
    onClose: () => void;
    onDelete: () => void;
    onChangesApplied: () => void;
}

export function CookProfileMealDialog({ cookId, meal, onClose, onDelete, onChangesApplied }: CookProfileMealDialogProps) {
    const mealId = meal.mealId;

    const [showDeleteMealAlert, setShowDeleteMealAlert] = useState(false);
    const [showUpdateImageDialog, setShowUpdateImageDialog] = useState(false);
    const [editSelectedMealOn, setEditSelectedMealOn] = useState(true);

    const {
        register,
        setValue,
        getValues,
        reset,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<EditMealFormInputs>({ defaultValues: { title: meal.title, description: meal.description, type: meal.type } });

    const { title, description, type } = watch();
    const changesHaveBeenApplied = title !== meal.title || description !== meal.description || type !== meal.type;

    const [updateTitle] = useMutation(UpdateCookMealTitleDocument);
    const [updateDescription] = useMutation(UpdateCookMealDescriptionDocument);

    function onCancelEdit() {
        reset();
        setEditSelectedMealOn(false);
    }

    function onSaveEdit(data: EditMealFormInputs) {
        const promises = [];

        if (meal.title !== title) {
            promises.push(updateTitle({ variables: { cookId, mealId, title: data.title } }));
        }

        if (meal.description !== description) {
            promises.push(updateDescription({ variables: { cookId, mealId, description: data.description } }));
        }

        Promise.all(promises).then(onChangesApplied);

        reset();
        setEditSelectedMealOn(false);
    }

    const [updateImage] = useMutation(UpdateCookMealImageDocument);

    function onUpdateImage(changedImage: File | undefined) {
        updateImage({ variables: { cookId, mealId, image: changedImage } }).then(({ data }) => {
            if (data?.cooks.meals.success) {
                onChangesApplied();
            }
        });
    }

    return (
        <>
            <PEDialog open onClose={editSelectedMealOn || showDeleteMealAlert ? undefined : onClose}>
                <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSaveEdit)}>
                    {editSelectedMealOn && (
                        <section className="flex gap-2">
                            <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">Gericht bearbeiten</h2>
                        </section>
                    )}

                    <div className="flex flex-col md:flex-row gap-8">
                        <PEImagePicker
                            onPick={onUpdateImage}
                            defaultImage={meal.imageUrl ?? undefined}
                            onRemoveDefaultImage={() => onUpdateImage(undefined)}
                        />

                        <div className={classNames('flex-1', 'flex flex-col gap-6')}>
                            {!editSelectedMealOn && <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{meal.title}</h2>}

                            {editSelectedMealOn && (
                                <PETextField
                                    id="title"
                                    labelTitle="Name"
                                    type="text"
                                    errorMessage={errors.title?.message}
                                    {...register('title', {
                                        required: 'Dein Gericht braucht noch einen Namen.',
                                        minLength: {
                                            value: 3,
                                            message: 'Der Name des Gerichts muss mindestens 5 Zeichen lang sein',
                                        },
                                    })}
                                />
                            )}

                            {editSelectedMealOn && (
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Gerichtsart</label>
                                    <PELabelSingleSelection
                                        options={mealTypes}
                                        selectedOption={getValues().type}
                                        selectedOptionChanged={(type) => type && setValue('type', type, { shouldValidate: true })}
                                        optionTitle={(mealType) => mealTypeTranslations[mealType]}
                                        optionIdentifier={(mealType) => mealType}
                                    />
                                </div>
                            )}

                            {!editSelectedMealOn && <p className="text-gray-500">{mealTypeTranslations[meal.type]}</p>}

                            {editSelectedMealOn && (
                                <PETextArea
                                    id="description"
                                    labelTitle="Beschreibung"
                                    errorMessage={errors.description?.message}
                                    {...register('description')}
                                />
                            )}

                            {!editSelectedMealOn && <p>{meal.description}</p>}
                        </div>
                    </div>

                    <section className="flex justify-end gap-2">
                        {!editSelectedMealOn && (
                            <>
                                <PEButton title="Löschen" type="secondary" onClick={() => setShowDeleteMealAlert(true)} />
                                <PEButton title="Bearbeiten" type="secondary" onClick={() => setEditSelectedMealOn(true)} />
                            </>
                        )}
                        {editSelectedMealOn && (
                            <>
                                <PEButton title="Abbrechen" type="secondary" onClick={onCancelEdit} />
                                {changesHaveBeenApplied && <PEButton title="Speichern" type="submit" />}
                            </>
                        )}
                    </section>
                </form>
            </PEDialog>

            <PEAlert
                open={showDeleteMealAlert}
                type="DELETION"
                title="Bist du dir sicher dass du dieses Gericht löschen möchtest?"
                subtitle="Diese Aktion kann nicht rückgaängig gemacht werden."
                primaryButton={{
                    title: 'Löschen',
                    onClick: onDelete,
                }}
                secondaryButton={{
                    title: 'Abbrechen',
                    onClick: () => setShowDeleteMealAlert(false),
                }}
            />

            <PEDialog open={showUpdateImageDialog} onClose={() => setShowUpdateImageDialog(false)} className="bg-white p-8">
                Test
            </PEDialog>
        </>
    );
}
