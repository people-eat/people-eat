import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.tsx'],
    // https://storybook.js.org/addons/storybook-addon-dependencies
    addons: ['@storybook/addon-essentials', 'storybook-addon-dependencies'],
    framework: {
        name: '@storybook/nextjs',
        options: {
            builder: {
                useSWC: true,
            },
        },
    },
};

export default config;
