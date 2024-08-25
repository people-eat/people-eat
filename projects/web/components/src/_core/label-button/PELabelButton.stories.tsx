import type { Meta, StoryObj } from '@storybook/react';
import { PELabelButton } from './PELabelButton';
import { useState } from 'react';

/**
 *
 */
const meta: Meta<typeof PELabelButton> = {
    component: PELabelButton,
    title: 'Buttons/PELabelButton',
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

export const Demo: StoryObj<typeof PELabelButton> = {
    render: () => {
        const [selectedOptions, setSelectedOptions] = useState<SelectionOption[]>([]);

        return (
            <div className="flex gap-2 flex-wrap max-w-80">
                {options.map((option) => (
                    <PELabelButton
                        key={option.id}
                        title={option.title}
                        selected={selectedOptions.findIndex((o) => o.id === option.id) !== -1}
                        onSelect={() => setSelectedOptions([...selectedOptions, option])}
                        onDeselect={() => setSelectedOptions(selectedOptions.filter(({ id }) => id !== option.id))}
                    />
                ))}
            </div>
        );
    },
};

export const Selected: StoryObj<typeof PELabelButton> = {
    args: {
        title: 'Option to choose',
        selected: true,
        onSelect: undefined,
        onDeselect: undefined,
    },
};

export const Unselected: StoryObj<typeof PELabelButton> = {
    args: {
        title: 'Option to choose',
        selected: false,
        onSelect: undefined,
        onDeselect: undefined,
    },
};
