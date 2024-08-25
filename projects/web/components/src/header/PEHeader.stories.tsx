import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { PEHeader } from './PEHeader';

/**
 * Originally copied from TailwindUI.
 * Internally uses Dialog, Menu, Transition from @headlessui/react.
 */
const meta: Meta<typeof PEHeader> = {
    component: PEHeader,
    title: 'Header',
    render: ({ signedInUser }) => {
        return (
            <MockedProvider>
                <PEHeader signedInUser={signedInUser} />
            </MockedProvider>
        );
    },
};

export default meta;

export const Primary: StoryObj<typeof PEHeader> = {
    args: {
        signedInUser: undefined,
    },
};
