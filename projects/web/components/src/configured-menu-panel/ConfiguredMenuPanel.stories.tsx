import type { Meta, StoryObj } from '@storybook/react';
import { ConfiguredMenuPanel } from './ConfiguredMenuPanel';

/**
 * Custom component.
 */
const meta: Meta<typeof ConfiguredMenuPanel> = {
    component: ConfiguredMenuPanel,
    title: 'ConfiguredMenuPanel',
    tags: ['autodocs'],
};

export default meta;

export const Canceled: StoryObj<typeof ConfiguredMenuPanel> = {
    args: {
        configuredMenu: {
            title: 'Candle Light Dinner',
            description:
                'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
            greetingFromKitchen: 'Gruß aus der Küche',
            courses: [
                {
                    index: 0,
                    title: 'Gang 1',
                    mealTitle: 'Vorspeisensalat',
                    mealDescription: '',
                    mealImageUrl: null,
                    mealType: 'MEAT',
                },
                {
                    index: 1,
                    title: 'Gang 2',
                    mealTitle: 'Argentinisches Rumpsteak',
                    mealDescription: '',
                    mealImageUrl: null,
                    mealType: 'MEAT',
                },
                {
                    index: 2,
                    title: 'Gang 3',
                    mealTitle: 'Schoko Lava Kuchen',
                    mealDescription: '',
                    mealImageUrl: null,
                    mealType: 'MEAT',
                },
            ],
        },
    },
};
