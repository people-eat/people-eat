import { PropsWithChildren, useState } from 'react';

export interface PETooltipProps {
    title: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const styles: Record<'top' | 'bottom' | 'left' | 'right', string> = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
};

export function PETooltip({ title, children, position = 'top' }: PropsWithChildren<PETooltipProps>) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            {isVisible && (
                <div className={`absolute z-10 p-4 text-sm text-black bg-gray-50 rounded-xl shadow-xl ${styles[position]}`}>{title}</div>
            )}
        </div>
    );
}
