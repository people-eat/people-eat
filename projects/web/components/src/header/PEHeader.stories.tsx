import type { Meta, StoryObj } from '@storybook/react';
import { PEHeader } from './PEHeader';

const meta: Meta<typeof PEHeader> = {
    component: PEHeader,
    title: 'Header',
};

export default meta;

export const Primary: StoryObj<typeof PEHeader> = {
    args: {},
};
