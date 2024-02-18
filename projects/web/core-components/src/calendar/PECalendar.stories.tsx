import type { Meta, StoryObj } from '@storybook/react';
import { PECalendar } from './PECalendar';
import { useState } from 'react';

const meta: Meta<typeof PECalendar> = {
    component: PECalendar,
    title: 'PECalendar',
    argTypes: {
        selectedDate: {
            options: ['Current Date', 'Tomorrow'],
            mapping: {
                'Current Date': new Date(),
                Tomorrow: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            },
        },
    },
};

export default meta;

export const Primary: StoryObj<typeof PECalendar> = {
    render: () => {
        const [selectedDate, setSelectedDate] = useState(new Date());

        return <PECalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />;
    },
};
