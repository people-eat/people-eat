import type { Meta } from '@storybook/react';
import { BookingStatusInfoPopover } from './BookingStatusInfoPopover';

/**
 * Depends on Dialog, Transition from @headlessui/react.
 */
const meta: Meta<typeof BookingStatusInfoPopover> = {
    component: BookingStatusInfoPopover,
    title: 'BookingStatusInfoPopover',
    tags: ['autodocs'],
};

export default meta;

export const Primary = {
    args: {},
};
