import { PEButton, PELabelSingleSelection, PETextArea, PETextField } from '@people-eat/web-core-components';
import { MealType, mealTypeTranslations, mealTypes } from '@people-eat/web-domain';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
        formState: { errors },
    } = useForm<CreateMealFormInputs>();

    useEffect(() => {
        register('type', { required: 'Dein Gericht muss einer Kategorie zugeordnet werden.' });
    }, [register]);

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit((data) => onCreate({ ...data, image }))}>
            <div className="flex flex-col gap-2">
                <PELabelSingleSelection
                    options={mealTypes}
                    selectedOption={getValues().type}
                    selectedOptionChanged={(type) => type && setValue('type', type, { shouldValidate: true })}
                    optionTitle={(mealType) => mealTypeTranslations[mealType]}
                    optionIdentifier={(mealType) => mealType}
                />
                {errors.type?.message && <span className="ml-2 mt-1 text-sm font-semibold text-red-500">{errors.type.message}</span>}
            </div>

            <PETextField
                id="title"
                labelTitle="Name"
                type="text"
                errorMessage={errors.title?.message}
                {...register('title', {
                    required: 'Dein Gericht braucht noch einen Namen.',
                    minLength: { value: 5, message: 'Der Name des Gerichts muss mindestens 5 Zeichen lang sein' },
                })}
            />
            <PETextArea
                id="description"
                labelTitle="Beschreibung"
                errorMessage={errors.description?.message}
                {...register('description', { required: 'Dein Gericht braucht noch eine Beschreibung.' })}
            />

            <p className="mt-4">Füge deinem Gericht ein Bild hinzu</p>
            <PEImagePicker onPick={setImage} onRemoveDefaultImage={(): void => setImage(undefined)} />

            <PEButton title="Gericht erstellen" type="submit" />
        </form>
    );
}
