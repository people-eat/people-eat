import type { Meta, StoryObj } from '@storybook/react';
import { BookingRequestRow } from './BookingRequestRow';

/**
 * Custom component.
 */
const meta: Meta<typeof BookingRequestRow> = {
    component: BookingRequestRow,
    title: 'Listen Zeilen/Buchungsanfrage',
    tags: ['autodocs'],
};

export default meta;

export const Unselected: StoryObj<typeof BookingRequestRow> = {
    name: 'Nicht ausgewählt',
    render: () => {
        return (
            <ul className="divide-y divide-gray-100">
                <BookingRequestRow
                    occasion="Jahrestag"
                    dateTime={new Date()}
                    status="OPEN"
                    price={{ amount: 1234, currencyCode: '€' }}
                    configuredMenuTitle=""
                    name="Maximilian"
                    selected={false}
                    onSelect={() => undefined}
                    mode="RECEIVED"
                />
            </ul>
        );
    },
};

export const Selected: StoryObj<typeof BookingRequestRow> = {
    name: 'Ausgewählt',
    render: () => {
        return (
            <ul className="divide-y divide-gray-100">
                <BookingRequestRow
                    occasion="Jahrestag"
                    dateTime={new Date()}
                    status="OPEN"
                    price={{ amount: 1234, currencyCode: '€' }}
                    configuredMenuTitle=""
                    name="Maximilian"
                    selected={true}
                    onSelect={() => undefined}
                    mode="RECEIVED"
                />
            </ul>
        );
    },
};

export const MenuBooking: StoryObj<typeof BookingRequestRow> = {
    name: 'Menü Buchung',
    render: () => {
        return (
            <ul className="divide-y divide-gray-100">
                <BookingRequestRow
                    occasion="Jahrestag"
                    dateTime={new Date()}
                    status="OPEN"
                    price={{ amount: 1234, currencyCode: '€' }}
                    configuredMenuTitle="Candle Light Dinner"
                    name="Maximilian"
                    selected={false}
                    onSelect={() => undefined}
                    mode="RECEIVED"
                />
            </ul>
        );
    },
};
