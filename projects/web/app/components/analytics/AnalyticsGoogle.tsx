import Script from 'next/script';

export interface AnalyticsGoogleProps {
    enabled?: boolean | null;
}

export function AnalyticsGoogle({ enabled }: AnalyticsGoogleProps) {
    if (!enabled) return null;

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
        </>
    );
}
