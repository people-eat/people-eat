import type { Meta, StoryObj } from '@storybook/react';
import { PEAlert } from './PEAlert';

/**
 * Depends on Dialog, Transition from @headlessui/react
 */
const meta: Meta<typeof PEAlert> = {
    component: PEAlert,
    title: 'PEAlert',
    tags: ['autodocs'],
};

export default meta;

export const WithTitleAndSubtitle: StoryObj<typeof PEAlert> = {
    args: {
        open: false,
        // type?: 'SUCCESS' | 'ERROR' | 'DELETION' | 'INFO';
        title: 'Title',
        subtitle: 'Subtitle',
        primaryButton: {
            title: 'Okay',
            onClick: () => undefined,
        },
        secondaryButton: {
            title: 'Abbrechen',
            onClick: () => undefined,
        },
    },
};

export const WithTitle: StoryObj<typeof PEAlert> = {
    args: {
        open: false,
        // type?: 'SUCCESS' | 'ERROR' | 'DELETION' | 'INFO';
        title: 'Title',
        subtitle: undefined,
        primaryButton: {
            title: 'Okay',
            onClick: () => undefined,
        },
        secondaryButton: {
            title: 'Abbrechen',
            onClick: () => undefined,
        },
    },
};
