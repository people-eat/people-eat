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
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
    PEAutoComplete,
    PEButton,
    PECheckbox,
    PEDatePicker,
    PELabelMultiSelection,
    PELabelSingleSelection,
    PETextArea,
    PETextField,
    PETimePicker,
} from '../_core';
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

    userData?: {
        setFirstName: (changedFirstName: string) => void;
        setLastName: (changedLastName: string) => void;
        setEmailAddress: (changedEmailAddress: string) => void;
        setPhoneNumber: (changedPhoneNumber: string) => void;
    };

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

    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    acceptedTermsAndConditions: boolean;
    acceptedPrivacyPolicy: boolean;
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
    userData,
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
                    labelTitle="Nachricht (optional)"
                    errorMessage={errors.message?.message}
                    rows={4}
                    {...register('message', {
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
                        <PEPriceClassSelection selectedPriceClass={priceClass.value} onChange={priceClass.onChange} layout="HORIZONTAL" />
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
                            <span className="text-green-500 text-sm">Code erfolgreich angewendet</span>
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

                {userData && (
                    <>
                        <div className="flex gap-4">
                            <PETextField
                                id="first-name"
                                labelTitle="Vorname"
                                type="text"
                                autoComplete="given-name"
                                errorMessage={errors.firstName?.message}
                                {...register('firstName', {
                                    required: 'This field is required',
                                    onChange: (e) => userData.setFirstName(e.target.value),
                                })}
                            />

                            <PETextField
                                id="last-name"
                                labelTitle="Nachname"
                                type="text"
                                autoComplete="family-name"
                                errorMessage={errors.lastName?.message}
                                {...register('lastName', {
                                    required: 'This field is required',
                                    onChange: (e) => userData.setLastName(e.target.value),
                                })}
                            />
                        </div>

                        <PETextField
                            id="email-address"
                            labelTitle="E-Mail Adresse"
                            type="email"
                            autoComplete="email"
                            errorMessage={errors.emailAddress?.message}
                            {...register('emailAddress', {
                                required: 'This field is required',
                                onChange: (e) => userData.setEmailAddress(e.target.value),
                            })}
                        />

                        <PETextField
                            id="phone-number"
                            labelTitle="Telefonnummer"
                            type="tel"
                            autoComplete="tel"
                            placeholder="+49"
                            errorMessage={errors.phoneNumber?.message}
                            {...register('phoneNumber', {
                                required: 'This field is required',
                                pattern: {
                                    value: /\+49\d+/,
                                    message: 'Keine gültige Ländervorwahl (z.B +49).',
                                },
                                onChange: (event) => {
                                    const overriddenValue = event.target.value.replaceAll(' ', '');
                                    event.target.value = overriddenValue;
                                    userData.setPhoneNumber(overriddenValue);
                                },
                            })}
                        />

                        <fieldset className="space-y-5">
                            <PECheckbox
                                id="accepted-terms-and-conditions"
                                label={{
                                    title: 'Allgemeine Geschäftsbedingungen',
                                    description: (
                                        <>
                                            Ich habe die{' '}
                                            <Link href="/terms-and-conditions" className="text-orange-500">
                                                allgemeinen Geschäftsbedingungen
                                            </Link>{' '}
                                            gelesen und akzeptiere sie
                                        </>
                                    ),
                                }}
                                errorMessage={errors.acceptedTermsAndConditions?.message}
                                {...register('acceptedTermsAndConditions', {
                                    required: 'Die allgemeinen Geschäftsbedingungen müssen akzeptiert werden um fortzufahren',
                                })}
                            />
                            <PECheckbox
                                id="accepted-privacy-policy"
                                label={{
                                    title: 'Datenschutzerklärung',
                                    description: (
                                        <>
                                            Ich habe die{' '}
                                            <Link href="/privacy-policy" className="text-orange-500">
                                                Datenschutzerklärung
                                            </Link>{' '}
                                            gelesen und akzeptiere sie
                                        </>
                                    ),
                                }}
                                errorMessage={errors.acceptedPrivacyPolicy?.message}
                                {...register('acceptedPrivacyPolicy', {
                                    required: 'Die Datenschutzerklärung muss akzeptiert werden um fortzufahren',
                                })}
                            />
                        </fieldset>
                    </>
                )}

                <PEButton title={searchButton.title} type="submit" />
            </div>
        </form>
    );
}
