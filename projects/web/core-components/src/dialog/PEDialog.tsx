import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { X } from 'lucide-react';
import { Fragment, PropsWithChildren } from 'react';

export interface PEDialogProps {
    open: boolean;
    onClose?: () => void;
    title?: string;
    className?: string;
    closeOnClickAround?: boolean;
}

export function PEDialog({ open, onClose, title, closeOnClickAround, children, className }: PropsWithChildren<PEDialogProps>) {
    return (
        <Transition.Root show={open} as={Fragment}>
            {/* static disables the close on click around behavior */}
            <Dialog as="div" className="relative z-10" static onClose={onClose && Boolean(closeOnClickAround) ? onClose : () => undefined}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            enterTo="opacity-100 translate-y-0 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 md:scale-100"
                            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        >
                            <Dialog.Panel
                                className={classNames(
                                    'flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl',
                                    'bg-white p-8 rounded-2xl w-full flex flex-col gap-8',
                                    className,
                                )}
                            >
                                {(title || onClose) && (
                                    <header className="flex gap-4">
                                        {title && <h2 className="font-semibold text-xl">{title}</h2>}
                                        <span className="flex-1" />
                                        {onClose && (
                                            <button type="button" onClick={onClose}>
                                                <X />
                                            </button>
                                        )}
                                    </header>
                                )}
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
