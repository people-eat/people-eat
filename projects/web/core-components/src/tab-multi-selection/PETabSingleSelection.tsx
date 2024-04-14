import classNames from 'classnames';
import { LucideIcon } from 'lucide-react';
import { PESingleSelection } from '../single-selection/PESingleSelection';

export interface PETabSingleSelectionOption {
    title: string;
    icon?: LucideIcon;
    notificationCount?: number;
}

export interface PETabSingleSelectionProps {
    options: PETabSingleSelectionOption[];
    selectedOptionIndex?: number;
    onSelect: (index: number, option: PETabSingleSelectionOption) => void;
}

export function PETabSingleSelection({ options, selectedOptionIndex, onSelect }: PETabSingleSelectionProps) {
    return (
        <div>
            <PESingleSelection
                className="sm:hidden"
                options={options}
                selectedOption={selectedOptionIndex !== undefined ? options[selectedOptionIndex] : undefined}
                selectedOptionChanged={(s) => {
                    const selectedIndex = options.findIndex((o) => o.title === s?.title);
                    if (selectedIndex !== -1) {
                        onSelect(selectedIndex, options[selectedIndex]);
                    }
                }}
                optionTitle={({ title }) => title}
                optionIdentifier={({ title }) => title}
            />

            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {options.map((option, index) => (
                            <button
                                key={option.title}
                                onClick={() => onSelect(index, option)}
                                className={classNames(
                                    index === selectedOptionIndex
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                                    'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                                )}
                                aria-current={index === selectedOptionIndex ? 'page' : undefined}
                            >
                                {option.icon && (
                                    <option.icon
                                        className={classNames(
                                            index === selectedOptionIndex ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500',
                                            '-ml-0.5 mr-2 h-5 w-5',
                                        )}
                                        aria-hidden="true"
                                    />
                                )}
                                {option.title}
                                {option.notificationCount && (
                                    <span
                                        className={classNames(
                                            index === selectedOptionIndex ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-900',
                                            'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block',
                                        )}
                                    >
                                        {option.notificationCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
