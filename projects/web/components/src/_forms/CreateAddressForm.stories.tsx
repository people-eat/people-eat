import type { Meta, StoryObj } from '@storybook/react';
import { CreateAddressForm } from './CreateAddressForm';

const meta: Meta<typeof CreateAddressForm> = {
    component: CreateAddressForm,
    title: 'Formulare/Adresse Erstellen',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof CreateAddressForm> = {
    args: {
        onCreate: () => undefined,
        isLoadingSuggestions: false,
    },
};
