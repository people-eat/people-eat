import type { Meta, StoryObj } from '@storybook/react';
import { BookingRequestStatusPill } from './BookingRequestStatusPill';

const meta: Meta<typeof BookingRequestStatusPill> = {
    component: BookingRequestStatusPill,
    title: 'BookingRequestStatusPill',
};

export default meta;

export const Canceled: StoryObj<typeof BookingRequestStatusPill> = {
    args: {
        status: 'CANCELED',
    },
};
export const Completed: StoryObj<typeof BookingRequestStatusPill> = {
    args: {
        status: 'COMPLETED',
    },
};
export const Open: StoryObj<typeof BookingRequestStatusPill> = {
    args: {
        status: 'OPEN',
    },
};
export const Pending: StoryObj<typeof BookingRequestStatusPill> = {
    args: {
        status: 'PENDING',
    },
};
