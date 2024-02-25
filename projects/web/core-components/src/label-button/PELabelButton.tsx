import classNames from 'classnames';

export interface PELabelButtonProps {
    title: string;
    selected: boolean;
    onSelect: () => void;
    onDeselect: () => void;
}

export function PELabelButton({ title, selected, onSelect, onDeselect }: PELabelButtonProps) {
    // maybe just reference primary and secondary button
    if (!selected) {
        return (
            <button
                type="button"
                className={classNames(
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
                    'rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
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
                'px-4 py-2.5',
                'text-sm font-semibold text-white',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
                'rounded-full bg-orange-500 shadow-sm hover:bg-orange-400',
            )}
            onClick={onDeselect}
        >
            {title}
        </button>
    );
}
