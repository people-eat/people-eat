import type { Meta, StoryObj } from '@storybook/react';
import { PEBookingDetails } from './PEBookingDetails';

/**
 * Custom component.
 * Originally copied from TailwindUI.
 */
const meta: Meta<typeof PEBookingDetails> = {
    component: PEBookingDetails,
    title: 'PEBookingDetails',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PEBookingDetails> = {
    name: 'Minimal',
    args: {
        status: 'OPEN',
        occasion: 'Jahrestag',
        adultParticipants: 4,
        children: 0,
        dateTime: new Date(),
        location: { text: 'Maxdorf' },
        price: undefined,
        payoutPrice: undefined,
        travelExpenses: undefined,
        priceClass: undefined,
    },
};

export const ForGlobalBookingRequest: StoryObj<typeof PEBookingDetails> = {
    name: 'Globale Buchungsanfrage',
    args: {
        status: 'OPEN',
        occasion: 'Jarhestag',
        adultParticipants: 4,
        children: 0,
        dateTime: new Date(),
        location: { text: 'Maxdorf' },
        price: undefined,
        payoutPrice: undefined,
        travelExpenses: undefined,
        priceClass: {
            type: 'GOURMET',
            min: 0,
            max: 0,
            currencyCode: 'EUR',
        },
    },
};

export const BookingRequestCustomer: StoryObj<typeof PEBookingDetails> = {
    name: 'Koch / Menü Buchungsanfrage für Kunde',
    args: {
        status: 'OPEN',
        occasion: 'Jarhestag',
        adultParticipants: 4,
        children: 0,
        dateTime: new Date(),
        location: { text: 'Maxdorf' },
        price: { amount: 2345, currencyCode: '€' },
        payoutPrice: undefined,
        travelExpenses: undefined,
        priceClass: undefined,
    },
};

export const BookingRequestCook: StoryObj<typeof PEBookingDetails> = {
    name: 'Koch / Menü Buchungsanfrage für Koch',
    args: {
        status: 'OPEN',
        occasion: 'Jarhestag',
        adultParticipants: 4,
        children: 0,
        dateTime: new Date(),
        location: { text: 'Maxdorf' },
        price: { amount: 2345, currencyCode: '€' },
        payoutPrice: { amount: 1234, currencyCode: '€' },
        travelExpenses: undefined,
        priceClass: undefined,
    },
};
