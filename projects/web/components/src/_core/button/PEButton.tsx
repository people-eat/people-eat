import classNames from 'classnames';
import { disabledButtonClassName, primaryButtonClassName, secondaryButtonClassName } from './buttonClassNames';

export interface PEButtonProps {
    title: string;
    type?: 'primary' | 'secondary' | 'submit';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    stopEventPropagation?: boolean;
}

export function PEButton({ title, type = 'primary', onClick, disabled, className, stopEventPropagation }: PEButtonProps) {
    if (disabled) {
        return (
            <div className={classNames(disabledButtonClassName, className)} onClick={onClick}>
                {title}
            </div>
        );
    }

    if (type === 'submit') {
        return <input type="submit" className={classNames(primaryButtonClassName, className)} value={title} />;
    }

    if (type === 'secondary')
        return (
            <button
                type="button"
                className={classNames(secondaryButtonClassName, className)}
                onClick={(e) => {
                    stopEventPropagation && e.stopPropagation();
                    onClick?.();
                }}
            >
                {title}
            </button>
        );

    return (
        <button
            type="button"
            className={classNames(primaryButtonClassName, className)}
            onClick={(e) => {
                stopEventPropagation && e.stopPropagation();
                onClick?.();
            }}
        >
            {title}
        </button>
    );
}
