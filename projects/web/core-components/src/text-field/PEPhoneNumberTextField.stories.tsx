import type { Meta, StoryObj } from '@storybook/react';
import { PEPhoneNumberTextField } from './PEPhoneNumberTextField';
import { useForm } from 'react-hook-form';

const meta: Meta<typeof PEPhoneNumberTextField> = {
    component: PEPhoneNumberTextField,
    title: 'PEPhoneNumberTextField',
};

export default meta;

export const Primary: StoryObj<typeof PEPhoneNumberTextField> = {
    render: () => {
        const { register, getValues, handleSubmit } = useForm<{ phoneNumber: string }>();

        return (
            <form onSubmit={handleSubmit(() => undefined)}>
                <div className="flex flex-col gap-4">
                    <PEPhoneNumberTextField
                        id="phoneNumber"
                        {...register('phoneNumber', {
                            required: true,
                            // onChange: (event) => event.target.value =  event.target.value,
                        })}
                    />
                    {getValues().phoneNumber}
                    <button type="submit">test</button>
                </div>
            </form>
        );
    },
};
