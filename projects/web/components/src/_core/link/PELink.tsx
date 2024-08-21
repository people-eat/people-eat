import classNames from 'classnames';
import Link from 'next/link';
import { UrlObject } from 'url';
import { primaryButtonClassName, secondaryButtonClassName } from '../button/buttonClassNames';

export interface PELinkProps {
    title: string;
    type?: 'primary' | 'secondary';
    href: string | UrlObject;
    className?: string;
}

export function PELink({ title, type = 'primary', href, className }: PELinkProps) {
    if (type === 'secondary')
        return (
            <Link className={classNames(secondaryButtonClassName, className)} href={href}>
                {title}
            </Link>
        );

    return (
        <Link className={classNames(primaryButtonClassName, className)} href={href}>
            {title}
        </Link>
    );
}
