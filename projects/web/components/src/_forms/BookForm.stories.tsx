import type { Meta, StoryObj } from '@storybook/react';
import { BookForm } from './BookForm';

const meta: Meta<typeof BookForm> = {
    component: BookForm,
    title: 'Formulare/Buchungsformular',
    tags: ['autodocs'],
};

export default meta;

export const WithCostBreakdown: StoryObj<typeof BookForm> = {
    name: 'Mit Kostenaufschlüsselung',
    args: {
        onLocationSearchTextChange: (changedLocationSearchText) => undefined,
        locationSearchResults: [],
        selectedLocation: undefined,
        setSelectedLocation: (location) => undefined,
        isOutOfTravelRadius: false,
        adults: 4,
        setAdults: (changedAdults: number) => undefined,
        kids: 2,
        setKids: (changedKids: number) => undefined,
        date: new Date(),
        setDate: (changedDate: Date) => undefined,
        time: { hours: 12, minutes: 30 },
        setTime: (changedTime) => undefined,
        message: '',
        setMessage: (changedMessage: string) => undefined,
        occasion: '',
        setOccasion: (changedOccasion: string) => undefined,

        searchButton: {
            title: 'Jetzt buchen',
            onClick: () => undefined,
        },

        costBreakdown: {
            lineItems: [
                {
                    title: 'Line Item 1',
                    price: { amount: 12.34, currencyCode: '€' },
                },
                {
                    title: 'Line Item 2',
                    price: { amount: 12.34, currencyCode: '€' },
                },
                {
                    title: 'Line Item 3',
                    price: { amount: 12.34, currencyCode: '€' },
                },
                {
                    title: 'Line Item 4',
                    price: { amount: 12.34, currencyCode: '€' },
                },
            ],
            total: {
                title: 'Summe',
                price: { amount: 12.34, currencyCode: '€' },
            },
        },
    },
};

export const WithoutCostBreakdown: StoryObj<typeof BookForm> = {
    name: 'Ohne Kostenaufschlüsselung',
    args: {
        onLocationSearchTextChange: (changedLocationSearchText) => undefined,
        locationSearchResults: [],
        selectedLocation: undefined,
        setSelectedLocation: (location) => undefined,
        isOutOfTravelRadius: false,
        adults: 4,
        setAdults: (changedAdults: number) => undefined,
        kids: 2,
        setKids: (changedKids: number) => undefined,
        date: new Date(),
        setDate: (changedDate: Date) => undefined,
        time: { hours: 12, minutes: 30 },
        setTime: (changedTime) => undefined,
        message: '',
        setMessage: (changedMessage: string) => undefined,
        occasion: '',
        setOccasion: (changedOccasion: string) => undefined,

        searchButton: {
            title: 'Jetzt buchen',
            onClick: () => undefined,
        },
    },
};
