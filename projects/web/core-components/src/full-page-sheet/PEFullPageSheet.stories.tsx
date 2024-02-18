import type { Meta, StoryObj } from '@storybook/react';
import { PEFullPageSheet } from './PEFullPageSheet';

const meta: Meta<typeof PEFullPageSheet> = {
    component: PEFullPageSheet,
    title: 'PEFullPageSheet',
};

export default meta;

export const Primary: StoryObj<typeof PEFullPageSheet> = {
    args: {
        children: <div>Hello world!</div>,
        open: true,
        onClose: () => undefined,
    },
};
