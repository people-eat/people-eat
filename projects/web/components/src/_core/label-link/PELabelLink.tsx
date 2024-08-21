import classNames from 'classnames';
import { PELink } from '../link/PELink';

export interface PELabelLinkProps {
    title: string;
    selected: boolean;
    href: string;
    className?: string;
}

export function PELabelLink({ title, selected, href, className }: PELabelLinkProps) {
    if (!selected) {
        return <PELink title={title} type="secondary" href={href} className={className} />;
    }

    return (
        <span
            className={classNames(
                'font-semibold text-white',
                'rounded-full bg-orange-500 shadow-sm',
                'px-4 py-2.5',
                'text-xs sm:text-sm',
                'select-none',
            )}
        >
            {title}
        </span>
    );
}
