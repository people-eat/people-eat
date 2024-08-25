import type { Meta, StoryObj } from '@storybook/react';
import { PENumberTextField } from './PENumberTextField';

/**
 *
 */
const meta: Meta<typeof PENumberTextField> = {
    component: PENumberTextField,
    title: 'PENumberTextField',
};

export default meta;

export const Primary: StoryObj<typeof PENumberTextField> = {
    args: {
        placeholder: 'Placeholder',
        errorMessage: 'Error Message',
        labelTitle: 'Label Title',
    },
};
