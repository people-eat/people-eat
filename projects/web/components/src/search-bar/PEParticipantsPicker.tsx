import { MinusIcon, PlusIcon, Users } from 'lucide-react';

export interface ParticipantsPickerProps {
    adults: number;
    setAdults: (changedAdults: number) => void;
    children: number;
    setChildren: (changedChildren: number) => void;
}

export function ParticipantsPicker({ adults, setAdults, children, setChildren }: ParticipantsPickerProps) {
    return (
        <div className="flex flex-col gap-4">
            <span className="text-lg font-semibold">Wer soll Teilnehmen?</span>
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <Users strokeWidth={1.5} />
                    Erwachsene
                </div>
                <div className="flex gap-2 items-center">
                    {adults >= 2 && (
                        <button
                            type="button"
                            className="rounded-full text-gray-500 ring-gray-500 hover:ring-orange-500 focus:ring-orange-500 ring-1 ring-inset p-1 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 focus-visible:text-white focus-visible:bg-orange-500"
                            onClick={() => setAdults(adults - 1)}
                            disabled={adults < 2}
                        >
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    )}

                    <span className="w-4 text-center">{adults}</span>
                    <button
                        type="button"
                        className="rounded-full  text-gray-500 ring-gray-500 hover:ring-orange-500 focus:ring-orange-500 ring-1 ring-inset p-1 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 focus-visible:text-white focus-visible:bg-orange-500"
                        onClick={() => setAdults(adults + 1)}
                    >
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <Users strokeWidth={1.5} />
                    Kinder (6-12)
                </div>
                <div className="flex gap-2 items-center">
                    {children >= 1 && (
                        <button
                            type="button"
                            className="rounded-full  text-gray-500 ring-gray-500 hover:ring-orange-500 focus:ring-orange-500 ring-1 ring-inset p-1 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 focus-visible:text-white focus-visible:bg-orange-500"
                            onClick={() => setChildren(children - 1)}
                            disabled={children < 1}
                        >
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    )}
                    <span className="w-4 text-center">{children}</span>
                    <button
                        type="button"
                        className="rounded-full  text-gray-500 ring-gray-500 hover:ring-orange-500 focus:ring-orange-500 ring-1 ring-inset p-1 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 focus-visible:text-white focus-visible:bg-orange-500"
                        onClick={() => setChildren(children + 1)}
                    >
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
}
