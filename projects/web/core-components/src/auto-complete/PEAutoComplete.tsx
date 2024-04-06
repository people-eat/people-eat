import { Combobox } from '@headlessui/react';
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
        <Combobox as="div" value={selectedOption} onChange={onSelectedOptionChange} className="flex flex-col gap-4">
            <Combobox.Label className="ml-px block text-lg font-semibold leading-6 text-gray-900">{title}</Combobox.Label>
            <div className="relative">
                <Combobox.Input
                    value={selectedOption ? getLabel(selectedOption) : undefined}
                    className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                    displayValue={(selection: T) => getLabel(selection)}
                    placeholder="Wo?"
                    ref={ref}
                    {...rest}
                />

                {errorMessage && <span className="ml-4 mt-1 text-sm text-red-600">{errorMessage}</span>}

                {options.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((option: T) => (
                            <Combobox.Option
                                key={getOptionIdentifier(option)}
                                value={option}
                                className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-orange-400 text-white' : 'text-gray-900',
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <div className="flex">
                                            <span className={classNames('truncate', selected && 'font-semibold')}>{getLabel(option)}</span>
                                        </div>

                                        {selected && (
                                            <span
                                                className={classNames(
                                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                                    active ? 'text-white' : 'text-orange-500',
                                                )}
                                            >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    );
}

function fixedForwardRef<T, P>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode,
): (props: P & React.RefAttributes<T>) => React.ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return forwardRef(render) as any;
}

export default fixedForwardRef(PEAutoComplete);
