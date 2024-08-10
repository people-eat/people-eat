import {
    AllergyOption,
    CategoryOption,
    CostBreakdown,
    KitchenOption,
    LocationSearchResult,
    Price,
    PriceClass,
    Time,
} from '@people-eat/web-domain';
import { BookForm } from '../_forms/BookForm';

export interface BookBarProps {
    title: string;
    subtitle?: string;
    onLocationSearchTextChange: (changedLocationSearchText: string) => void;
    locationSearchResults: LocationSearchResult[];
    selectedLocation?: LocationSearchResult;
    setSelectedLocation: (location: LocationSearchResult) => void;
    isOutOfTravelRadius: boolean;
    adults: number;
    setAdults: (changedAdults: number) => void;
    kids: number;
    setKids: (changedKids: number) => void;
    date: Date;
    setDate: (changedDate: Date) => void;
    time: Time;
    setTime: (changedTime: Time) => void;
    message: string;
    setMessage: (changedMessage: string) => void;
    occasion: string;
    setOccasion: (changedOccasion: string) => void;

    costBreakdown?: CostBreakdown;

    searchButton: {
        title: string;
        onClick: () => void;
    };

    categories?: {
        categoryOptions: CategoryOption[];
        selectedCategories: CategoryOption[];
        onChange: (changedSelectedCategories: CategoryOption[]) => void;
    };

    kitchens?: {
        kitchenOptions: KitchenOption[];
        selectedKitchen?: KitchenOption;
        onChange: (changedSelectedKitchen?: KitchenOption) => void;
    };

    allergies?: {
        allergyOptions: AllergyOption[];
        selectedAllergies: AllergyOption[];
        onChange: (changedSelectedAllergies: AllergyOption[]) => void;
    };

    priceClass?: {
        value: PriceClass;
        onChange: (changedPriceClass: PriceClass) => void;
    };

    coupon?: {
        onApply: () => void;
        onChange: (giftCardPromoCodeId: string) => void;
        state?: { balance: Price } | { expirationDate: Date } | { failed: boolean };
    };
}

export function BookBar({
    title,
    subtitle,
    onLocationSearchTextChange,
    locationSearchResults,
    selectedLocation,
    setSelectedLocation,
    isOutOfTravelRadius,
    adults,
    setAdults,
    kids,
    setKids,
    date,
    setDate,
    time,
    setTime,
    message,
    setMessage,
    occasion,
    setOccasion,
    costBreakdown,
    searchButton,
    categories,
    kitchens,
    allergies,
    priceClass,
    coupon,
}: BookBarProps) {
    return (
        <div className="sticky top-4 float-none h-full hidden lg:flex flex-col gap-4 shadow-lg shadow-orange-500/20 rounded-2xl p-6 w-96 bg-white">
            <div>
                <h1 className="font-bold text-xl">{title}</h1>
                {subtitle && <h2 className="text-lg font-light">{subtitle}</h2>}
            </div>
            <BookForm
                onLocationSearchTextChange={onLocationSearchTextChange}
                locationSearchResults={locationSearchResults}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                isOutOfTravelRadius={isOutOfTravelRadius}
                adults={adults}
                setAdults={setAdults}
                kids={kids}
                setKids={setKids}
                date={date}
                setDate={setDate}
                time={time}
                setTime={setTime}
                message={message}
                setMessage={setMessage}
                occasion={occasion}
                setOccasion={setOccasion}
                costBreakdown={costBreakdown}
                searchButton={searchButton}
                categories={categories}
                kitchens={kitchens}
                allergies={allergies}
                priceClass={priceClass}
                coupon={coupon}
            />
        </div>
    );
}
