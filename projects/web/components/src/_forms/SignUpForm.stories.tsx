import type { Meta, StoryObj } from '@storybook/react';
import { SignUpForm } from './SignUpForm';

const meta: Meta<typeof SignUpForm> = {
    component: SignUpForm,
    title: 'Formulare/Registrierungsformular',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof SignUpForm> = {
    args: {
        completeTitle: 'Registrieren',
        onSignIn: () => undefined,
        onSignUp: () => undefined,
    },
};
