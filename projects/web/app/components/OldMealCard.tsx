import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

interface PEMealCardProps {
    onClick: () => void;
    title: string;
    description: string;
    imageUrl?: string;
    active?: boolean;
    displayOnly?: boolean;
}

export const OldMealCard: React.FC<PEMealCardProps> = (props) => {
    const { onClick, title, description, imageUrl, active, displayOnly } = props;
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            onClick={onClick}
            style={{ width: isMobile ? 220 : 380 }}
            className={classNames('flex box-border gap-3 p-3 rounded shadow-md cursor-pointer', {
                'flex-row max-h-[144px]': !isMobile,
                'flex-col max-h-[340px]': isMobile,
                'shadow-orange': active && !displayOnly,
                'hover:shadow-lg': !active && !displayOnly,
                'shadow-lg': active && displayOnly,
            })}
        >
            <div
                className={classNames('flex rounded overflow-hidden justify-center items-center bg-gray-200', {
                    'min-w-[120px] h-[120px]': !isMobile,
                    'w-full h-[200px]': isMobile,
                })}
            >
                <Image
                    unoptimized
                    style={{ objectPosition: 'center', objectFit: 'cover' }}
                    src={imageUrl ?? '/placeholders/meal.png'}
                    alt={imageUrl ?? ''}
                    width={isMobile ? 200 : 120}
                    height={isMobile ? 200 : 120}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-lg font-bold text-black">{title}</span>
                <span className="text-sm text-black line-clamp-3">{description}</span>
            </div>
        </div>
    );
};
