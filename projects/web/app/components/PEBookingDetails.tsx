import { BookingStatusInfoPopover } from '@people-eat/web-components';
import {
    BookingRequestStatus,
    CurrencyCode,
    formatPrice,
    formatTime,
    Price,
    PriceClass,
    toTranslatedFormattedDate,
    translatedBookingRequestStatus,
    translatedPriceClasses,
} from '@people-eat/web-domain';

export interface PEBookingDetailsProps {
    status?: BookingRequestStatus;
    occasion: string;
    adultParticipants: number;
    children: number;
    dateTime: Date;
    location: { text: string };
    price?: Price;
    priceClass?: {
        type: PriceClass;
        min: number;
        max: number;
        currencyCode: CurrencyCode;
    };
}

export function PEBookingDetails({
    status,
    occasion,
    adultParticipants,
    children,
    dateTime,
    location,
    price,
    priceClass,
}: PEBookingDetailsProps) {
    return (
        <div className="overflow-y-auto sm:mb-4 pl-4 pr-4">
            <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
                {status && (
                    <div className="pt-6 sm:flex">
                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Status</dt>
                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div className="text-gray-900 flex justify-between w-full pr-4">
                                <span>{translatedBookingRequestStatus[status]}</span>
                                <BookingStatusInfoPopover currentBookingRequestStatus={status} />
                            </div>
                        </dd>
                    </div>
                )}
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Anlass</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{occasion}</div>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Erwachsene</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{adultParticipants}</div>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Kinder</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{children}</div>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Datum</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{toTranslatedFormattedDate(dateTime)}</div>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Uhrzeit</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{formatTime(dateTime)}</div>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Wo</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{location.text}</div>
                    </dd>
                </div>
                {price && (
                    <div className="pt-6 sm:flex">
                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Gesamtpreis</dt>
                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div className="text-gray-900">{formatPrice(price, true)}</div>
                        </dd>
                    </div>
                )}
                {priceClass && (
                    <div className="pt-6 sm:flex">
                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Preisklasse</dt>
                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div className="text-gray-900">{translatedPriceClasses[priceClass.type]}</div>
                        </dd>
                    </div>
                )}
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Allergien</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{'Keine'}</div>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Kategorien</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{'Keine'}</div>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Küche</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">{'Keine'}</div>
                    </dd>
                </div>
            </dl>
        </div>
    );
}
