import { type CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://localhost:4000/graphql',
    documents: [
        'projects/web/domain/src/graphql/queries/**/*.graphql',
        'projects/web/domain/src/graphql/mutations/**/*.graphql',
        'projects/web/domain/src/graphql/fragments/**/*.graphql',
        'projects/web/domain/src/graphql/subscriptions/**/*.graphql',
    ],
    hooks: {
        // afterAllFileWrite: [
        //     'prettier --write ./src/data-source/generated/*',
        //     'eslint ./src/data-source/generated/* --ext js,cjs,mjs,jsx,ts,cts,mts,tsx --fix',
        // ],
    },
    generates: {
        './projects/web/domain/src/graphql/_generated/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
                fragmentMasking: false,
            },
            config: {
                typesPrefix: 'GQL',
                maybeValue: 'T | null',
                avoidOptionals: {
                    field: true,
                    object: false,
                    inputValue: false,
                    defaultValue: true,
                },
                enumsAsTypes: true,
                scalars: {
                    Date: 'string',
                    DateTime: 'Date',
                    EmailAddress: 'string',
                    Latitude: 'number',
                    Longitude: 'number',
                    PhoneNumber: 'string',
                    UnsignedInt: 'number',
                    URL: 'string',
                    UUID: 'string',
                    Upload: 'File',
                },
            },
        },
    },
    ignoreNoDocuments: true,
};

export default config;
