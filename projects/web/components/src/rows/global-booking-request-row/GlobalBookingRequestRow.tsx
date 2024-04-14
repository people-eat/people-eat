import { ChevronRightIcon } from 'lucide-react';
import { BookingRequestStatusPill } from '../../booking-status-pill/BookingStatusPill';
import { PriceClass } from '@people-eat/web-domain';

export interface GlobalBookingRequestRowProps {
    occasion: string;
    priceClass: PriceClass;
}

export function GlobalBookingRequestRow({ occasion, priceClass }: GlobalBookingRequestRowProps) {
    return (
        <div className="relative py-5 hover:bg-gray-50" role="button" onClick={() => undefined}>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-4xl justify-between gap-x-6">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="flex flex-col gap-2">
                            <BookingRequestStatusPill status="OPEN" />
                            <p className="text-sm font-semibold leading-6 text-gray-900">{occasion}</p>
                            <p className="flex text-xs leading-5 text-gray-500">Datum Uhrzeit</p>
                            <p className="flex text-xs leading-5 text-gray-500">Globale Anfrage</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-4">
                        <div className="flex flex-col items-end">
                            <p className="text-sm leading-6 text-green-500">{priceClass}</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500">in X days</p>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </div>
    );
}
