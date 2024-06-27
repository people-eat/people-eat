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
    className?: string;
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
    const { title, description, imageUrl, onInfoClick, className } = props;

    return (
        <li className={classNames('flex flex-col lg:flex-row-reverse rounded-xl shadow-md bg-white', className)}>
            <Image
                src={imageUrl || '/placeholders/meal.png'}
                alt=""
                width={200}
                height={200}
                className="pointer-events-none object-cover aspect-[1/1] rounded-t-xl lg:rounded-t-none lg:rounded-tr-xl lg:rounded-br-xl w-full lg:w-[200px]"
            />
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-center gap-4">
                        <p className="pointer-events-none line-clamp-2 text-md md:text-xl font-semibold text-gray-900">{title}</p>
                    </div>
                    <p className="pointer-events-none text-md line-clamp-1 md:line-clamp-2 font-normal text-black">
                        {description === '' ? 'Ohne Beschreibung' : description}
                    </p>
                </div>

                <div className="flex gap-2">
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

                    {onInfoClick && (
                        <button
                            type="button"
                            onClick={onInfoClick}
                            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ml-auto"
                        >
                            <InfoIcon strokeWidth={1} className="text-xs md:text-sm" />
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
}
