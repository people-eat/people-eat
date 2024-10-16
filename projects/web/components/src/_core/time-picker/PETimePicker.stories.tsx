import type { Meta, StoryObj } from '@storybook/react';
import { PETimePicker } from './PETimePicker';
import { useState } from 'react';
import { Time } from '@people-eat/web-domain';

/**
 * Depends on Menu, Transition from @headlessui/react.
 */
const meta: Meta<typeof PETimePicker> = {
    component: PETimePicker,
    title: 'Time Picker',
    tags: ['autodocs'],
};

export default meta;

export const TimePicker: StoryObj<typeof PETimePicker> = {
    render: () => {
        const [value, setValue] = useState<Time>({ hours: 20, minutes: 0 });

        return (
            <div className="w-full flex items-end">
                <PETimePicker value={value} onChange={setValue} />
            </div>
        );
    },
};
