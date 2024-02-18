import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PESearchBar } from './PESearchBar';

const meta: Meta<typeof PESearchBar> = {
    component: PESearchBar,
    title: 'Search Bar',
};

export default meta;

export const Primary: StoryObj<typeof PESearchBar> = {
    render: () => {
        const [adults, setAdults] = useState(2);
        const [kids, setKids] = useState(0);
        const [date, setDate] = useState(new Date());

        return (
            <PESearchBar
                onLocationSearchTextChange={() => undefined}
                locationSearchResults={[]}
                setSelectedLocation={() => undefined}
                adults={adults}
                setAdults={setAdults}
                kids={kids}
                setKids={setKids}
                date={date}
                setDate={setDate}
                onSearch={() => undefined}
            />
        );
    },
};
