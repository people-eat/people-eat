import type { Meta, StoryObj } from '@storybook/react';
import { CookSignUpForm } from './CookSignUpForm';

const meta: Meta<typeof CookSignUpForm> = {
    component: CookSignUpForm,
    title: 'Formulare/Kochregistrierungsformular',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof CookSignUpForm> = {
    args: {
        signedInUser: null,

        completeTitle: 'Fertigstellen',
        onSignUpForExistingUser: () => undefined,
        onSignUpForNewUser: () => undefined,
        onSignIn: () => undefined,

        languages: {
            options: [
                {
                    languageId: 'A',
                    title: 'Deutsch',
                },
                {
                    languageId: 'B',
                    title: 'Englisch',
                },
                {
                    languageId: 'C',
                    title: 'Französisch',
                },
            ],
            selectedOptions: [],
            onChange: () => undefined,
        },
        rank: 'HOBBY',
        setRank: () => undefined,
    },
};
