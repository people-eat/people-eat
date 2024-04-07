import { Dialog, Transition } from '@headlessui/react';
import { LoadingSpinner } from '@people-eat/web-core-components';
import { Fragment } from 'react';

export interface LoadingDialogProps {
    active: boolean;
    title?: string;
    subtitle?: string;
}

export function LoadingDialog({ active, title, subtitle }: LoadingDialogProps) {
    return (
        <Transition.Root show={active} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => undefined}>
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div className="bg-white rounded-xl flex flex-col items-center justify-center gap-4 w-44 m-auto">
                                    <LoadingSpinner size="L" />
                                    {title && <div>{title}</div>}
                                    {subtitle && <div>{subtitle}</div>}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
