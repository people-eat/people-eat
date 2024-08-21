import type { Meta, StoryObj } from '@storybook/react';
import { PETextField } from './PETextField';

const meta: Meta<typeof PETextField> = {
    component: PETextField,
    title: 'PETextField',
};

export default meta;

export const Primary: StoryObj<typeof PETextField> = {
    args: {
        placeholder: 'Placeholder',
        errorMessage: 'Error Message',
        labelTitle: 'Label Title',
    },
};
