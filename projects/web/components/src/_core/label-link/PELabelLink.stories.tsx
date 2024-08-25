import type { Meta, StoryObj } from '@storybook/react';
import { PELabelLink } from './PELabelLink';

/**
 * Custom component.
 */
const meta: Meta<typeof PELabelLink> = {
    component: PELabelLink,
    title: 'Buttons/PELabelLink',
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

export const Demo: StoryObj<typeof PELabelLink> = {
    render: () => {
        return (
            <div className="flex gap-2 flex-wrap max-w-80">
                {options.map((option, index) => (
                    <PELabelLink key={option.id} title={option.title} selected={index === 0} href="" />
                ))}
            </div>
        );
    },
};

export const Selected: StoryObj<typeof PELabelLink> = {
    args: {
        title: 'Option to choose',
        selected: true,
        href: '/',
    },
};

export const Unselected: StoryObj<typeof PELabelLink> = {
    args: {
        title: 'Option to choose',
        selected: false,
        href: '/',
    },
};
