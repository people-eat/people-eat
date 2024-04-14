import type { Meta, StoryObj } from '@storybook/react';
import { BookingRequestRow } from './BookingRequestRow';

const meta: Meta<typeof BookingRequestRow> = {
    component: BookingRequestRow,
    title: 'Rows/Booking Request',
};

export default meta;

export const Heading: StoryObj<typeof BookingRequestRow> = {
    render: () => {
        return (
            <ul className="divide-y divide-gray-100">
                {[1, 1, 1, 1, 1, 1].map((index) => (
                    <BookingRequestRow key={index} occasion="Hochzeit" priceClass="GOURMET" />
                ))}
            </ul>
        );
    },
};
