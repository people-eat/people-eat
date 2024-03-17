import type { Meta, StoryObj } from '@storybook/react';
import { PECheckbox } from './PECheckbox';

const meta: Meta<typeof PECheckbox> = {
    component: PECheckbox,
    title: 'PECheckbox',
};

export default meta;

export const Primary: StoryObj<typeof PECheckbox> = {
    args: {},
};
