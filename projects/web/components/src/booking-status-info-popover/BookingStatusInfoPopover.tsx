import { Dialog, Transition } from '@headlessui/react';
import {
    BookingRequestStatus,
    bookingRequestStatusDescription,
    bookingRequestStatusIcon,
    bookingRequestStatusIconColor,
    bookingRequestStatusTextColor,
    translatedBookingRequestStatus,
} from '@people-eat/web-domain';
import classNames from 'classnames';
import { Info } from 'lucide-react';
import { Fragment, useState } from 'react';

export interface BookingStatusInfoPopoverProps {
    currentBookingRequestStatus: BookingRequestStatus;
}

const bookingStatuses: BookingRequestStatus[] = ['OPEN', 'PENDING', 'COMPLETED'];

export function BookingStatusInfoPopover({ currentBookingRequestStatus }: BookingStatusInfoPopoverProps) {
    const [open, setOpen] = useState(false);
    const [selectedBookingStatus, setSelectedBookingStatus] = useState<BookingRequestStatus>(currentBookingRequestStatus);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                <Info />
            </button>

            <Transition.Root show={open} as={Fragment}>
                <Dialog className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 flex flex-col gap-8">
                                    <div className="flex flex-col gap-8">
                                        <div className="flex gap-4 items-center flex-col sm:flex-row">
                                            {bookingStatuses
                                                .map((status) => ({
                                                    id: status,
                                                    icon: bookingRequestStatusIcon[status],
                                                    displayName: translatedBookingRequestStatus[status],
                                                    iconColor: bookingRequestStatusIconColor[status],
                                                    textColor: bookingRequestStatusTextColor[status],
                                                }))
                                                .map((status) => (
                                                    <button
                                                        type="button"
                                                        key={status.displayName}
                                                        className={classNames('flex flex-col gap-2 items-center flex-1 w-full', {
                                                            'ring-2 rounded-xl ring-inset ring-gray-300 p-4':
                                                                currentBookingRequestStatus === status.id,
                                                        })}
                                                        onClick={() => setSelectedBookingStatus(status.id)}
                                                    >
                                                        <status.icon className={classNames(status.iconColor)} />
                                                        <span className={classNames(status.textColor)}>{status.displayName}</span>
                                                    </button>
                                                ))}
                                        </div>
                                        <span>{bookingRequestStatusDescription[selectedBookingStatus]}</span>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
