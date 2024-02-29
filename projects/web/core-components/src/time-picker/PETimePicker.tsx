import { Menu, Transition } from '@headlessui/react';
import { Time } from '@people-eat/web-domain';
import classNames from 'classnames';
import { ChevronDownIcon } from 'lucide-react';
import { Fragment } from 'react';

export interface PETimePickerProps {
    value: Time;
    onChange: (changedValue: Time) => void;
}

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const minutes = [0, 15, 30, 45];

export function PETimePicker({ value, onChange }: PETimePickerProps) {
    return (
        <div>
            <label htmlFor="name" className="ml-px block text-sm font-medium leading-6 text-gray-900 text-left">
                Uhrzeit?
            </label>
            <div className="flex gap-1 mt-2">
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {value.hours}
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
                                {hours.map((hour) => (
                                    <Menu.Item key={hour}>
                                        {({ active }) => (
                                            <span
                                                onClick={() => onChange({ hours: hour, minutes: value.minutes })}
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm',
                                                )}
                                            >
                                                {hour}
                                            </span>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>

                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {value.minutes === 0 ? '00' : value.minutes}
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
                                {minutes.map((minute) => (
                                    <Menu.Item key={minute}>
                                        {({ active }) => (
                                            <span
                                                onClick={() => onChange({ hours: value.hours, minutes: minute })}
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm',
                                                )}
                                            >
                                                {minute === 0 ? '00' : minute}
                                            </span>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
}
