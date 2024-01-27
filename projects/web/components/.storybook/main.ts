import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.tsx'],
    addons: ['@storybook/addon-essentials'],
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
