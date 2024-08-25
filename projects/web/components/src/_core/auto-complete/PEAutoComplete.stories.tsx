import type { Meta, StoryObj } from '@storybook/react';
import PEAutoComplete from './PEAutoComplete';

/**
 * Depends on Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Label from @headlessui/react
 */
const meta: Meta<typeof PEAutoComplete> = {
    component: PEAutoComplete,
    title: 'PEAutoComplete',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PEAutoComplete<string>> = {
    args: {
        title: 'Title',
        options: ['Option A', 'Option B'],
        selectedOption: undefined,
        onSelectedOptionChange: () => undefined,
        getOptionIdentifier: (option) => option,
        getLabel: (option) => option,
        errorMessage: undefined,
    },
};
