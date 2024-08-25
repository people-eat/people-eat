import type { Meta, StoryObj } from '@storybook/react';
import { PETooltip } from './PETooltip';

/**
 *
 */
const meta: Meta<typeof PETooltip> = {
    component: PETooltip,
    title: 'PETooltip',
    render: ({ title, position }) => (
        <div className="m-12">
            <PETooltip title={title} position={position}>
                Children
            </PETooltip>
        </div>
    ),
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PETooltip> = {
    args: {
        title: 'title',
        position: 'bottom',
    },
};
