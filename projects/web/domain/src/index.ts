import { Circle, CircleDashed, CircleDot, CircleX, LucideIcon } from 'lucide-react';
import { ParsedUrlQueryInput } from 'querystring';
import { Dispatch, SetStateAction } from 'react';
import {
    AllergyOptionFragment,
    BookingRequestStatus,
    CategoryOptionFragment,
    KitchenOptionFragment,
    LanguageOptionFragment,
    MealType,
    SignedInUserFragment,
} from './graphql/_generated/graphql';

export * from './graphql/_generated/gql';
export * from './graphql/_generated/graphql';

export type SignedInUser = SignedInUserFragment;
export type AllergyOption = AllergyOptionFragment;
export type CategoryOption = CategoryOptionFragment;
export type KitchenOption = KitchenOptionFragment;
export type LanguageOption = LanguageOptionFragment;

export * from './cookRanks';
export * from './profileTabs';

export { cityHubs, type CityHub } from './CityHub';

export interface LocationSearchResult {
    id: string;
    text: string;
    latitude: number;
    longitude: number;
}

export type SearchMode = 'MENUS' | 'COOKS';

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export interface Price {
    amount: number;
    currencyCode: string;
}

export interface CostLineItem {
    // type: 'COST';
    title: string;
    price: Price;
}

// export interface DiscountLineItem {
//     type: 'DISCOUNT';
//     title: string;
//     price: Price;
//     priceBeforeDiscount: Price;
//     reason: string;
// }

// export type LineItem = CostLineItem | DiscountLineItem;

export interface CostBreakdown {
    lineItems: CostLineItem[];
    total?: {
        title: string;
        price: Price;
    };
    totalPerPerson?: {
        title: string;
        price: Price;
    };
    totalBeforeDiscount?: {
        title: string;
        price: Price;
    };
}

export function calculateMenuPrice(
    adultParticipants: number,
    underagedParticipants: number,
    basePrice: number,
    basePriceCustomers: number,
    pricePerAdult: number,
    pricePerUnderaged?: number | null,
): number {
    if (adultParticipants + underagedParticipants <= basePriceCustomers) return basePrice;

    if (pricePerUnderaged === undefined || pricePerUnderaged === null)
        return basePrice + (adultParticipants + underagedParticipants - basePriceCustomers) * pricePerAdult;

    if (adultParticipants - basePriceCustomers >= 0)
        return basePrice + (adultParticipants - basePriceCustomers) * pricePerAdult + underagedParticipants * pricePerUnderaged;

    return (underagedParticipants - basePriceCustomers - adultParticipants) * pricePerUnderaged + basePrice;
}

//

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

interface Location {
    latitude: number;
    longitude: number;
}

export interface GeoDistanceProps {
    location1: Location;
    location2: Location;
}

export function geoDistance({ location1, location2 }: GeoDistanceProps): number {
    // Radius of the earth in km
    const R = 6371;

    const dLat = deg2rad(location2.latitude - location1.latitude);
    const dLon = deg2rad(location2.longitude - location1.longitude);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(location1.latitude)) * Math.cos(deg2rad(location2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in km
    const d = R * c;
    return d;
}

//

export const formatPrice = (price: Price, withDecimals?: boolean): string =>
    (price.amount / 100).toFixed(withDecimals ? 2 : 0) + ' ' + price.currencyCode;

//

export type UseState<T> = [T, Dispatch<SetStateAction<T>>];

export type PriceClass = 'SIMPLE' | 'FINE' | 'GOURMET';

export interface Time {
    hours: number;
    minutes: number;
}

// Date formatting

export function toDBDateString(date: Date): string {
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}

export function addDaysToDate(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export function formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Search Params

export interface SearchParams {
    locationLatitude: number | null;
    locationLongitude: number | null;
    locationText: string | null;
    dateString: string;
    adults: number;
    children: number;
}

export const defaultSearchParams: SearchParams = {
    locationLatitude: null,
    locationLongitude: null,
    locationText: null,
    dateString: toDBDateString(addDaysToDate(new Date(), 14)),
    adults: 4,
    children: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toValidatedSearchParams(query: any): SearchParams {
    const searchParams = JSON.parse(JSON.stringify(defaultSearchParams));

    const { locationLatitude, locationLongitude, locationText, dateString, adults, children } = query;

    if (locationLatitude && locationLongitude && locationText) {
        searchParams.locationLatitude = locationLatitude;
        searchParams.locationLongitude = locationLongitude;
        searchParams.locationText = locationText;
    }

    if (dateString) {
        searchParams.dateString = dateString;
    }

    if (adults) {
        searchParams.adults = Number(adults);
    }

    if (children) {
        searchParams.children = Number(children);
    }

    return searchParams;
}

export interface ToQueryParamsInput {
    selectedLocation: undefined | LocationSearchResult;
    date: Date;
    adults: number;
    children: number;
}

export function toQueryParams({ selectedLocation, date, adults, children }: ToQueryParamsInput): ParsedUrlQueryInput {
    return {
        locationLatitude: selectedLocation?.latitude ?? null,
        locationLongitude: selectedLocation?.longitude ?? null,
        locationText: selectedLocation?.text ?? null,
        dateString: toDBDateString(date),
        adults,
        children,
    };
}

export const mealTypes: MealType[] = ['VEGETARIAN', 'VEGAN', 'SOUP', 'MEAT', 'FISH', 'DESSERT', 'SPECIAL'];

export const mealTypeTranslations: Record<MealType, string> = {
    SOUP: 'Suppe',
    MEAT: 'Fleisch',
    FISH: 'Fisch',
    VEGETARIAN: 'Vegetarisch',
    VEGAN: 'Vegan',
    DESSERT: 'Dessert',
    SPECIAL: 'Spezial',
};

export { priceClassRanges, translatedPriceClasses } from './priceClass';

// const weekDays: Record<number, string> = {
//     0: 'Sonntag',
//     1: 'Montag',
//     2: 'Dienstag',
//     3: 'Mittwoch',
//     4: 'Donnerstag',
//     5: 'Freitag',
//     6: 'Samstag',
// };

const monthsWords: Record<number, string> = {
    0: 'Januar',
    1: 'Februar',
    2: 'März',
    3: 'April',
    4: 'Mai',
    5: 'Juni',
    6: 'Juli',
    7: 'August',
    8: 'September',
    9: 'Oktober',
    10: 'November',
    11: 'Dezember',
};

// const monthsNumbers: Record<number, string> = {
//     0: '1.',
//     1: '2.',
//     2: '3.',
//     3: '4.',
//     4: '5.',
//     5: '6.',
//     6: '7.',
//     7: '8.',
//     8: '9.',
//     9: '10.',
//     10: '11.',
//     11: '12.',
// };

export function toTranslatedFormattedDate(date: Date): string {
    date = new Date(date);
    return `${date.getDate()}. ${monthsWords[date.getMonth()]} ${date.getFullYear()}`;
}

export function dateDistanceInDays(date1: Date, date2: Date): number {
    const differenceInTime = date2.getTime() - date1.getTime();
    return Math.round(differenceInTime / (1000 * 3600 * 24));
}

export function dateDistanceToToday(date: Date): number {
    date = new Date(date);
    return dateDistanceInDays(new Date(), date);
}

export function groupDays(days: number): {
    days: number;
    months: number;
} {
    return {
        days: days % 30,
        months: Math.floor(days / 30),
    };
}

// todo, not in use yet
export function translatedFormattedDays(d: number): string {
    const { days, months } = groupDays(d);
    if (months > 1 && days > 1) return ``;
    if (months > 1 && days > 1) return ``;
    if (months > 1 && days > 1) return ``;
    if (months > 1 && days > 1) return ``;
    return '';
}

export function translatedDateDistanceToToday(date: Date): string {
    const numberOfDays = dateDistanceToToday(date);
    if (numberOfDays === 0) return 'Heute';
    else if (numberOfDays === 1) return `Morgen`;
    else if (numberOfDays === -1) return `Gestern`;
    else if (numberOfDays < 0) return `Vor ${-1 * numberOfDays} Tagen`;
    else return `In ${numberOfDays} Tagen`;
}

export const translatedBookingRequestStatus: Record<BookingRequestStatus, string> = {
    OPEN: 'Offen',
    PENDING: 'In Bearbeitung',
    CANCELED: 'Abgesagt',
    COMPLETED: 'Abgeschlossen',
};

export const bookingRequestStatusIcon: Record<BookingRequestStatus, LucideIcon> = {
    OPEN: CircleDashed,
    PENDING: Circle,
    CANCELED: CircleX,
    COMPLETED: CircleDot,
};

export const bookingRequestStatusIconColor: Record<BookingRequestStatus, string> = {
    OPEN: 'text-green-400',
    PENDING: 'text-blue-400',
    COMPLETED: 'text-gray-400',
    CANCELED: 'text-red-400',
};

export const bookingRequestStatusTextColor: Record<BookingRequestStatus, string> = {
    OPEN: 'text-green-600',
    PENDING: 'text-blue-600',
    COMPLETED: 'text-gray-600',
    CANCELED: 'text-red-600',
};

export const bookingRequestStatusDescription: Record<BookingRequestStatus, string> = {
    OPEN: 'Die Buchungsanfrage wurde erstellt, allerdings haben noch nicht beide Parteien dem unterbreiteten Abgebot zugestimmt. Bis eine Einigung erfolgt ist, entstehen keine Kosten.',
    PENDING:
        'Beide Parteien haben dem unterbreiteten Abgebot zugestimmt. Innerhalb des Zeitraums von zwei Wochen vor dem Event wird das angegebene Zahlungsmittel belastet.',
    COMPLETED: 'Das Event hat stattgefunden',
    CANCELED: 'Es konnte keine Einigug zwischen den beiden Parteien erzielt werden.',
};
