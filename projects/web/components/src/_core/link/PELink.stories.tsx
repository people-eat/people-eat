import type { Meta, StoryObj } from '@storybook/react';
import { PELink } from './PELink';

/**
 * Custom component.
 */
const meta: Meta<typeof PELink> = {
    component: PELink,
    title: 'Buttons/PELink',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PELink> = {
    args: {
        title: 'Click me',
        type: 'primary',
        href: '',
    },
};

export const Secondary: StoryObj<typeof PELink> = {
    args: {
        title: 'Click me',
        type: 'secondary',
        href: '',
    },
};
