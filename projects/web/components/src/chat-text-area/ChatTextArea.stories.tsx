import type { Meta, StoryObj } from '@storybook/react';
import { ChatTextArea } from './ChatTextArea';

/**
 * Custom component
 */
const meta: Meta<typeof ChatTextArea> = {
    component: ChatTextArea,
    title: 'ChatTextArea',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof ChatTextArea> = {
    args: {},
};
