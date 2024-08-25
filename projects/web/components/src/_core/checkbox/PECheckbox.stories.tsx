import type { Meta, StoryObj } from '@storybook/react';
import { PECheckbox } from './PECheckbox';

/**
 * Custom component.
 * Originally copied from TailwindUI.
 */
const meta: Meta<typeof PECheckbox> = {
    component: PECheckbox,
    title: 'PECheckbox',
    tags: ['autodocs'],
    parameters: {
        controls: {
            exclude: 'id|errorMessage',
        },
    },
};

export default meta;

export const WithLabelTitleAndDescription: StoryObj<typeof PECheckbox> = {
    args: {
        label: {
            title: 'Label Title',
            description: 'Label Description',
        },
    },
};

export const WithLabelTitle: StoryObj<typeof PECheckbox> = {
    args: {
        label: {
            title: 'Label Title',
        },
    },
};

export const WithoutLabel: StoryObj<typeof PECheckbox> = {
    args: {
        label: undefined,
    },
};
