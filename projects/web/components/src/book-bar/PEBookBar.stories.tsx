import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PEBookBar } from './PEBookBar';
import { PriceClass } from '@people-eat/web-domain';

const meta: Meta<typeof PEBookBar> = {
    component: PEBookBar,
    title: 'Book Bar',
};

export default meta;

export const Primary: StoryObj<typeof PEBookBar> = {
    render: () => {
        const [adults, setAdults] = useState(2);
        const [kids, setKids] = useState(0);
        const [date, setDate] = useState(new Date());

        return (
            <PEBookBar
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

export const WithCostBreakdown: StoryObj<typeof PEBookBar> = {
    render: () => {
        const [adults, setAdults] = useState(2);
        const [kids, setKids] = useState(0);
        const [date, setDate] = useState(new Date());

        return (
            <PEBookBar
                onLocationSearchTextChange={() => undefined}
                locationSearchResults={[]}
                setSelectedLocation={() => undefined}
                adults={adults}
                setAdults={setAdults}
                kids={kids}
                setKids={setKids}
                date={date}
                setDate={setDate}
                costBreakdown={{
                    lineItems: [
                        {
                            title: 'Line Item 1',
                            price: { amount: 12.34, currencyCode: 'EUR' },
                        },
                        {
                            title: 'Line Item 2',
                            price: { amount: 12.34, currencyCode: 'EUR' },
                        },
                        {
                            title: 'Line Item 3',
                            price: { amount: 12.34, currencyCode: 'EUR' },
                        },
                        {
                            title: 'Line Item 4',
                            price: { amount: 12.34, currencyCode: 'EUR' },
                        },
                    ],
                    total: {
                        title: 'Summe',
                        price: { amount: 12.34, currencyCode: 'EUR' },
                    },
                }}
                onSearch={() => undefined}
            />
        );
    },
};

export const CookBooking: StoryObj<typeof PEBookBar> = {
    render: () => {
        const [adults, setAdults] = useState(2);
        const [kids, setKids] = useState(0);
        const [date, setDate] = useState(new Date());
        const [priceClass, setPriceClass] = useState<PriceClass>('FINE');

        return (
            <PEBookBar
                onLocationSearchTextChange={() => undefined}
                locationSearchResults={[]}
                setSelectedLocation={() => undefined}
                adults={adults}
                setAdults={setAdults}
                kids={kids}
                setKids={setKids}
                date={date}
                setDate={setDate}
                priceClass={{
                    value: priceClass,
                    onChange: setPriceClass,
                }}
                searchButton={{ title: 'Anfrage senden', onClick: () => undefined }}
            />
        );
    },
};
