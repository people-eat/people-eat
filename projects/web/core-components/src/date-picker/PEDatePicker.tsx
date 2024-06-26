import { Popover, Transition } from '@headlessui/react';
import { Fragment, PropsWithChildren } from 'react';
import { PECalendar } from '../calendar/PECalendar';
import { toTranslatedFormattedDate } from '@people-eat/web-domain';

export interface PEDatePickerProps {
    labelTitle?: string;
    date?: Date;
    setDate: (changedDate: Date) => void;
    minDate?: Date;
}

export function PEDatePicker({ labelTitle, date, setDate, minDate, children }: PropsWithChildren<PEDatePickerProps>) {
    return (
        <Popover className="relative">
            <Popover.Button className="flex flex-col items-stretch rounded-md w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
                <label htmlFor="name" className="ml-px block text-base font-medium leading-6 text-gray-900 text-left">
                    {labelTitle ?? 'Wann'}
                </label>
                <div className="mt-2">
                    <div className="block w-full text-left rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                        {date ? toTranslatedFormattedDate(date) : 'Datum'}
                    </div>
                </div>
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute z-10 mt-5 w-screen -m-6">
                    {({ close }) => (
                        <div className="w-screen max-w-sm flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                            <div className="p-4">
                                <PECalendar
                                    selectedDate={date}
                                    onSelectDate={(changedDate) => {
                                        setDate(changedDate);
                                        close();
                                    }}
                                    minDate={minDate}
                                />
                            </div>
                        </div>
                    )}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}
