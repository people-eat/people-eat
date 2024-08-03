import { PriceClass, toTranslatedFormattedDate, translatedDateDistanceToToday, translatedPriceClasses } from '@people-eat/web-domain';
import classNames from 'classnames';
import { ChevronRightIcon } from 'lucide-react';
import { BookingRequestStatusPill } from '../../booking-status-pill/BookingStatusPill';

export interface GlobalBookingRequestRowProps {
    occasion: string;
    priceClass: PriceClass;
    dateTime: Date;

    selected: boolean;
    onSelect: () => void;
}

export function GlobalBookingRequestRow({ occasion, priceClass, dateTime, selected, onSelect }: GlobalBookingRequestRowProps) {
    return (
        <li className={classNames('relative py-5 hover:bg-gray-100', { 'bg-gray-200': selected })} role="button" onClick={onSelect}>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-4xl justify-between gap-x-6">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="flex flex-col gap-2 items-start">
                            <BookingRequestStatusPill status="OPEN" />
                            <p className="text-sm font-semibold leading-6 text-gray-900">{occasion}</p>
                            <p className="flex text-xs leading-5 text-gray-500">{toTranslatedFormattedDate(dateTime)}</p>
                            <p className="flex text-xs leading-5 text-gray-500">Globale Anfrage</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-4">
                        <div className="flex flex-col items-end">
                            <p className="text-sm leading-6 text-green-500">{translatedPriceClasses[priceClass]}</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500">{translatedDateDistanceToToday(dateTime)}</p>
                            <span className="mt-1 text-md leading-5 text-gray-500">gesendet</span>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </li>
    );
}
