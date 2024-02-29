import classNames from 'classnames';
import { PropsWithChildren } from 'react';

interface PEProfileCardProps {
    title?: string;
    className?: string;
}

export function PEProfileCard({ title, className, children }: PropsWithChildren<PEProfileCardProps>) {
    return (
        <div className={classNames('rounded-2xl shadow-lg p-8', className)}>
            {title && <span className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{title}</span>}
            {children}
        </div>
    );
}
