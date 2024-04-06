import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { clarity } from 'react-microsoft-clarity';
import 'tailwindcss/tailwind.css';
import { createComplexApolloClient } from '../network/apolloClients';
import './styles.css';

const apolloClient = createComplexApolloClient();

export default function CustomApp({ Component, pageProps }: AppProps) {
    useEffect(() => clarity.init('l6qxwo5j7v'));

    return (
        <>
            <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=G-165LKCGVJJ`} />

            <Script id="ga-script" strategy="lazyOnload">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-165LKCGVJJ', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>

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
