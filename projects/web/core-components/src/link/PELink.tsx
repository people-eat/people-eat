import classNames from 'classnames';
import Link from 'next/link';
import { UrlObject } from 'url';

export interface PELinkProps {
    title: string;
    type?: 'primary' | 'secondary';
    href: string | UrlObject;
    className?: string;
}

export function PELink({ title, type = 'primary', href, className }: PELinkProps) {
    if (type === 'secondary')
        return (
            <Link
                className={classNames(
                    'rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                    className,
                )}
                href={href}
            >
                {title}
            </Link>
        );

    return (
        <Link
            className={classNames(
                'rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
                className,
            )}
            href={href}
        >
            {title}
        </Link>
    );
}
