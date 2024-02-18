import type { Meta, StoryObj } from '@storybook/react';
import { CookCard } from './CookCard';

const meta: Meta<typeof CookCard> = {
    component: CookCard,
    title: 'Cards/Cook Card',
};

export default meta;

export const Heading: StoryObj<typeof CookCard> = {
    args: {
        cookId: 'abc',
        user: {
            firstName: 'Maximilian',
            profilePictureUrl: 'https://api.people-eat.com/profile-pictures/y51uol86Q0nDTbJzBtQC',
        },
        rank: 'Chefkoch',
        menuCount: 8,
        cityName: 'München',
    },
    render: ({ cookId, user, rank, menuCount, cityName }) => {
        return (
            <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
                <h2 className="sr-only">Köche</h2>

                <div className="-mx-px grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
                    {[1, 1, 1, 1, 1, 1].map(() => (
                        <CookCard cookId={cookId} user={user} rank={rank} menuCount={menuCount} cityName={cityName} />
                    ))}
                </div>
            </div>
        );
    },
};
