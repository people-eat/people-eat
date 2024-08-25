import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
    title: 'Design/Design',
    tags: ['autodocs'],
    parameters: {
        docs: {
            toc: true,
        },
    },
};

export default meta;

/**
 * Die Font Size bestimmt die Größe von Texten.
 */
export const FontSizes: StoryObj = {
    render: () => {
        return (
            <div className="grid grid-cols-2">
                <span>xs</span>
                <span className="text-xs">Title</span>

                <span>sm</span>
                <span className="text-sm">Title</span>

                <span>md</span>
                <span className="text-md">Title</span>

                <span>lg</span>
                <span className="text-lg">Title</span>

                <span>xl</span>
                <span className="text-xl">Title</span>

                <span>2xl</span>
                <span className="text-2xl">Title</span>
            </div>
        );
    },
};

/**
 * Die Font Weight bestimmt die Dicke von Texten.
 */
export const FontWeights: StoryObj = {
    render: () => {
        return (
            <div className="grid grid-cols-2">
                <span>thin</span>
                <span className="font-thin">Title</span>

                <span>extralight</span>
                <span className="font-extralight">Title</span>

                <span>light</span>
                <span className="font-light">Title</span>

                <span>normal</span>
                <span className="font-normal">Title</span>

                <span>medium</span>
                <span className="font-medium">Title</span>

                <span>semibold</span>
                <span className="font-semibold">Title</span>

                <span>bold</span>
                <span className="font-bold">Title</span>

                <span>extrabold</span>
                <span className="font-extrabold">Title</span>

                <span>black</span>
                <span className="font-black">Title</span>
            </div>
        );
    },
};

export const Colors: StoryObj = {
    render: () => {
        return (
            <div className="grid grid-cols-2">
                <span>orange-400</span>
                <span className="bg-orange-400" />

                <span>orange-500</span>
                <span className="bg-orange-500" />

                <span>orange-600</span>
                <span className="bg-orange-600" />

                <span>gray-50</span>
                <span className="gray-50" />

                <span>gray-400</span>
                <span className="bg-gray-400" />

                <span>gray-500</span>
                <span className="bg-gray-500" />

                <span>gray-600</span>
                <span className="bg-gray-600" />

                <span>gray-800</span>
                <span className="bg-gray-800" />

                <span>gray-900</span>
                <span className="bg-gray-900" />
            </div>
        );
    },
};
