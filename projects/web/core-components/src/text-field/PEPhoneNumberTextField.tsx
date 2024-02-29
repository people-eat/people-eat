import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { ChevronDownIcon } from 'lucide-react';
import { ForwardedRef, Fragment, forwardRef } from 'react';

// Note: not in use yet!

const prefixes = ['+49'];

export interface PEPhoneNumberTextFieldProps {
    id: string;
    labelTitle?: string;
    placeholder?: string;
    errorMessage?: string;
}

export const PEPhoneNumberTextField = forwardRef(function (
    { id, labelTitle = 'Telefonnummer', placeholder = '123456789', errorMessage, ...rest }: PEPhoneNumberTextFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    return (
        <div>
            {labelTitle && (
                <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {labelTitle}
                </label>
            )}

            <div className="flex gap-2">
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        +49
                        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-16 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-44 overflow-auto">
                            <div className="py-1">
                                {prefixes.map((prefix) => (
                                    <Menu.Item key={prefix}>
                                        {({ active }) => (
                                            <span
                                                onClick={() => undefined}
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm',
                                                )}
                                            >
                                                {prefix}
                                            </span>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
                <input
                    id={id}
                    type="tel"
                    autoComplete="tel"
                    placeholder={placeholder}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-orange-600"
                    ref={ref}
                    {...rest}
                />
            </div>

            {errorMessage && <span className="ml-2 mt-1 text-sm font-semibold text-red-500">{errorMessage}</span>}
        </div>
    );
});
