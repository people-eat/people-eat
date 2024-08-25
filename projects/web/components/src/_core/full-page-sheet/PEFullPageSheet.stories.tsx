import type { Meta, StoryObj } from '@storybook/react';
import { PEFullPageSheet } from './PEFullPageSheet';

/**
 * Depends on Dialog from @headlessui/react.
 */
const meta: Meta<typeof PEFullPageSheet> = {
    component: PEFullPageSheet,
    title: 'PEFullPageSheet',
    tags: ['autodocs'],
    parameters: {
        controls: {
            exclude: 'children|onClose',
        },
    },
};

export default meta;

export const Primary: StoryObj<typeof PEFullPageSheet> = {
    args: {
        title: 'Title',
        children: <div>Hello world!</div>,
        open: false,
        onClose: () => undefined,
    },
};
