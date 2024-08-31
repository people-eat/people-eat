import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react';
import classNames from 'classnames';
import { CheckIcon } from 'lucide-react';
import { ForwardedRef, forwardRef } from 'react';

export interface PEAutoCompleteProps<T> {
    title: string;
    options: T[];
    selectedOption?: T;
    onSelectedOptionChange: (changedSelectedOption: T) => void;

    getOptionIdentifier: (option: T) => string;
    getLabel: (option: T) => string;

    errorMessage?: string;
}

function PEAutoComplete<T>(
    {
        title,
        options,
        selectedOption,
        onSelectedOptionChange,
        getOptionIdentifier,
        getLabel,
        errorMessage,
        ...rest
    }: PEAutoCompleteProps<T>,
    ref: ForwardedRef<HTMLInputElement>,
) {
    return (
        <Combobox as="div" value={selectedOption} onChange={onSelectedOptionChange} className="flex flex-col gap-2">
            <Label className="ml-px block text-md font-medium leading-6 text-gray-900">{title}</Label>
            <div className="relative">
                <ComboboxInput
                    defaultValue={selectedOption ? getLabel(selectedOption) : ('' as T)}
                    className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                    displayValue={(selection: T) => (selection ? getLabel(selection) : '')}
                    placeholder="Wo?"
                    ref={ref}
                    {...rest}
                />

                {errorMessage && <span className="ml-4 mt-1 text-sm text-red-600">{errorMessage}</span>}

                {options.length > 0 && (
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((option: T) => (
                            <ComboboxOption
                                key={getOptionIdentifier(option)}
                                value={option}
                                className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-orange-400 text-white' : 'text-gray-900',
                                    )
                                }
                            >
                                <div className="flex">
                                    <span className={classNames('truncate', option === selectedOption && 'font-semibold')}>
                                        {getLabel(option)}
                                    </span>
                                </div>

                                {option === selectedOption && (
                                    <span
                                        className={classNames(
                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                            'text-white',
                                            'data-[focus]:text-orange-500',
                                        )}
                                    >
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                )}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}
            </div>
        </Combobox>
    );
}

// @todo the first as any was newly added after migrating to node 22
function fixedForwardRef<T, P>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode,
): (props: P & React.RefAttributes<T>) => React.ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return forwardRef(render as any) as any;
}

export default fixedForwardRef(PEAutoComplete);
