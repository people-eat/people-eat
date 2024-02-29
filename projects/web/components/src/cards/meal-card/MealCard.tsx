import classNames from 'classnames';
import { InfoIcon } from 'lucide-react';
import Image from 'next/image';

export interface MealCardProps {
    title: string;
    description: string;
    imageUrl: string | null | undefined;
    onClick?: () => void;
    onInfoClick?: () => void;
}

export function MealCard({ title, description, imageUrl, onClick, onInfoClick }: MealCardProps) {
    return (
        <li className={classNames('flex flex-col gap-2 rounded-xl shadow-md', 'group-hover:opacity-75')}>
            <div className="group aspect-h-5 aspect-w-10 block w-full overflow-hidden rounded-t-xl bg-gray-100 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                <Image
                    unoptimized
                    src={imageUrl ?? '/placeholders/meal.png'}
                    alt=""
                    width={600}
                    height={400}
                    className="pointer-events-none object-cover"
                />
                <button type="button" className="absolute inset-0 focus:outline-none" onClick={onClick}>
                    <span className="sr-only">View details for </span>
                </button>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center gap-4">
                    <p className="pointer-events-none line-clamp-2 text-md md:text-xl font-medium text-gray-900">{title}</p>
                </div>
                <p className="pointer-events-none text-md line-clamp-1 md:line-clamp-2 font-medium text-gray-500">{description}</p>

                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={onInfoClick}
                        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                        <InfoIcon strokeWidth={1} className="text-xs md:text-sm" />
                    </button>
                </div>
            </div>
        </li>
    );
}
