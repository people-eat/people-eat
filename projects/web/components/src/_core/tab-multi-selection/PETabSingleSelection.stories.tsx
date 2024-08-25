import type { Meta, StoryObj } from '@storybook/react';
import { AlignHorizontalJustifyEnd, PersonStanding, User } from 'lucide-react';
import { useState } from 'react';
import { PETabSingleSelection, PETabSingleSelectionOption } from './PETabSingleSelection';

/**
 * Custom component.
 */
const meta: Meta<typeof PETabSingleSelection> = {
    component: PETabSingleSelection,
    title: 'Selectors/PETabSingleSelection',
    tags: ['autodocs'],
};

export default meta;

const options: PETabSingleSelectionOption[] = [
    { title: 'Option A', icon: AlignHorizontalJustifyEnd },
    { title: 'Option B', notificationCount: 3 },
    { title: 'Option C', icon: PersonStanding },
    { title: 'Option D' },
    { title: 'Option E' },
    { title: 'Option F' },
    { title: 'Option G', notificationCount: 8, icon: PersonStanding },
    { title: 'Option H' },
    { title: 'Option I', icon: User },
];

export const Demo: StoryObj<typeof PETabSingleSelection> = {
    render: () => {
        const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | undefined>(3);

        return (
            <PETabSingleSelection
                // options={options}
                // selectedOptionIndex={selectedOptionIndex}
                // onSelect={(index) => setSelectedOptionIndex(index)}

                options={options}
                selectedOption={selectedOptionIndex && options[selectedOptionIndex]}
                selectedOptionChanged={() => undefined}
                optionTitle={({ title }) => title}
                optionIdentifier={({ title }) => title}

                // options: T[];
                // selectedOption?: T;
                // selectedOptionChanged: (changedSelectedOption?: T) => void;

                // optionTitle: (option: T) => string;
                // optionIdentifier: (option: T) => string;
                // optionIcon?: (option: T) => LucideIcon | undefined;
                // optionNotificationCount?: (option: T) => number | undefined;
            />
        );
    },
};
