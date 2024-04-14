import { PEButton } from '@people-eat/web-core-components';
import classNames from 'classnames';
import { CheckCircleIcon, Circle, InfoIcon } from 'lucide-react';
import Image from 'next/image';

interface MealCardBaseProps {
    type: MealCardType;
    title: string;
    description: string;
    imageUrl: string | null | undefined;
    onInfoClick?: () => void;
}

type MealCardType = 'SIMPLE' | 'SELECTION' | 'BUTTON';

interface MealCardSimpleProps extends MealCardBaseProps {
    type: 'SIMPLE';
}

interface MealCardSelectionProps extends MealCardBaseProps {
    type: 'SELECTION';
    selected: boolean;
    onSelect: () => void;
    onDeselect?: () => void;
}

function isSelectionMealCard(props: MealCardProps): props is MealCardSelectionProps {
    return 'selected' in props;
}

interface MealCardButtonProps extends MealCardBaseProps {
    type: 'BUTTON';
    button?: {
        title: string;
        type: 'PRIMARY' | 'SECONDARY';
        onClick: () => void;
    };
}

function isButtonMealCard(props: MealCardProps): props is MealCardButtonProps {
    return 'button' in props;
}

export type MealCardProps = MealCardSimpleProps | MealCardSelectionProps | MealCardButtonProps;

export function MealCard(props: MealCardProps) {
    const { title, description, imageUrl, onInfoClick } = props;

    return (
        <li className={classNames('flex flex-col gap-2 rounded-xl shadow-md', 'group-hover:opacity-75')}>
            <div className="group aspect-h-5 aspect-w-10 block w-full overflow-hidden rounded-t-xl bg-gray-100 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                <Image
                    src={imageUrl ?? '/placeholders/meal.png'}
                    alt=""
                    width={600}
                    height={400}
                    className="pointer-events-none object-cover"
                />
                {/* {!isButtonMealCard(props) && !isSelectionMealCard(props) && (
                    <button type="button" className="absolute inset-0 focus:outline-none" onClick={onClick}>
                        <span className="sr-only">View details for </span>
                    </button>
                )} */}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center gap-4">
                    <p className="pointer-events-none line-clamp-1 text-md md:text-xl font-medium text-gray-900">{title}</p>
                </div>
                <p className="pointer-events-none text-md line-clamp-1 md:line-clamp-2 font-medium text-gray-500">
                    {description === '' ? 'Ohne Beschreibung' : description}
                </p>

                <div className="mt-4 flex justify-between items-center">
                    {onInfoClick && (
                        <button
                            type="button"
                            onClick={onInfoClick}
                            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                        >
                            <InfoIcon strokeWidth={1} className="text-xs md:text-sm" />
                        </button>
                    )}

                    {isButtonMealCard(props) && props.button && (
                        <PEButton
                            title={props.button.title}
                            type={props.button.type === 'PRIMARY' ? 'primary' : 'secondary'}
                            onClick={props.button.onClick}
                        />
                    )}

                    {isSelectionMealCard(props) && (
                        <>
                            {props.selected && !props.onDeselect && (
                                <div className="inline-flex items-center gap-x-2 rounded-full bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm">
                                    <span>Ausgewählt</span>
                                    <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                                </div>
                            )}
                            {props.selected && props.onDeselect && (
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-x-2 rounded-full bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
                                    onClick={props.onDeselect}
                                >
                                    <span>Ausgewählt</span>
                                    <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                                </button>
                            )}
                            {!props.selected && (
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-x-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    onClick={props.onSelect}
                                >
                                    <span>Auswählen</span>
                                    <Circle className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </li>
    );
}
