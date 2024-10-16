import type { Meta, StoryObj } from '@storybook/react';
import { PESingleSelection } from './PESingleSelection';
import { useState } from 'react';

/**
 * Depends on Listbox, Transition from @headlessui/react
 */
const meta: Meta<typeof PESingleSelection> = {
    component: PESingleSelection,
    title: 'Selectors/PESingleSelection',
    tags: ['autodocs'],
};

export default meta;

interface SelectionOption {
    id: string;
    title: string;
}

const options: SelectionOption[] = [
    { id: 'A', title: 'Option A' },
    { id: 'B', title: 'Option B' },
    { id: 'C', title: 'Option C' },
    { id: 'D', title: 'Option D' },
    { id: 'E', title: 'Option E' },
    { id: 'F', title: 'Option F' },
    { id: 'G', title: 'Option G' },
    { id: 'H', title: 'Option H' },
    { id: 'I', title: 'Option I' },
];

export const Demo: StoryObj<typeof PESingleSelection> = {
    render: () => {
        const [selectedOption, setSelectedOption] = useState<SelectionOption | undefined>();

        return (
            <PESingleSelection
                options={options}
                selectedOption={selectedOption}
                selectedOptionChanged={setSelectedOption}
                optionTitle={({ title }) => title}
                optionIdentifier={({ id }) => id}
            />
        );
    },
};
