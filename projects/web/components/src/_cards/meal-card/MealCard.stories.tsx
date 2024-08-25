import type { Meta, StoryObj } from '@storybook/react';
import { MealCard } from './MealCard';

/**
 * Custom component.
 */
const meta: Meta<typeof MealCard> = {
    component: MealCard,
    title: 'Cards/Meal Card',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof MealCard> = {
    render: () => {
        const description =
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores illo earum aspernatur atque eius iusto iste? Pariatur sint vitae eum commodi aspernatur sapiente facere. Labore beatae qui ab quos cum.';

        const imageUrl =
            'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80';

        return (
            <div>
                <ul className="grid grid-cols-1 gap-x-4 gap-y-8 sm:gap-x-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
                    <MealCard
                        type="BUTTON"
                        title="Kurzer Titel"
                        description="Kurze Beschreibung"
                        imageUrl={imageUrl}
                        button={{
                            title: 'click me',
                            type: 'PRIMARY',
                            onClick: () => undefined,
                        }}
                    />

                    <MealCard
                        type="BUTTON"
                        title="Kurzer Titel"
                        description="Kurze Beschreibung"
                        imageUrl={imageUrl}
                        button={{
                            title: 'click me',
                            type: 'SECONDARY',
                            onClick: () => undefined,
                        }}
                    />

                    <MealCard
                        type="SIMPLE"
                        title="Längerer Titel Längerer Titel"
                        description={description}
                        imageUrl={imageUrl}
                        onInfoClick={() => undefined}
                    />

                    <MealCard type="SIMPLE" title="Längerer Titel Längerer Titel" description={description} imageUrl={imageUrl} />

                    <MealCard
                        type="SELECTION"
                        title="Kurzer Titel"
                        description={description}
                        imageUrl={imageUrl}
                        selected={false}
                        onSelect={() => undefined}
                        onDeselect={() => undefined}
                    />

                    <MealCard
                        type="SELECTION"
                        title="Kurzer Titel"
                        description={description}
                        imageUrl={imageUrl}
                        selected={true}
                        onSelect={() => undefined}
                        onDeselect={() => undefined}
                    />

                    <MealCard
                        type="SELECTION"
                        title="Kurzer Titel"
                        description={description}
                        imageUrl={imageUrl}
                        selected={false}
                        onSelect={() => undefined}
                        onDeselect={() => undefined}
                        onInfoClick={() => undefined}
                    />

                    <MealCard
                        type="SELECTION"
                        title="Kurzer Titel"
                        description={description}
                        imageUrl={imageUrl}
                        selected={true}
                        onSelect={() => undefined}
                        onDeselect={() => undefined}
                        onInfoClick={() => undefined}
                    />

                    <MealCard
                        type="SIMPLE"
                        title="Ohne Bild"
                        description="Kurze Beschreibung"
                        imageUrl={undefined}
                        onInfoClick={() => undefined}
                    />
                </ul>
            </div>
        );
    },
};
