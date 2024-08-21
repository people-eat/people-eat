import { PropsWithChildren } from 'react';

export interface PEIconButtonProps {
    type?: 'primary' | 'secondary' | 'purple';
    onClick: () => void;
    disabled?: boolean;
}

export function PEIconButton({ children, type = 'primary', onClick, disabled = false }: PropsWithChildren<PEIconButtonProps>) {
    if (type === 'secondary')
        return (
            <button
                type="button"
                className="rounded-full bg-white-500 px-4 py-2.5 text-sm font-semibold text-orange-400 outline-2 outline-orange-500 shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        );

    if (type === 'purple') {
        return (
            <button
                type="button"
                className="rounded-full bg-purple-950 p-4 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        );
    }

    return (
        <button
            type="button"
            className="rounded-full bg-orange-500 p-4 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
