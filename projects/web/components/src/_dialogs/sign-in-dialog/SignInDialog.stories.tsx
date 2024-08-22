import type { Meta, StoryObj } from '@storybook/react';
import { SignInDialog } from './SignInDialog';

const meta: Meta<typeof SignInDialog> = {
    component: SignInDialog,
    title: 'Dialoge/Anmeldedialog',
};

export default meta;

export const Primary: StoryObj<typeof SignInDialog> = {
    name: 'Anmeldedialog',
    args: {
        open: true,
        onClose: () => undefined,
        completeTitle: 'Anmelden',
        onSignIn: () => undefined,
        onSignUp: () => undefined,
    },
};
