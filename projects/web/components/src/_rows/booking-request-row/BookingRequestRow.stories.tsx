import type { Meta, StoryObj } from '@storybook/react';
import { BookingRequestRow } from './BookingRequestRow';

const meta: Meta<typeof BookingRequestRow> = {
    component: BookingRequestRow,
    title: 'Listen Zeilen/Buchungsanfrage',
};

export default meta;

export const Unselected: StoryObj<typeof BookingRequestRow> = {
    name: 'Nicht ausgewählt',
    render: () => {
        return (
            <ul className="divide-y divide-gray-100">
                {[1, 1, 1, 1, 1, 1].map((index) => (
                    <BookingRequestRow
                        occasion="Jahrestag"
                        dateTime={new Date()}
                        status="OPEN"
                        price={{ amount: 12.34, currencyCode: '€' }}
                        configuredMenuTitle=""
                        name="Maximilian"
                        selected={false}
                        onSelect={() => undefined}
                        mode="RECEIVED"
                    />
                ))}
            </ul>
        );
    },
};

export const Selected: StoryObj<typeof BookingRequestRow> = {
    name: 'Ausgewählt',
    render: () => {
        return (
            <ul className="divide-y divide-gray-100">
                {[1, 1, 1, 1, 1, 1].map((index) => (
                    <BookingRequestRow
                        occasion="Jahrestag"
                        dateTime={new Date()}
                        status="OPEN"
                        price={{ amount: 12.34, currencyCode: '€' }}
                        configuredMenuTitle=""
                        name="Maximilian"
                        selected={false}
                        onSelect={() => undefined}
                        mode="RECEIVED"
                    />
                ))}
            </ul>
        );
    },
};
