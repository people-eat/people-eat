import type { Meta, StoryObj } from '@storybook/react';
import { PEFooter } from './PEFooter';

/**
 * Originally copied from TailwindUI.
 */
const meta: Meta<typeof PEFooter> = {
    component: PEFooter,
    title: 'Footer',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PEFooter> = {
    args: {},
};
