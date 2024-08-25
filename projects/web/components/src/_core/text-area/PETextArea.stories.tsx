import type { Meta, StoryObj } from '@storybook/react';
import { PETextArea } from './PETextArea';

/**
 *
 */
const meta: Meta<typeof PETextArea> = {
    component: PETextArea,
    title: 'PETextArea',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PETextArea> = {
    args: {
        placeholder: 'Placeholder',
        errorMessage: 'Error Message',
        labelTitle: 'Label Title',
    },
};
