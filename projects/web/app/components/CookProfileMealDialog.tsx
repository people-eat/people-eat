import { Dialog, Transition } from '@headlessui/react';
import { PEAlert, PEButton, PEDialog, PELabelSingleSelection, PETextArea, PETextField } from '@people-eat/web-core-components';
import { GetCookProfileMealsPageDataQuery, MealType, Unpacked, mealTypeTranslations, mealTypes } from '@people-eat/web-domain';
import classNames from 'classnames';
import { Trash, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';

interface EditMealFormInputs {
    title: string;
    description: string;
    type: MealType;
}

export interface CookProfileMealDialogProps {
    meal: Unpacked<GetCookProfileMealsPageDataQuery['cooks']['meals']['findMany']>;
    onClose: () => void;
}

export function CookProfileMealDialog({ meal, onClose }: CookProfileMealDialogProps) {
    const [showDeleteMealAlert, setShowDeleteMealAlert] = useState(false);
    const [showUpdateImageDialog, setShowUpdateImageDialog] = useState(false);
    const [editSelectedMealOn, setEditSelectedMealOn] = useState(false);

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

    function onCancelEdit() {
        reset();
        setEditSelectedMealOn(false);
    }

    function onSaveEdit(data: EditMealFormInputs) {
        // todo
        reset();
        setEditSelectedMealOn(false);
    }

    function onDelete() {}

    return (
        <>
            <Transition.Root show={Boolean(meal)} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={editSelectedMealOn || showDeleteMealAlert ? () => undefined : onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                                enterTo="opacity-100 translate-y-0 md:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            >
                                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                    <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-2xl">
                                        {!editSelectedMealOn && (
                                            <button
                                                role="button"
                                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                                                onClick={() => onClose}
                                            >
                                                <span className="sr-only">Close</span>
                                                <X className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        )}

                                        <form
                                            className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8"
                                            onSubmit={handleSubmit(onSaveEdit)}
                                        >
                                            {editSelectedMealOn && (
                                                <section className="flex gap-2 col-span-full">
                                                    <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">Gericht bearbeiten</h2>
                                                </section>
                                            )}

                                            <div className="sm:col-span-4 lg:col-span-5 flex flex-col gap-4">
                                                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                                                    <Image
                                                        unoptimized
                                                        src={meal.imageUrl ?? '/placeholders/meal.png'}
                                                        alt=""
                                                        className="object-cover object-center"
                                                        width={600}
                                                        height={600}
                                                    />
                                                </div>
                                                {editSelectedMealOn && (
                                                    <div className="flex gap-8 justify-center">
                                                        <button onClick={() => setShowDeleteMealAlert(true)}>
                                                            <Trash color="red" />
                                                        </button>
                                                        <button onClick={() => setShowUpdateImageDialog(true)}>
                                                            <Upload />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={classNames('sm:col-span-8 lg:col-span-7', 'flex flex-col gap-6')}>
                                                {!editSelectedMealOn && (
                                                    <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{meal.title}</h2>
                                                )}

                                                {editSelectedMealOn && (
                                                    <PETextField
                                                        id="title"
                                                        labelTitle="Name"
                                                        type="text"
                                                        errorMessage={errors.title?.message}
                                                        {...register('title', {
                                                            required: 'Dein Gericht braucht noch einen Namen.',
                                                            minLength: {
                                                                value: 5,
                                                                message: 'Der Name des Gerichts muss mindestens 5 Zeichen lang sein',
                                                            },
                                                        })}
                                                    />
                                                )}

                                                {editSelectedMealOn && (
                                                    <div>
                                                        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                            Gerichtsart
                                                        </label>
                                                        <PELabelSingleSelection
                                                            options={mealTypes}
                                                            selectedOption={getValues().type}
                                                            selectedOptionChanged={(type) =>
                                                                type && setValue('type', type, { shouldValidate: true })
                                                            }
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
                                                        {...register('description', {
                                                            required: 'Dein Gericht braucht noch eine Beschreibung.',
                                                        })}
                                                    />
                                                )}

                                                {!editSelectedMealOn && <p>{meal.description}</p>}
                                            </div>

                                            <section className="flex justify-end gap-2 col-span-full">
                                                {!editSelectedMealOn && (
                                                    <>
                                                        <PEButton
                                                            title="Löschen"
                                                            type="secondary"
                                                            onClick={() => setShowDeleteMealAlert(true)}
                                                        />
                                                        <PEButton
                                                            title="Bearbeiten"
                                                            type="secondary"
                                                            onClick={() => setEditSelectedMealOn(true)}
                                                        />
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
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

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
