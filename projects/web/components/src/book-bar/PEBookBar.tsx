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
    PriceClass,
    Time,
} from '@people-eat/web-domain';
import { useForm } from 'react-hook-form';
import { PECostBreakdownPanel } from '../cost-breakdown-panel/PECostBreakdownPanel';
import { PEPriceClassSelection } from '../price-class-selection/PEPriceClassSelection';
import { ParticipantsPicker } from '../search-bar/PEParticipantsPicker';

export interface PEBookBarProps {
    onLocationSearchTextChange: (changedLocationSearchText: string) => void;
    locationSearchResults: LocationSearchResult[];
    selectedLocation?: LocationSearchResult;
    setSelectedLocation: (location: LocationSearchResult) => void;
    adults: number;
    setAdults: (changedAdults: number) => void;
    kids: number;
    setKids: (changedKids: number) => void;
    date: Date;
    setDate: (changedDate: Date) => void;
    time: Time;
    setTime: (changedTime: Time) => void;

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
}

interface PEBookBarFormInputs {
    location: string;
    occasion: string;
    message: string;
}

export function PEBookBar({
    onLocationSearchTextChange,
    locationSearchResults,
    selectedLocation,
    setSelectedLocation,
    adults,
    setAdults,
    kids,
    setKids,
    date,
    setDate,
    time,
    setTime,
    costBreakdown,
    searchButton,
    categories,
    kitchens,
    allergies,
    priceClass,
}: PEBookBarProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PEBookBarFormInputs>();

    return (
        <div>
            <form onSubmit={handleSubmit(searchButton.onClick)}>
                <h1 className="font-bold text-lg">Event Details</h1>

                <div className="flex flex-col gap-8">
                    <PEAutoComplete
                        title="Adresse"
                        options={locationSearchResults}
                        selectedOption={selectedLocation}
                        onSelectedOptionChange={setSelectedLocation}
                        getOptionIdentifier={(location) => location.id}
                        getLabel={(location) => location.text}
                        errorMessage={errors.location && 'This field is required'}
                        {...register('location', {
                            required: true,
                            onChange: (event) => onLocationSearchTextChange(event.target.value),
                        })}
                    />

                    <ParticipantsPicker adults={adults} setAdults={setAdults} children={kids} setChildren={setKids} />

                    <div className="flex gap-4 items-end w-full [&>*:first-child]:flex-1">
                        <PEDatePicker date={date} setDate={setDate} />
                        <PETimePicker value={time} onChange={setTime} />
                    </div>

                    <PETextField
                        id="occasion"
                        labelTitle="Anlass"
                        type="password"
                        placeholder="Zu welchem Anlass ist dein Event?"
                        errorMessage={errors.occasion?.message}
                        {...register('occasion', { required: 'This field is required' })}
                    />

                    <PETextArea
                        id="message"
                        labelTitle="Nachricht"
                        errorMessage={errors.message?.message}
                        rows={4}
                        {...register('message', { required: 'This field is required' })}
                    />

                    {categories && (
                        <div className="flex flex-col gap-4">
                            <span className="text-lg font-semibold">Kategorien</span>
                            <PELabelMultiSelection
                                options={categories.categoryOptions}
                                selectedOptions={categories.selectedCategories}
                                selectedOptionsChanged={categories.onChange}
                                optionTitle={({ title }) => title}
                                optionIdentifier={({ categoryId }) => categoryId}
                            />
                        </div>
                    )}

                    {kitchens && (
                        <div className="flex flex-col gap-4">
                            <span className="text-lg font-semibold">Küche</span>
                            <PELabelSingleSelection
                                options={kitchens.kitchenOptions}
                                selectedOption={kitchens.selectedKitchen}
                                selectedOptionChanged={kitchens.onChange}
                                optionTitle={({ title }) => title}
                                optionIdentifier={({ kitchenId }) => kitchenId}
                            />
                        </div>
                    )}

                    {allergies && (
                        <div className="flex flex-col gap-4">
                            <span className="text-lg font-semibold">Allergien</span>
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
                            <span className="text-lg font-semibold">Budget pro Person</span>
                            <PEPriceClassSelection selectedPriceClass={priceClass.value} onChange={priceClass.onChange} layout="VERTICAL" />
                        </div>
                    )}

                    {costBreakdown && <PECostBreakdownPanel costBreakdown={costBreakdown} />}

                    <PEButton title={searchButton.title} type="submit" />
                </div>
            </form>
        </div>
    );
}
