import classNames from 'classnames';

export interface PEButtonProps {
    title: string;
    type?: 'primary' | 'secondary' | 'submit';
    size?: 'dynamic' | 'constant';
    onClick?: () => void;
    className?: string;
}

export function PEButton({ title, type = 'primary', size = 'dynamic', onClick, className }: PEButtonProps) {
    if (type === 'submit') {
        return (
            <input
                type="submit"
                className={classNames(
                    'rounded-full bg-orange-500 font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 cursor-pointer',
                    { 'px-3 py-1.5 lg:px-3.5 lg:py-2 xl:px-4 xl:py-2.5': size === 'dynamic' },
                    { 'px-4 py-2.5': size === 'constant' },
                    { 'text-xs sm:text-sm': size === 'dynamic' },
                    { 'text-sm': size === 'constant' },
                    className,
                )}
                value={title}
            />
        );
    }

    if (type === 'secondary')
        return (
            <button
                type="button"
                className={classNames(
                    'rounded-full bg-white font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                    { 'px-3 py-1.5 lg:px-3.5 lg:py-2 xl:px-4 xl:py-2.5': size === 'dynamic' },
                    { 'px-4 py-2.5': size === 'constant' },
                    { 'text-xs sm:text-sm': size === 'dynamic' },
                    { 'text-sm': size === 'constant' },
                    className,
                )}
                onClick={onClick}
            >
                {title}
            </button>
        );

    return (
        <button
            type="button"
            className={classNames(
                'rounded-full bg-orange-500 font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500',
                { 'px-3 py-1.5 lg:px-3.5 lg:py-2 xl:px-4 xl:py-2.5': size === 'dynamic' },
                { 'px-4 py-2.5': size === 'constant' },
                { 'text-xs sm:text-sm': size === 'dynamic' },
                { 'text-sm': size === 'constant' },
                className,
            )}
            onClick={onClick}
        >
            {title}
        </button>
    );
}
