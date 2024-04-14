import { PriceClass } from './index';

export const translatedPriceClasses: Record<PriceClass, string> = {
    SIMPLE: 'Einfaches Menü',
    FINE: 'Fine-Dining Menü',
    GOURMET: 'Gourmet Menü',
};

export const priceClassRanges: Record<PriceClass, string> = {
    SIMPLE: '70.00 - 90.00 EUR',
    FINE: '90.00 - 130.00 EUR',
    GOURMET: 'ab 130.00 EUR',
};
