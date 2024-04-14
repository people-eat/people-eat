import { PriceClass, priceClassRanges, translatedPriceClasses } from '@people-eat/web-domain';
import classNames from 'classnames';

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
                <span>{translatedPriceClasses[priceClass]}</span>
                <span>{priceClassRanges[priceClass]}</span>
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
            <span>{translatedPriceClasses[priceClass]}</span>
            <span>{priceClassRanges[priceClass]}</span>
        </button>
    );
}
