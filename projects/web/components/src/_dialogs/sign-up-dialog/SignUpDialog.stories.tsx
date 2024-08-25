import type { Meta, StoryObj } from '@storybook/react';
import { SignUpDialog } from './SignUpDialog';

/**
 * Custom component.
 */
const meta: Meta<typeof SignUpDialog> = {
    component: SignUpDialog,
    title: 'Dialoge/Registrierungsdialog',
};

export default meta;

export const Primary: StoryObj<typeof SignUpDialog> = {
    name: 'Registrierungsdialog',
    args: {
        open: true,
        onClose: () => undefined,
        completeTitle: 'Registrieren',
        onSignUp: () => undefined,
        onSignIn: () => undefined,
    },
};
