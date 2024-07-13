import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon, Circle, X } from 'lucide-react';
import Image from 'next/image';
import { Fragment } from 'react';

export interface MealDetailsDialogProps {
    onClose: () => void;
    selectionContext?: {
        isSelected: boolean;
        onSelect: () => void;
    };
    meal?: {
        title: string;
        description: string;
        imageUrl?: string | null;
    };
}

export function MealDetailsDialog({ onClose, selectionContext, meal }: MealDetailsDialogProps) {
    if (!meal) return null;

    return (
        <Transition.Root show as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                            <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-2xl">
                                    <button
                                        type="button"
                                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <X className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                                        <div className="sm:col-span-4 lg:col-span-5">
                                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                                                <Image
                                                    src={meal.imageUrl ?? '/placeholders/meal.png'}
                                                    alt=""
                                                    className="object-cover object-center"
                                                    width={600}
                                                    height={600}
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-8 lg:col-span-7">
                                            <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{meal.title}</h2>

                                            <section aria-labelledby="information-heading" className="mt-3">
                                                <h3 id="information-heading" className="sr-only">
                                                    Product information
                                                </h3>

                                                <div className="mt-6">
                                                    <h4 className="sr-only">Description</h4>
                                                    <p className="pointer-events-none text-md font-normal text-black">
                                                        {meal.description === '' ? 'Ohne Beschreibung' : meal.description}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-center gap-4"></div>
                                            </section>

                                            {selectionContext && (
                                                <section aria-labelledby="options-heading" className="mt-6">
                                                    {selectionContext.isSelected && (
                                                        <div className="inline-flex items-center gap-x-2 rounded-full bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm">
                                                            <span>Ausgewählt</span>
                                                            <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                                                        </div>
                                                    )}
                                                    {!selectionContext.isSelected && (
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-x-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                            onClick={selectionContext.onSelect}
                                                        >
                                                            <span>Auswählen</span>
                                                            <Circle className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                                                        </button>
                                                    )}
                                                </section>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
