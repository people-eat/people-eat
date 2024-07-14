import type { Meta, StoryObj } from '@storybook/react';
import { PEButton } from './PEButton';

const meta: Meta<typeof PEButton> = {
    component: PEButton,
    title: 'Buttons/PEButton',
};

export default meta;

export const Primary: StoryObj<typeof PEButton> = {
    args: {
        title: 'Click me',
    },
};

export const Secondary: StoryObj<typeof PEButton> = {
    args: {
        title: 'Click me',
        type: 'secondary',
    },
};
