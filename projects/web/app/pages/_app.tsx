import { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import './styles.css';
import { ApolloProvider } from '@apollo/client';
import { createComplexApolloClient } from '../network/apolloClients';

const apolloClient = createComplexApolloClient();

export default function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>PeopleEat</title>
            </Head>
            <main className="app">
                <ApolloProvider client={apolloClient}>
                    <Component {...pageProps} />
                </ApolloProvider>
            </main>
        </>
    );
}
