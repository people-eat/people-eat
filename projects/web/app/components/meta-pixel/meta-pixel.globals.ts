import { FacebookQuery } from './FacebookQuery';

declare global {
    interface Window {
        fbq?: FacebookQuery;
        _fbq?: FacebookQuery;
    }
}
