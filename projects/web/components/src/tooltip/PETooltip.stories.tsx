import type { Meta, StoryObj } from '@storybook/react';
import { PETooltip } from './PETooltip';

/**
 * Custom component
 */
const meta: Meta<typeof PETooltip> = {
    component: PETooltip,
    title: 'PETooltip',
    tags: ['autodocs'],
    render: ({ title, position }) => (
        <div className="m-12">
            <PETooltip title={title} position={position}>
                Children
            </PETooltip>
        </div>
    ),
};

export default meta;

export const Primary: StoryObj<typeof PETooltip> = {
    args: {
        title: 'title',
        position: 'bottom',
    },
};
