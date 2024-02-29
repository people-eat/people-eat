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
                    'rounded-full bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                )}
                href={href}
            >
                {title}
            </a>
        );
    }

    return (
        <span className={classNames('px-4 py-2.5', 'text-sm font-semibold text-white', 'rounded-full bg-orange-500 shadow-sm')}>
            {title}
        </span>
    );
}
