import type { Meta, StoryObj } from '@storybook/react';
import { PESlider } from './PESlider';

/**
 *
 */
const meta: Meta<typeof PESlider> = {
    component: PESlider,
    title: 'PESlider',
    tags: ['autodocs'],
};

export default meta;

export const WithLabel: StoryObj<typeof PESlider> = {
    args: {
        id: 'id',
        labelTitle: 'Label',
        step: 5,
        min: 0,
        max: 100,
    },
};

export const WithoutLabel: StoryObj<typeof PESlider> = {
    args: {
        id: 'id',
        labelTitle: undefined,
        step: 5,
        min: 0,
        max: 100,
    },
};
