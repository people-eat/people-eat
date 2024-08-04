/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FacebookQuery } from './FacebookQuery';

declare global {
    interface Window {
        fbq?: FacebookQuery;
        _fbq?: FacebookQuery;
    }
}

export function addScript(
    windowInstance: Window,
    b: Document,
    e: string,
    v: string,
    fbq?: FacebookQuery,
    t?: HTMLScriptElement,
    s?: HTMLScriptElement,
): FacebookQuery | undefined {
    if (windowInstance.fbq) {
        return windowInstance.fbq;
    }

    // @ts-expect-error
    fbq = windowInstance.fbq = function () {
        // @ts-expect-error
        if (fbq?.callMethod) {
            // @ts-expect-error
            // eslint-disable-next-line prefer-spread, prefer-rest-params
            fbq?.callMethod.apply(fbq, arguments);
        } else {
            // @ts-expect-error
            // eslint-disable-next-line prefer-rest-params
            fbq.queue.push(arguments);
        }
    };

    if (!windowInstance._fbq) {
        windowInstance._fbq = fbq;
    }

    // @ts-expect-error
    fbq.push = fbq;
    // @ts-expect-error
    fbq.loaded = true;
    // @ts-expect-error
    fbq.version = '2.0';
    // @ts-expect-error
    fbq.queue = [];

    // @ts-expect-error
    t = b.createElement(e);
    // @ts-expect-error
    s = b.getElementsByTagName(e)[0];
    if (t) {
        t.async = true;
        t.src = v;
        s?.parentNode?.insertBefore(t, s);
    }

    return fbq;
}
