import { useMutation, useQuery } from '@apollo/client';
import { LoadingDialog, MealSelectionCard } from '@people-eat/web-components';
import { PEAlert, PEButton, PEDialog, PELabelSingleSelection, PENumberTextField } from '@people-eat/web-core-components';
import {
    AdminGetCookMenuDocument,
    AdminGetCookMenuQuery,
    CreateBookingRequestByGlobalBookingRequestIdDocument,
    Unpacked,
} from '@people-eat/web-domain';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type PriceMode = 'CUSTOM' | 'AUTOMATED';

const priceModes: PriceMode[] = ['AUTOMATED', 'CUSTOM'];

const priceModeTranslations: Record<PriceMode, string> = {
    CUSTOM: 'Selbst definiert',
    AUTOMATED: 'Automatisch',
};

export interface AdminGlobalBookingRequestCookMenuDialogProps {
    open: boolean;
    onClose: () => void;
    globalBookingRequestId: string;
    cookId: string;
    menuId: string;
}

export function AdminGlobalBookingRequestCookMenuDialog({
    open,
    onClose,
    globalBookingRequestId,
    cookId,
    menuId,
}: AdminGlobalBookingRequestCookMenuDialogProps) {
    const { loading: getMenuLoading, data: getMenuData } = useQuery(AdminGetCookMenuDocument, { variables: { cookId, menuId } });
    const [createBookingRequest, { loading: createBookingRequestLoading, data: createBookingRequestData, reset }] = useMutation(
        CreateBookingRequestByGlobalBookingRequestIdDocument,
    );

    const menu = getMenuData?.cooks.menus.findOne;

    const [courseMealSelections, setCourseMealSelections] = useState<
        Map<string, Unpacked<Unpacked<Unpacked<NonNullable<AdminGetCookMenuQuery['cooks']['menus']['findOne']>>['courses']>['mealOptions']>>
    >(new Map());

    useEffect(() => {
        const map = new Map(courseMealSelections);
        menu?.courses.forEach((course) => map.set(course.courseId, course.mealOptions[0]!));
        setCourseMealSelections(map);
    }, [menu]);

    const loading = getMenuLoading || createBookingRequestLoading;

    const showSuccessAlert = createBookingRequestData?.cooks.bookingRequests.success ?? false;
    const showFailedAlert = createBookingRequestData ? !createBookingRequestData?.cooks.bookingRequests.success : false;

    const {
        register,
        watch,
        formState: { errors },
    } = useForm<{ price: number }>({
        defaultValues: {},
    });

    const { price } = watch();

    function onBook(): void {
        if (!menu) return;

        void createBookingRequest({
            variables: {
                cookId,
                globalBookingRequestId,
                configuredMenu: {
                    menuId: menu.menuId,
                    courses: Array.from(courseMealSelections.entries()).map(([courseId, mealOption]) => ({
                        courseId,
                        mealId: mealOption.meal.mealId,
                    })),
                },
                price: priceMode === 'CUSTOM' ? { amount: price * 100, currencyCode: 'EUR' } : undefined,
            },
        })
            .then(({ data }) => {})
            .catch(() => undefined)
            .finally(() => undefined);
    }

    const [priceMode, setPriceMode] = useState<PriceMode>('AUTOMATED');

    return (
        <>
            <LoadingDialog active={loading} />

            <PEAlert
                open={showSuccessAlert}
                title="Anfrage erfolgreich gematcht"
                subtitle="Die Globale Buchungsanfrage verschwindet nun aus der Liste dieser Seite. Sie taucht in den normalen Buchungsanfragen auf."
                primaryButton={{ title: 'Fertig', onClick: () => Router.reload() }}
            />

            <PEAlert
                type="ERROR"
                open={showFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Bitte versuche es später erneut"
                primaryButton={{ title: 'Erneut versuchen', onClick: () => reset() }}
            />

            <PEDialog open={open} onClose={onClose} title={`Globale Anfrage mit "${menu?.title ?? 'Menü'}" matchen`}>
                {menu && (
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Preis</h2>

                            <PELabelSingleSelection
                                options={priceModes}
                                selectedOption={priceMode}
                                selectedOptionChanged={(o) => o && setPriceMode(o)}
                                optionTitle={(o) => priceModeTranslations[o]}
                                optionIdentifier={(o) => o}
                            />

                            {priceMode === 'CUSTOM' && (
                                <form>
                                    <PENumberTextField
                                        className="w-16"
                                        id="basePriceCustomers"
                                        errorMessage={errors.price?.message}
                                        {...register('price', {
                                            required: 'Ungültig',
                                            min: { value: 1, message: 'Ungültig' },
                                            max: { value: 100, message: 'Ungültig' },
                                            valueAsNumber: true,
                                        })}
                                    />
                                </form>
                            )}
                        </div>

                        {menu.courses.map(({ courseId, title, mealOptions }) => (
                            <div key={courseId} className="flex flex-col gap-10 mb-8">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
                                </div>

                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                                    {mealOptions.map(({ index, meal }) => (
                                        <MealSelectionCard
                                            key={meal.mealId}
                                            title={meal.title}
                                            description={meal.description}
                                            imageUrl={meal.imageUrl}
                                            selected={courseMealSelections.get(courseId)?.index === index}
                                            onSelect={() => {
                                                const map = new Map(courseMealSelections);
                                                map.set(courseId, { index, meal });
                                                setCourseMealSelections(map);
                                            }}
                                            onInfoClick={() => undefined}
                                        />
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <div className="flex justify-end">
                            <PEButton title="Matchen" onClick={onBook} />
                        </div>
                    </div>
                )}
            </PEDialog>
        </>
    );
}
