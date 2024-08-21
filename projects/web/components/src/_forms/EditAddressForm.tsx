import { useForm } from 'react-hook-form';
import { PEButton, PETextField } from '../_core';

export interface EditAddressFormInputs {
    title: string;
    postCode: string;
    city: string;
    street: string;
    houseNumber: string;
    country: string;
}

export interface EditAddressFormProps {
    onCreate: (formData: EditAddressFormInputs) => void;
    isLoadingSuggestions: boolean;

    current: EditAddressFormInputs;
}

export function EditAddressForm({ onCreate, current }: EditAddressFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EditAddressFormInputs>({ defaultValues: current });

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onCreate)}>
            <PETextField
                id="title"
                placeholder="Name"
                type="text"
                autoComplete="title"
                errorMessage={errors.title?.message}
                {...register('title', { required: 'This field is required' })}
            />

            <div className="flex gap-4 flex-col md:flex-row">
                <PETextField
                    id="city"
                    placeholder="Stadt"
                    type="text"
                    autoComplete="city"
                    errorMessage={errors.city?.message}
                    {...register('city', { required: 'This field is required' })}
                />

                <PETextField
                    id="postCode"
                    placeholder="Postleitzahl"
                    type="text"
                    // autoComplete=""
                    errorMessage={errors.postCode?.message}
                    {...register('postCode', { required: 'This field is required' })}
                />
            </div>

            <div className="flex gap-4 flex-col md:flex-row">
                <PETextField
                    id="street"
                    placeholder="Straße"
                    type="text"
                    // autoComplete=""
                    errorMessage={errors.street?.message}
                    {...register('street', { required: 'This field is required' })}
                />

                <PETextField
                    id="houseNumber"
                    placeholder="Hausnummer"
                    type="text"
                    // autoComplete=""
                    errorMessage={errors.houseNumber?.message}
                    {...register('houseNumber', { required: 'This field is required' })}
                />
            </div>

            <PETextField
                id="country"
                placeholder="Land"
                type="text"
                autoComplete="country"
                errorMessage={errors.country?.message}
                {...register('country', { required: 'This field is required' })}
            />

            <PEButton title="Speichern" type="submit" />
        </form>
    );
}
