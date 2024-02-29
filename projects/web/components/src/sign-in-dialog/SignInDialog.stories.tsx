import type { Meta, StoryObj } from '@storybook/react';
import { SignInDialog } from './SignInDialog';

const meta: Meta<typeof SignInDialog> = {
    component: SignInDialog,
    title: 'Sign In Dialog',
};

export default meta;

export const Primary: StoryObj<typeof SignInDialog> = {};
