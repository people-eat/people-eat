import { Listbox, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Fragment } from 'react';

export interface PESingleSelectionProps<T> {
    labelTitle?: string;
    noSelectionText?: string;

    options: T[];
    selectedOption?: T;
    selectedOptionChanged: (changedSelectedOption?: T) => void;

    optionTitle: (option: T) => string;
    optionIdentifier: (option: T) => string;

    className?: string;
}

export function PESingleSelection<T>({
    labelTitle,
    noSelectionText,
    options,
    selectedOption,
    selectedOptionChanged,
    optionTitle,
    optionIdentifier,
    className,
}: PESingleSelectionProps<T>) {
    return (
        <Listbox value={selectedOption} onChange={selectedOptionChanged}>
            {({ open }) => (
                <div>
                    {labelTitle && (
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">{labelTitle}</Listbox.Label>
                    )}
                    <div className={classNames('relative mt-2', className)}>
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600 sm:text-sm sm:leading-6">
                            <span className="block truncate">
                                {selectedOption ? optionTitle(selectedOption) : noSelectionText ?? 'Keine Auswahl'}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronsUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {options.map((option) => (
                                    <Listbox.Option
                                        key={optionIdentifier(option)}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-orange-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9',
                                            )
                                        }
                                        value={option}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                    {optionTitle(option)}
                                                </span>

                                                {selected && (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-orange-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                                        )}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </div>
            )}
        </Listbox>
    );
}
