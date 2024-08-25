import type { Meta, StoryObj } from '@storybook/react';
import { PELabelMultiSelection } from './PELabelMultiSelection';
import { useState } from 'react';

/**
 *
 */
const meta: Meta<typeof PELabelMultiSelection> = {
    component: PELabelMultiSelection,
    title: 'Selectors/PELabelMultiSelection',
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

export const Demo: StoryObj<typeof PELabelMultiSelection> = {
    render: () => {
        const [selectedOptions, setSelectedOptions] = useState<SelectionOption[]>([]);

        return (
            <PELabelMultiSelection
                options={options}
                selectedOptions={selectedOptions}
                selectedOptionsChanged={setSelectedOptions}
                optionTitle={({ title }) => title}
                optionIdentifier={({ id }) => id}
            />
        );
    },
};
