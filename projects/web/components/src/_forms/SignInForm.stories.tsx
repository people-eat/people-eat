import type { Meta, StoryObj } from '@storybook/react';
import { SignInForm } from './SignInForm';

const meta: Meta<typeof SignInForm> = {
    component: SignInForm,
    title: 'Formulare/Anmeldeformular',
};

export default meta;

export const Primary: StoryObj<typeof SignInForm> = {
    args: {
        completeTitle: 'Anmelden',
        onSignIn: () => undefined,
        onSignUp: () => undefined,
        onForgotPassword: () => undefined,
    },
};
