import { PriceClass } from '@people-eat/web-domain';
import classNames from 'classnames';

const titles: Record<PriceClass, string> = {
    SIMPLE: 'Einfaches Menü',
    FINE: 'Fine-Dining Menü',
    GOURMET: 'Gourmet Menü',
};

const priceRanges: Record<PriceClass, string> = {
    SIMPLE: '70.00 - 90.00 EUR',
    FINE: '90.00 - 130.00 EUR',
    GOURMET: 'ab 130.00 EUR',
};

export interface PEPriceClassCardProps {
    priceClass: PriceClass;
    selected: boolean;
    onSelect: () => void;
}

export function PEPriceClassCard({ priceClass, selected, onSelect }: PEPriceClassCardProps) {
    if (selected) {
        return (
            <button
                type="button"
                className={classNames(
                    'text-sm font-semibold text-white',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
                    'rounded-xl shadow-md p-4 bg-orange-500 hover:bg-orange-400',
                    'flex flex-col gap-2 items-center flex-1',
                )}
                onClick={onSelect}
            >
                <span>{titles[priceClass]}</span>
                <span>{priceRanges[priceClass]}</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            className={classNames(
                'text-sm font-semibold text-gray-900',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
                'rounded-xl shadow-md bg-white p-4 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                'flex flex-col gap-2 items-center flex-1',
            )}
            onClick={onSelect}
        >
            <span>{titles[priceClass]}</span>
            <span>{priceRanges[priceClass]}</span>
        </button>
    );
}
