import type { Meta, StoryObj } from '@storybook/react';
import { BookBar } from './BookBar';

/**
 * Custom component.
 */
const meta: Meta<typeof BookBar> = {
    component: BookBar,
    title: 'BookBar',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof BookBar> = {
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
        allergies: {
            allergyOptions: [{ title: 'Allergie A', allergyId: 'A' }],
            selectedAllergies: [],
            onChange: () => undefined,
        },
    },
};
