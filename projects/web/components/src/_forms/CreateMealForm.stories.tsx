import type { Meta, StoryObj } from '@storybook/react';
import { CreateMealForm } from './CreateMealForm';

const meta: Meta<typeof CreateMealForm> = {
    component: CreateMealForm,
    title: 'Formulare/Gericht Erstellen',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof CreateMealForm> = {
    args: {
        onCreate: () => undefined,
    },
};
