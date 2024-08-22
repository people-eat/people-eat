import type { Meta, StoryObj } from '@storybook/react';
import { MenuCard } from './MenuCard';

const meta: Meta<typeof MenuCard> = {
    component: MenuCard,
    title: 'Cards/Menu Card',
};

export default meta;

export const Primary: StoryObj<typeof MenuCard> = {
    args: {
        title: 'abc',
        imageUrls: [
            'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
        ],
        kitchenTitle: 'Asiatisch',
        cook: {
            firstName: 'Maximilian',
            profilePictureUrl: null,
        },
        courseCount: 4,
        pricePerPerson: '12.34 EUR',
        categoryTitles: ['Category A', 'Category B'],
    },
};

export const Heading: StoryObj<typeof MenuCard> = {
    args: {
        title: 'Candle Light Dinner',
        imageUrls: [
            'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
        ],
        kitchenTitle: 'Asiatisch',
        cook: {
            firstName: 'Maximilian',
            profilePictureUrl: null,
        },
        courseCount: 4,
        pricePerPerson: '12.34 EUR',
        categoryTitles: ['Category A', 'Category B'],
    },
    render: ({ title, imageUrls, kitchenTitle, cook, courseCount, pricePerPerson, categoryTitles }) => {
        return (
            <div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    <MenuCard
                        title={title}
                        imageUrls={imageUrls}
                        kitchenTitle={kitchenTitle}
                        cook={cook}
                        courseCount={courseCount}
                        pricePerPerson={pricePerPerson}
                        categoryTitles={categoryTitles}
                    />
                </ul>
            </div>
        );
    },
};
