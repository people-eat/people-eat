import classNames from 'classnames';
import { CheckCircleIcon, InfoIcon } from 'lucide-react';
import Image from 'next/image';

export interface MealCardProps {
    title: string;
    description: string;
    imageUrl: string | null | undefined;
    onInfoClick: () => void;
}

export function MealCard({ title, description, imageUrl, onInfoClick }: MealCardProps) {
    // { 'shadow-[0px_0px_8px_4px_#f6ad55]': true }
    return (
        <li className={classNames('flex flex-col gap-2 rounded-xl shadow-md')}>
            <div className="group aspect-h-5 aspect-w-10 block w-full overflow-hidden rounded-t-xl bg-gray-100 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt=""
                        width={600}
                        height={400}
                        className="pointer-events-none object-cover group-hover:opacity-75"
                    />
                )}
                <button type="button" className="absolute inset-0 focus:outline-none">
                    <span className="sr-only">View details for {title}</span>
                </button>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center gap-4">
                    <p className="pointer-events-none line-clamp-2 text-md md:text-xl font-medium text-gray-900">{title}</p>
                </div>
                <p className="pointer-events-none text-md line-clamp-1 md:line-clamp-2 font-medium text-gray-500">{description}</p>

                <div className="mt-4 flex justify-between items-center">
                    <button onClick={onInfoClick}>
                        <InfoIcon strokeWidth={1} className="text-xs md:text-sm" />
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-x-2 rounded-full bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    >
                        <span>Ausgewählt</span>
                        <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                    </button>
                    {/* <button
                        type="button"
                        className="inline-flex items-center gap-x-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <span>Auswählen</span>
                        <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                    </button> */}
                </div>
            </div>
        </li>
    );
}
