import { addScript } from './addScript';
import { FacebookQuery } from './FacebookQuery';

export function addScriptDefault(): FacebookQuery | undefined {
    if (typeof window === 'undefined') return;
    return addScript(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
}
