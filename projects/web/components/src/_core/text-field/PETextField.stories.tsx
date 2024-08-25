import type { Meta, StoryObj } from '@storybook/react';
import { PETextField } from './PETextField';

/**
 * Custom component.
 * Originally copied from TailwindUI.
 */
const meta: Meta<typeof PETextField> = {
    component: PETextField,
    title: 'PETextField',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PETextField> = {
    args: {
        placeholder: 'Placeholder',
        errorMessage: 'Error Message',
        labelTitle: 'Label Title',
    },
};
