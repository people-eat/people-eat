import type { Meta, StoryObj } from '@storybook/react';
import { RatingCard } from './RatingCard';

const meta: Meta<typeof RatingCard> = {
    component: RatingCard,
    title: 'Cards/Rating Card',
};

export default meta;

export const Primary: StoryObj<typeof RatingCard> = {
    args: {
        authorName: 'Felix H.',
        body: 'Wir hatten einen hervorragenden Abend, schwer zu toppen, was und mit welcher Hingabe für uns gezaubert wurde!',
    },
};
