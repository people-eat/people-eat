import { PEButton, PENumberTextField, PESingleSelection } from '@people-eat/web-core-components';
import { GetCookProfileMenuPageDataQuery, calculateMenuPrice, formatPrice } from '@people-eat/web-domain';
import classNames from 'classnames';
import { ArrowDown, ArrowUp, Car, HandCoins } from 'lucide-react';
import { ParticipantsPicker } from 'projects/web/components/src/search-bar/PEParticipantsPicker';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const childrenDiscountOptions = [
    { value: undefined, title: 'Kein Kinderrabatt' },
    { value: 25, title: '25%' },
    { value: 50, title: '50%' },
    { value: 75, title: ' 75%' },
    { value: 100, title: 'Kostenlos' },
];

export interface EditMenuPriceFormInputs {
    basePrice: number;
    basePriceCustomers: number;
    pricePerAdult: number;
    pricePerChild?: number;
}

export interface PEEditMenuPriceFormProps {
    menu: NonNullable<NonNullable<GetCookProfileMenuPageDataQuery['cooks']['menus']>['findOne']>;
    onChange: (data: EditMenuPriceFormInputs) => void;
}

export function PEEditMenuPriceForm({ menu, onChange }: PEEditMenuPriceFormProps) {
    const [editModeOn, setEditModeOn] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EditMenuPriceFormInputs>({
        defaultValues: {
            basePrice: menu.basePrice / 100,
            basePriceCustomers: menu.basePriceCustomers,
            pricePerAdult: menu.pricePerAdult / 100,
            pricePerChild: menu.pricePerChild ? menu.pricePerChild / 100 : undefined,
        },
    });

    const { basePrice, basePriceCustomers, pricePerAdult, pricePerChild } = watch();

    const [childrenDiscount, setChildrenDiscount] = useState(childrenDiscountOptions[0]);
    useEffect(() => {
        if (childrenDiscount.value === undefined) {
            setValue('pricePerChild', undefined);
        } else {
            setValue('pricePerChild', (pricePerAdult * (100 - childrenDiscount.value)) / 100);
        }
    }, [pricePerAdult, childrenDiscount, setValue]);

    const [adults, setAdults] = useState(4);
    const [children, setChildren] = useState(0);
    const [costDetailsShown, setCostDetailsShown] = useState(false);

    const price = calculateMenuPrice(
        Number(adults),
        Number(children),
        Number(basePrice) * 100,
        Number(basePriceCustomers),
        Number(pricePerAdult) * 100,
        pricePerChild === undefined ? undefined : Number(pricePerChild) * 100,
    );

    const cookPrice = price * 0.82;
    const formattedFee = formatPrice({ amount: price * 0.18, currencyCode: 'EUR' });
    const formattedPrice = formatPrice({ amount: price, currencyCode: 'EUR' });
    const formattedCookPrice = formatPrice({ amount: cookPrice, currencyCode: 'EUR' });

    function onAbort() {
        setEditModeOn(false);
        setValue('basePrice', menu.basePrice / 100);
        setValue('basePriceCustomers', menu.basePriceCustomers);
        setValue('pricePerAdult', menu.pricePerAdult / 100);
        setValue('pricePerChild', menu.pricePerChild ? menu.pricePerChild / 100 : undefined);
    }

    const changesToSave =
        basePrice !== menu.basePrice / 100 ||
        basePriceCustomers !== menu.basePriceCustomers ||
        pricePerAdult !== menu.pricePerAdult / 100 ||
        pricePerChild !== (menu.pricePerChild ? menu.pricePerChild / 100 : undefined);

    return (
        <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit((data) => {
                onChange(data);
                setEditModeOn(false);
            })}
        >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-0">
                <span>Der Menüpreis beträgt</span>

                <div className="flex gap-2">
                    {editModeOn && (
                        <PENumberTextField
                            id="basePrice"
                            className="w-16"
                            errorMessage={errors.basePrice?.message}
                            {...register('basePrice', {
                                required: 'Ungültig',
                                min: { value: 25, message: 'Ungültig' },
                                max: { value: 10000, message: 'Ungültig' },
                                valueAsNumber: true,
                            })}
                        />
                    )}

                    {!editModeOn && <b>{basePrice}</b>}

                    <span>€</span>
                </div>

                <span>für</span>

                <div className="flex gap-2">
                    {editModeOn && (
                        <PENumberTextField
                            className="w-16"
                            id="basePriceCustomers"
                            errorMessage={errors.basePriceCustomers?.message}
                            {...register('basePriceCustomers', {
                                required: 'Ungültig',
                                min: { value: 1, message: 'Ungültig' },
                                max: { value: 100, message: 'Ungültig' },
                                valueAsNumber: true,
                            })}
                        />
                    )}

                    {!editModeOn && <b>{basePriceCustomers}</b>}

                    <span>Personen.</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-0">
                <span>Für jede weitere Person wird ein Preis in Höhe von </span>

                <div className="flex gap-2">
                    {editModeOn && (
                        <PENumberTextField
                            id="pricePerAdult"
                            className="w-16"
                            errorMessage={errors.pricePerAdult?.message}
                            {...register('pricePerAdult', {
                                required: 'Ungültig',
                                min: { value: 1, message: 'Ungültig' },
                                max: { value: 1000, message: 'Ungültig' },
                                valueAsNumber: true,
                            })}
                        />
                    )}

                    {!editModeOn && <b>{pricePerAdult}</b>}
                    <span> €</span>
                </div>

                <span> angesetzt.</span>
            </div>

            <div className="flex flex-col items-start">
                <h3 className="font-semibold text-xl mb-2 md:text-text-m-bold">Möchtest du einen Kinderrabatt anbieten?</h3>
                <p>Der Rabatt gilt für Kinder im Alter von 6-12 Jahren.</p>
                <div className="flex gap-8 items-center">
                    <PESingleSelection
                        options={childrenDiscountOptions}
                        selectedOption={childrenDiscount}
                        selectedOptionChanged={(o) => o && setChildrenDiscount(o)}
                        optionTitle={({ title }) => title}
                        optionIdentifier={({ value }) => `${value}`}
                        className="w-full lg:w-[400px]"
                    />
                </div>
            </div>

            {pricePerChild !== undefined && (
                <div className="flex flex-col items-start">
                    <div className="flex flex-col items-start text-sm leading-6 text-gray-600">
                        <span>Beispiel:</span>
                        <span>
                            Der Kinderrabatt (z.B. 50%) berechnet sich auf Grundlage des angesetzten Betrags den du für jede weitere Person
                            (z.B. 50 EUR) angegeben hast.
                        </span>
                        <span>Mit dem gegebenen Beispielrabatt würde der Preis pro Kind beträgt 25 EUR betragen.</span>
                    </div>
                </div>
            )}

            <p className="text-xl font-semibold">Preissimulation - Dein erwarteter Umsatz</p>
            <div className="flex gap-16 w-full items-start flex-wrap">
                <ParticipantsPicker hideLabel adults={adults} setAdults={setAdults} children={children} setChildren={setChildren} />
                <span className="flex-1" />

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8 bg-white items-start p-16 shadow-xl rounded-2xl">
                        {costDetailsShown && (
                            <>
                                <div className="flex justify-between w-full text-gray-400">
                                    <span>Menüpreis</span>
                                    <span>{formattedPrice}</span>
                                </div>

                                <div className="flex justify-between w-full text-gray-400">
                                    <span>Servicegebühr</span>
                                    <span>{formattedFee}</span>
                                </div>

                                <div className="relative self-stretch">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className={classNames('flex justify-between w-full lg:w-[600px]', 'text-2xl font-semibold')}>
                            <span>Du erhältst</span>
                            <span>{formattedCookPrice}</span>
                        </div>
                        <span className="text-text-m-bold">Hinzu kommen</span>

                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col justify-center bg-orange w-6 h-6 rounded-6">
                                <HandCoins strokeWidth={1} />
                            </div>

                            <p className="my-0 text-text-sm">Trinkgeld</p>

                            <div className="flex flex-col justify-center bg-orange w-6 h-6 rounded-6">
                                <Car strokeWidth={1} />
                            </div>

                            <p className="my-0 text-text-sm">Fahrtkosten</p>
                        </div>
                        <span className="text-text-sm" style={{ color: 'gray' }}>
                            Für Fahrtkosten und Trinkgeld fallen keine Servicegebühren an.
                        </span>
                    </div>
                    <button className="text-gray-500" onClick={(): void => setCostDetailsShown(!costDetailsShown)}>
                        {!costDetailsShown && (
                            <div className="flex flex-col items-center">
                                <span>Mehr anzeigen</span>
                                <ArrowDown />
                            </div>
                        )}
                        {costDetailsShown && (
                            <div className="flex flex-col items-center">
                                <span>Weniger anzeigen</span>
                                <ArrowUp />
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                {!editModeOn && <PEButton title="Bearbeiten" onClick={() => setEditModeOn(true)} type="secondary" />}
                {editModeOn && (
                    <>
                        <PEButton title="Abbrechen" type="secondary" onClick={onAbort} />
                        {changesToSave && <PEButton title="Speichern" type="submit" />}
                    </>
                )}
            </div>
        </form>
    );
}
