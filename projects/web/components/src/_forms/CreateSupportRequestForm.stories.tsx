import type { Meta, StoryObj } from '@storybook/react';
import { CreateSupportRequestForm } from './CreateSupportRequestForm';

const meta: Meta<typeof CreateSupportRequestForm> = {
    component: CreateSupportRequestForm,
    title: 'Formulare/Supportanfrageformular',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof CreateSupportRequestForm> = {
    args: {
        onCreate: () => undefined,
    },
};
