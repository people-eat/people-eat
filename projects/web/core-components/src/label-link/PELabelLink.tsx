import classNames from 'classnames';

export interface PELabelLinkProps {
    title: string;
    selected: boolean;
    href: string;
}

export function PELabelLink({ title, selected, href }: PELabelLinkProps) {
    if (!selected) {
        return (
            <a
                className={classNames(
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
                    'rounded-full bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                    'px-2.5 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 lg:px-3.5 lg:py-2 xl:px-4 xl:py-2.5',
                    'text-xs sm:text-sm',
                )}
                href={href}
            >
                {title}
            </a>
        );
    }

    return (
        <span
            className={classNames(
                'font-semibold text-white',
                'rounded-full bg-orange-500 shadow-sm',
                'px-2.5 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 lg:px-3.5 lg:py-2 xl:px-4 xl:py-2.5',
                'text-xs sm:text-sm',
            )}
        >
            {title}
        </span>
    );
}
