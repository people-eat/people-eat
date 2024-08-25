import type { Meta, StoryObj } from '@storybook/react';
import { PEDatePicker } from './PEDatePicker';

/**
 * Depends on Popover, Transition from @headlessui/react and PECalendar.
 */
const meta: Meta<typeof PEDatePicker> = {
    component: PEDatePicker,
    title: 'Date Picker',
    tags: ['autodocs'],
    parameters: {
        controls: {
            exclude: 'setDate|minDate',
        },
    },
};

export default meta;

export const DatePicker: StoryObj<typeof PEDatePicker> = {
    args: {
        date: new Date(),
        labelTitle: 'Label Title',
    },
};
