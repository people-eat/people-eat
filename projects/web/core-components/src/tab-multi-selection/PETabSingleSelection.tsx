import classNames from 'classnames';
import { LucideIcon } from 'lucide-react';
import { PESingleSelection } from '../single-selection/PESingleSelection';

export interface PETabSingleSelectionOption {
    title: string;
    icon?: LucideIcon;
    notificationCount?: number;
}

export interface PETabSingleSelectionProps<T> {
    options: T[];
    selectedOption?: T;
    selectedOptionChanged: (changedSelectedOption?: T) => void;

    optionTitle: (option: T) => string;
    optionIdentifier: (option: T) => string;
    optionIcon?: (option: T) => LucideIcon | undefined;
    optionNotificationCount?: (option: T) => number | undefined;
}

export function PETabSingleSelection<T>({
    options,
    selectedOption,
    selectedOptionChanged,
    optionTitle,
    optionIdentifier,
    optionIcon,
    optionNotificationCount,
}: PETabSingleSelectionProps<T>) {
    return (
        <div>
            <PESingleSelection
                className="sm:hidden"
                options={options}
                selectedOption={selectedOption}
                selectedOptionChanged={selectedOptionChanged}
                optionTitle={optionTitle}
                optionIdentifier={optionIdentifier}
            />

            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {options.map((option) => {
                            const selected = selectedOption ? optionIdentifier(option) === optionIdentifier(selectedOption) : false;
                            const Icon = optionIcon && optionIcon(option);

                            return (
                                <button
                                    type="button"
                                    key={optionIdentifier(option)}
                                    onClick={() => selectedOptionChanged(option)}
                                    className={classNames(
                                        selected
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                                        'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                                    )}
                                    aria-current={selected ? 'page' : undefined}
                                >
                                    {Icon && (
                                        <Icon
                                            className={classNames(
                                                selected ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500',
                                                '-ml-0.5 mr-2 h-5 w-5',
                                            )}
                                            aria-hidden="true"
                                        />
                                    )}
                                    {optionTitle(option)}
                                    {optionNotificationCount && optionNotificationCount(option) && (
                                        <span
                                            className={classNames(
                                                selected ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-900',
                                                'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block',
                                            )}
                                        >
                                            {optionNotificationCount(option)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
