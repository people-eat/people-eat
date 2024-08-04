import { addScriptDefault } from './addScriptDefault';
import { FacebookQuery } from './FacebookQuery';

export interface Setup {
    $fbq: FacebookQuery;
    init(pixelId: string, autoconfig?: boolean): Setup | undefined;
    pageView(pixelId?: string): Setup | undefined;
}

export function setup($fbq: FacebookQuery | undefined = addScriptDefault()): Setup | undefined {
    function init(pixelId: string, autoconfig = true): Setup | undefined {
        $fbq?.('set', 'autoConfig', autoconfig, pixelId);
        $fbq?.('init', pixelId);
        return setup($fbq);
    }

    function pageView(pixelId: string): Setup | undefined {
        if (pixelId === undefined) {
            $fbq?.('track', 'PageView');
        } else {
            $fbq?.('trackSingle', pixelId, 'PageView');
        }
        return setup($fbq);
    }

    if (!$fbq) return;

    return {
        $fbq,
        init,
        pageView,
    };
}
