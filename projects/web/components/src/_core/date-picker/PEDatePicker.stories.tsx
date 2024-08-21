import type { Meta, StoryObj } from '@storybook/react';
import { PEDatePicker } from './PEDatePicker';

const meta: Meta<typeof PEDatePicker> = {
    component: PEDatePicker,
    title: 'Date Picker',
};

export default meta;

export const DatePicker: StoryObj<typeof PEDatePicker> = {
    args: {
        date: new Date(),
    },
};
