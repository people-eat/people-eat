const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [join(__dirname, 'pages/**/*.tsx'), ...createGlobPatternsForDependencies(__dirname)],
    theme: {
        extend: {},
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    mode: 'jit',
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};
