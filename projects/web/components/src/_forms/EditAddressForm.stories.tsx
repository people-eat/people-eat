import type { Meta, StoryObj } from '@storybook/react';
import { EditAddressForm } from './EditAddressForm';

const meta: Meta<typeof EditAddressForm> = {
    component: EditAddressForm,
    title: 'Formulare/Adresse bearbeiten',
};

export default meta;

export const Primary: StoryObj<typeof EditAddressForm> = {
    args: {
        onCreate: () => undefined,
        isLoadingSuggestions: false,

        current: {
            title: 'Zuhause',
            postCode: '123456',
            city: 'Maxdorf',
            street: 'Musterstraße',
            houseNumber: '1A',
            country: 'Deutschland',
        },
    },
};
