import { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import './styles.css';

export default function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>PeopleEat</title>
            </Head>
            <main className="app">
                <Component {...pageProps} />
            </main>
        </>
    );
}
