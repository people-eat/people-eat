import classNames from 'classnames';

export interface PELabelButtonProps {
    title: string;
    selected: boolean;
    onSelect: () => void;
    onDeselect: () => void;
    className?: string;
}

export function PELabelButton({ title, selected, onSelect, onDeselect, className }: PELabelButtonProps) {
    // maybe just reference primary and secondary button
    if (!selected) {
        return (
            <button
                type="button"
                className={classNames(
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
                    'rounded-full bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                    'px-2.5 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 lg:px-3.5 lg:py-2 xl:px-4 xl:py-2.5',
                    'text-xs sm:text-sm',
                    className,
                )}
                onClick={onSelect}
            >
                {title}
            </button>
        );
    }

    return (
        <button
            type="button"
            className={classNames(
                'font-semibold text-white',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
                'rounded-full bg-orange-500 shadow-sm hover:bg-orange-400',
                'px-2.5 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 lg:px-3.5 lg:py-2 xl:px-4 xl:py-2.5',
                'text-xs sm:text-sm',
                className,
            )}
            onClick={onDeselect}
        >
            {title}
        </button>
    );
}
