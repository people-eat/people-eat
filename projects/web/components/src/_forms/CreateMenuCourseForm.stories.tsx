import type { Meta, StoryObj } from '@storybook/react';
import { CreateMenuCourseForm } from './CreateMenuCourseForm';

const meta: Meta<typeof CreateMenuCourseForm> = {
    component: CreateMenuCourseForm,
    title: 'Formulare/Menü Gang Erstellen',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof CreateMenuCourseForm> = {
    args: {
        meals: [
            {
                mealId: 'meal-id',
                cookId: 'cook-id',
                title: 'Spaghetti Bolognese',
                type: 'MEAT',
                imageUrl: undefined,
                description: '',
                createdAt: new Date(),
            },
        ],
        onCreateMeal: () => undefined,
        onCreate: () => undefined,
    },
};
