import type { Meta } from '@storybook/react';
import { SearchModeSwitch } from './SearchModeSwitch';

/**
 *
 */
const meta: Meta<typeof SearchModeSwitch> = {
    component: SearchModeSwitch,
    title: 'Search Mode Switch',
    tags: ['autodocs'],
};

export default meta;

export const MenusSelected = {
    args: {
        activeMode: 'MENUS',
    },
};

export const CooksSelected = {
    args: {
        activeMode: 'COOKS',
    },
};
