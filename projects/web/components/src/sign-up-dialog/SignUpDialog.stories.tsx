import type { Meta, StoryObj } from '@storybook/react';
import { SignUpDialog } from './SignUpDialog';

const meta: Meta<typeof SignUpDialog> = {
    component: SignUpDialog,
    title: 'Sign Up Dialog',
};

export default meta;

export const Primary: StoryObj<typeof SignUpDialog> = {};
