import type { Meta, StoryObj } from '@storybook/react';
import { PENumberTextField } from './PENumberTextField';

/**
 * Custom component.
 * Originally copied from TailwindUI.
 */
const meta: Meta<typeof PENumberTextField> = {
    component: PENumberTextField,
    title: 'PENumberTextField',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PENumberTextField> = {
    args: {
        placeholder: 'Placeholder',
        errorMessage: 'Error Message',
        labelTitle: 'Label Title',
    },
};
