import type { Meta, StoryObj } from '@storybook/react';
import { PEDialog } from './PEDialog';

const meta: Meta<typeof PEDialog> = {
    component: PEDialog,
    title: 'Dialoge/Standard',
};

export default meta;

export const Dialog: StoryObj<typeof PEDialog> = {
    name: 'Standard',
    args: {
        title: 'Title',
        open: true,
        onClose: () => undefined,
        children: <>Hello world!</>,
    },
};
