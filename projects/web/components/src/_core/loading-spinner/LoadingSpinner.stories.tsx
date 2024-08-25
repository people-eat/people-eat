import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

/**
 *
 */
const meta: Meta<typeof LoadingSpinner> = {
    component: LoadingSpinner,
    title: 'LoadingSpinner',
    tags: ['autodocs'],
};

export default meta;

export const SizeS: StoryObj<typeof LoadingSpinner> = {
    args: {
        size: 'S',
    },
};

export const SizeM: StoryObj<typeof LoadingSpinner> = {
    args: {
        size: 'M',
    },
};

export const SizeL: StoryObj<typeof LoadingSpinner> = {
    args: {
        size: 'L',
    },
};
