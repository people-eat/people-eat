import {
    PEAutoComplete,
    PEButton,
    PEDatePicker,
    PELabelMultiSelection,
    PELabelSingleSelection,
    PETextArea,
    PETextField,
    PETimePicker,
} from '@people-eat/web-core-components';
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
import { useForm } from 'react-hook-form';
import { PECostBreakdownPanel } from '../cost-breakdown-panel/PECostBreakdownPanel';
import { PEPriceClassSelection } from '../price-class-selection/PEPriceClassSelection';
import { ParticipantsPicker } from '../search-bar/PEParticipantsPicker';

export interface BookFormProps {
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

interface BookFormInputs {
    location: string;
    occasion: string;
    message: string;
    couponCode: string;
}

export function BookForm({
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
}: BookFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<BookFormInputs>();

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);

    return (
        <form onSubmit={handleSubmit(() => searchButton.onClick())}>
            <div className="flex flex-col gap-8">
                <PEAutoComplete
                    title="Adresse"
                    options={locationSearchResults}
                    selectedOption={selectedLocation}
                    onSelectedOptionChange={setSelectedLocation}
                    getOptionIdentifier={(location) => location.id}
                    getLabel={(location) => location.text}
                    errorMessage={(isOutOfTravelRadius && 'Koch ist zu weit entfernt') || errors.location?.message}
                    {...register('location', {
                        required: {
                            value: true,
                            message: 'This field is required',
                        },
                        onChange: (event) => onLocationSearchTextChange(event.target.value),
                    })}
                />

                <ParticipantsPicker adults={adults} setAdults={setAdults} children={kids} setChildren={setKids} />

                <div className="flex gap-4 items-end w-full [&>*:first-child]:flex-1">
                    <PEDatePicker date={date} setDate={setDate} minDate={minDate} />
                    <PETimePicker value={time} onChange={setTime} />
                </div>

                <PETextField
                    id="occasion"
                    labelTitle="Anlass"
                    type="text"
                    placeholder="Zu welchem Anlass ist dein Event?"
                    errorMessage={errors.occasion?.message}
                    {...register('occasion', {
                        required: 'This field is required',
                        onChange: (e) => setOccasion(e.target.value),
                        value: occasion,
                    })}
                />

                <PETextArea
                    id="message"
                    labelTitle="Nachricht"
                    errorMessage={errors.message?.message}
                    rows={4}
                    {...register('message', {
                        required: 'This field is required',
                        onChange: (e) => setMessage(e.target.value),
                        value: message,
                    })}
                />

                {categories && categories.categoryOptions.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <span className="text-base font-medium">Kategorien</span>
                        <PELabelMultiSelection
                            options={categories.categoryOptions}
                            selectedOptions={categories.selectedCategories}
                            selectedOptionsChanged={categories.onChange}
                            optionTitle={({ title }) => title}
                            optionIdentifier={({ categoryId }) => categoryId}
                        />
                    </div>
                )}

                {kitchens && kitchens.kitchenOptions.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <span className="text-base font-medium">Küche</span>
                        <PELabelSingleSelection
                            options={kitchens.kitchenOptions}
                            selectedOption={kitchens.selectedKitchen}
                            selectedOptionChanged={kitchens.onChange}
                            optionTitle={({ title }) => title}
                            optionIdentifier={({ kitchenId }) => kitchenId}
                        />
                    </div>
                )}

                {allergies && allergies.allergyOptions.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <span className="text-base font-medium">Allergien</span>
                        <PELabelMultiSelection
                            options={allergies.allergyOptions}
                            selectedOptions={allergies.selectedAllergies}
                            selectedOptionsChanged={allergies.onChange}
                            optionTitle={({ title }) => title}
                            optionIdentifier={({ allergyId }) => allergyId}
                        />
                    </div>
                )}

                {priceClass && (
                    <div className="flex flex-col gap-4">
                        <span className="text-base font-medium">Budget pro Person</span>
                        <PEPriceClassSelection selectedPriceClass={priceClass.value} onChange={priceClass.onChange} layout="VERTICAL" />
                    </div>
                )}

                {coupon && (
                    <div className="flex flex-col gap-2 items-start">
                        <PETextField
                            id="coupon"
                            labelTitle="Gutschein- oder Promocode einlösen"
                            type="text"
                            placeholder="XXXX-XXXX-XXXX"
                            errorMessage={errors.couponCode?.message}
                            trailingChildren={
                                <div>
                                    {!coupon.state && <PEButton title="Einlösen" type="secondary" onClick={() => coupon.onApply()} />}
                                    {/* {coupon.state && 'balance' in coupon.state && <CheckCircle className="text-green-500" />}
                                    {coupon.state && 'failed' in coupon.state && <XCircle className="text-red-500" />}
                                    {coupon.state && 'expirationDate' in coupon.state && <XCircle className="text-red-500" />} */}
                                </div>
                            }
                            {...register('couponCode', { onChange: () => coupon.onChange(getValues().couponCode) })}
                        />
                        {coupon.state && 'balance' in coupon.state && (
                            <span className="text-green-500 text-sm">Rabattcode erfolgreich angewendet</span>
                        )}
                        {coupon.state && 'failed' in coupon.state && (
                            <span className="text-red-500 text-sm">Angegebener Code ungültig</span>
                        )}
                        {coupon.state && 'expirationDate' in coupon.state && (
                            <span className="text-red-500 text-sm">Angegebener Code ist abgelaufen</span>
                        )}
                    </div>
                )}

                {costBreakdown && <PECostBreakdownPanel costBreakdown={costBreakdown} />}

                <PEButton title={searchButton.title} type="submit" />
            </div>
        </form>
    );
}
