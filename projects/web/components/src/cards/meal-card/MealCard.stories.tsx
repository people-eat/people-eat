import type { Meta, StoryObj } from '@storybook/react';
import { MealCard } from './MealCard';

const meta: Meta<typeof MealCard> = {
    component: MealCard,
    title: 'Cards/Meal Card',
};

export default meta;

export const Primary: StoryObj<typeof MealCard> = {
    args: {
        title: 'Argentinisches Rumpsteak',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores illo earum aspernatur atque eius iusto iste? Pariatur sint vitae eum commodi aspernatur sapiente facere. Labore beatae qui ab quos cum.',
        imageUrl:
            'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
    },
    render: ({ title, description, imageUrl }) => {
        return (
            <div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    <MealCard title={title} description={description} imageUrl={imageUrl} />
                    <MealCard title={title} description={description} imageUrl={imageUrl} />
                    <MealCard title={title} description={description} imageUrl={imageUrl} />
                    <MealCard title={title} description={description} imageUrl={imageUrl} />
                </ul>
            </div>
        );
    },
};
