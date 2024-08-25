import type { Meta } from '@storybook/react';
import { LoadingDialog } from './LoadingDialog';

/**
 *
 */
const meta: Meta<typeof LoadingDialog> = {
    component: LoadingDialog,
    title: 'Dialoge/Lade Dialog',
};

export default meta;

export const Primary = {
    name: 'Standard',
    args: {
        active: true,
        title: undefined,
        subtitle: undefined,
    },
};

export const WithTitle = {
    name: 'Mit Titel',
    args: {
        active: true,
        title: 'Title',
        subtitle: undefined,
    },
};

export const WithTitleAndSubtitle = {
    name: 'Mit Titel und Untertitel',
    args: {
        active: true,
        title: 'Title',
        subtitle: 'Subtitle',
    },
};
