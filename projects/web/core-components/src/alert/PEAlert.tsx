import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, Trash, X } from 'lucide-react';
import { Fragment } from 'react';
import { PEButton } from '../button/PEButton';

export interface PEAlertProps {
    open: boolean;
    type?: 'SUCCESS' | 'ERROR' | 'DELETION';
    title: string;
    subtitle?: string;
    primaryButton: {
        title: string;
        onClick: () => void;
    };
    secondaryButton?: {
        title: string;
        onClick: () => void;
    };
}

export function PEAlert({ open, type = 'SUCCESS', title, subtitle, primaryButton, secondaryButton }: PEAlertProps) {
    return (
        <Transition.Root show={open} as={Fragment}>
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
                                <div>
                                    {type === 'SUCCESS' && (
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                        </div>
                                    )}
                                    {type === 'ERROR' && (
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                            <X className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                    )}
                                    {type === 'DELETION' && (
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                            <Trash className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                    )}

                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            {title}
                                        </Dialog.Title>
                                        {subtitle && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">{subtitle}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 flex flex-col gap-2">
                                    <PEButton title={primaryButton.title} onClick={primaryButton.onClick} className="w-full" />
                                    {secondaryButton && (
                                        <PEButton
                                            title={secondaryButton.title}
                                            onClick={secondaryButton.onClick}
                                            className="w-full"
                                            type="secondary"
                                        />
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
