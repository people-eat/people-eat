import { MealType, mealTypeTranslations, mealTypes } from '@people-eat/web-domain';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEButton, PELabelSingleSelection, PETextArea, PETextField } from '../_core';
import { PEImagePicker } from '../images/PEImagePicker';

export interface CreateMealFormInputs {
    title: string;
    description: string;
    type: MealType;
}

export interface CreateMealFormProps {
    onCreate: (formData: CreateMealFormInputs & { image: File | undefined }) => void;
}

export function CreateMealForm({ onCreate }: CreateMealFormProps) {
    const [image, setImage] = useState<File | undefined>(undefined);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        setFocus,
        formState: { errors },
    } = useForm<CreateMealFormInputs>();

    useEffect(() => {
        register('type', { required: 'Dein Gericht muss einer Kategorie zugeordnet werden.' });
    }, [register]);

    useEffect(() => setFocus('title'), [setFocus]);

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit((data) => onCreate({ ...data, image }))}>
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Gerichtsart</label>
                <PELabelSingleSelection
                    options={mealTypes}
                    selectedOption={getValues().type}
                    selectedOptionChanged={(type) => type && setValue('type', type, { shouldValidate: true })}
                    optionTitle={(mealType) => mealTypeTranslations[mealType]}
                    optionIdentifier={(mealType) => mealType}
                />
                {errors.type?.message && <span className="ml-2 mt-1 text-sm font-semibold text-red-500">{errors.type.message}</span>}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-6 md:flex-1">
                    <PETextField
                        id="mealTitle"
                        labelTitle="Name"
                        type="text"
                        errorMessage={errors.title?.message}
                        {...register('title', {
                            required: 'Dein Gericht braucht noch einen Namen.',
                            minLength: { value: 3, message: 'Der Name des Gerichts muss mindestens 5 Zeichen lang sein' },
                        })}
                    />

                    <PETextArea
                        id="mealDescription"
                        labelTitle="Beschreibung"
                        errorMessage={errors.description?.message}
                        {...register('description')}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-base font-medium leading-6 text-gray-900">Bild hinzufügen</p>

                    <PEImagePicker onPick={setImage} onRemoveDefaultImage={(): void => setImage(undefined)} />
                </div>
            </div>

            <PEButton title="Gericht erstellen" type="submit" />
        </form>
    );
}
