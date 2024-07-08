import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import { CookieBannerDialog } from '../components/CookieBannerDialog';
import { createComplexApolloClient } from '../network/apolloClients';
import './styles.css';

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
                    <CookieBannerDialog />
                </ApolloProvider>
            </main>
        </>
    );
}
