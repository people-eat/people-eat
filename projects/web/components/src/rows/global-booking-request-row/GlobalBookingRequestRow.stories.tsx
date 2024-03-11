import type { Meta, StoryObj } from '@storybook/react';
import { GlobalBookingRequestRow } from './GlobalBookingRequestRow';

const meta: Meta<typeof GlobalBookingRequestRow> = {
    component: GlobalBookingRequestRow,
    title: 'Rows/Global Booking Request',
};

export default meta;

export const Heading: StoryObj<typeof GlobalBookingRequestRow> = {
    render: () => {
        return (
            <ul className="divide-y divide-gray-100">
                {[1, 1, 1, 1, 1, 1].map((index) => (
                    <GlobalBookingRequestRow key={index} occasion="Hochzeit" priceClass="GOURMET" />
                ))}
            </ul>
        );
    },
};
