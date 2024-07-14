import classNames from 'classnames';
import { primaryButtonClassName, secondaryButtonClassName } from './buttonClassNames';

export interface PEButtonProps {
    title: string;
    type?: 'primary' | 'secondary' | 'submit';
    onClick?: () => void;
    className?: string;
}

export function PEButton({ title, type = 'primary', onClick, className }: PEButtonProps) {
    if (type === 'submit') {
        return <input type="submit" className={classNames(primaryButtonClassName, className)} value={title} />;
    }

    if (type === 'secondary')
        return (
            <button type="button" className={classNames(secondaryButtonClassName, className)} onClick={onClick}>
                {title}
            </button>
        );

    return (
        <button type="button" className={classNames(primaryButtonClassName, className)} onClick={onClick}>
            {title}
        </button>
    );
}
