import classNames from 'classnames';
import { CheckCircleIcon, Circle, InfoIcon } from 'lucide-react';
import Image from 'next/image';

export interface MealSelectionCardProps {
    title: string;
    description: string;
    imageUrl: string | null | undefined;
    selected: boolean;
    onSelect: () => void;
    // for menu booking we have a single select, so this should not be provided
    // for the course creation during menu creation we allow deselecting because it is a multi selection
    onDeselect?: () => void;
    onInfoClick: () => void;
}

export function MealSelectionCard({ title, description, imageUrl, selected, onSelect, onDeselect, onInfoClick }: MealSelectionCardProps) {
    return (
        <li className={classNames('flex flex-col gap-2 rounded-xl shadow-md')}>
            <div className="group aspect-h-5 aspect-w-10 block w-full overflow-hidden rounded-t-xl bg-gray-100">
                <Image
                    unoptimized
                    src={imageUrl ?? '/placeholders/meal.png'}
                    alt=""
                    width={600}
                    height={400}
                    className="pointer-events-none object-cover group-hover:opacity-75"
                />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center gap-4">
                    <p className="pointer-events-none line-clamp-2 text-md md:text-xl font-medium text-gray-900">{title}</p>
                </div>
                <p className="pointer-events-none text-md line-clamp-1 md:line-clamp-2 font-medium text-gray-500">{description}</p>

                <div className="mt-4 flex justify-between items-center gap-4">
                    <button onClick={onInfoClick}>
                        <InfoIcon strokeWidth={1} className="text-xs md:text-sm" />
                    </button>
                    {selected && !onDeselect && (
                        <div className="inline-flex items-center gap-x-2 rounded-full bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm">
                            <span>Ausgewählt</span>
                            <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                        </div>
                    )}
                    {selected && onDeselect && (
                        <button
                            type="button"
                            className="inline-flex items-center gap-x-2 rounded-full bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
                            onClick={onDeselect}
                        >
                            <span>Ausgewählt</span>
                            <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                        </button>
                    )}
                    {!selected && (
                        <button
                            type="button"
                            className="inline-flex items-center gap-x-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={onSelect}
                        >
                            <span>Auswählen</span>
                            <Circle className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
}
