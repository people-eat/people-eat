import type { Meta, StoryObj } from '@storybook/react';
import { DoorClosedIcon, SearchIcon } from 'lucide-react';
import { PEIconButton } from './PEIconButton';

/**
 * Custom component.
 */
const meta: Meta<typeof PEIconButton> = {
    component: PEIconButton,
    title: 'Buttons/PEIconButton',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PEIconButton> = {
    args: {
        type: 'primary',
        children: <SearchIcon />,
    },
};

export const Secondary = {
    args: {
        type: 'secondary',
        children: <DoorClosedIcon />,
    },
};
