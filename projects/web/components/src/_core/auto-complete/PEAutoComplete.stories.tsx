import type { Meta, StoryObj } from '@storybook/react';
import { PEAutoComplete } from './PEAutoComplete';

const meta: Meta<typeof PEAutoComplete> = {
    component: PEAutoComplete,
    title: 'PEAutoComplete',
};

export default meta;

export const Primary: StoryObj<typeof PEAutoComplete> = {
    args: {},
};
