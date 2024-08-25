import type { Meta, StoryObj } from '@storybook/react';
import { GlobalBookingRequestRow } from './GlobalBookingRequestRow';

/**
 * Custom component.
 */
const meta: Meta<typeof GlobalBookingRequestRow> = {
    component: GlobalBookingRequestRow,
    title: 'Listen Zeilen/Globale Buchungsanfrage',
    tags: ['autodocs'],
};

export default meta;

export const Unselected: StoryObj<typeof GlobalBookingRequestRow> = {
    name: 'Nicht Ausgewählt',
    render: () => {
        return (
            <ul className="divide-y divide-gray-100">
                <GlobalBookingRequestRow
                    occasion="Jahrestag"
                    priceClass="GOURMET"
                    dateTime={new Date()}
                    selected={false}
                    onSelect={() => undefined}
                />
            </ul>
        );
    },
};

export const Selected: StoryObj<typeof GlobalBookingRequestRow> = {
    name: 'Ausgewählt',
    render: () => {
        return (
            <ul className="divide-y divide-gray-100">
                <GlobalBookingRequestRow
                    occasion="Jahrestag"
                    priceClass="GOURMET"
                    dateTime={new Date()}
                    selected={true}
                    onSelect={() => undefined}
                />
            </ul>
        );
    },
};
