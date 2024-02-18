import { Dispatch, SetStateAction } from 'react';
import { AllergyOptionFragment, CategoryOptionFragment, KitchenOptionFragment, SignedInUserFragment } from './graphql/_generated/graphql';

export * from './graphql/_generated/gql';
export * from './graphql/_generated/graphql';

export type SignedInUser = SignedInUserFragment;
export type AllergyOption = AllergyOptionFragment;
export type CategoryOption = CategoryOptionFragment;
export type KitchenOption = KitchenOptionFragment;

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

export interface LineItem {
    title: string;
    price: Price;
}

export interface CostBreakdown {
    lineItems: LineItem[];
    total?: {
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

    if (!pricePerUnderaged) return basePrice + (adultParticipants + underagedParticipants - basePriceCustomers) * pricePerAdult;

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

export const formatPrice = (price: Price): string => (price.amount / 100).toFixed(2) + ' ' + price.currencyCode;

//

export type UseState<T> = [T, Dispatch<SetStateAction<T>>];

export type PriceClass = 'SIMPLE' | 'FINE' | 'GOURMET';

export interface Time {
    hours: number;
    minutes: number;
}
