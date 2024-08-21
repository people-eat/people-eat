import type { Meta, StoryObj } from '@storybook/react';
import { PEDialog } from './PEDialog';

const meta: Meta<typeof PEDialog> = {
    component: PEDialog,
    title: 'Dialog',
};

export default meta;

export const Primary: StoryObj<typeof PEDialog> = {
    args: {
        open: true,
        onClose: () => undefined,
        children: <>Hello world!</>,
    },
};
