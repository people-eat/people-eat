import { useMutation } from '@apollo/client';
import { LoadingDialog, PEAlert, PEButton, PEDatePicker, PEDialog, PENumberTextField, PETextField } from '@people-eat/web-components';
import { AdminGetGiftCardPromoCodesPageDataQuery, Unpacked, UpdateOneGiftCardPromoCodeDocument } from '@people-eat/web-domain';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type GiftCardPromoCode = Unpacked<AdminGetGiftCardPromoCodesPageDataQuery['admins']['giftCardPromoCodes']['findMany']>;

export interface CreateGiftCardPromoCodeFormInputs {
    redeemCode: string;
    balanceAmount: number;
}

export interface AdminUpdateGiftCardPromoCodeDialogProps {
    open: boolean;
    giftCardPromoCode: GiftCardPromoCode | undefined;
    onCancel: () => void;
    onUpdated: () => void;
}

export function AdminUpdateGiftCardPromoCodeDialog({
    open,
    onCancel,
    onUpdated,
    giftCardPromoCode,
}: AdminUpdateGiftCardPromoCodeDialogProps) {
    const defaultRedeemCode = giftCardPromoCode?.redeemCode ?? '';
    const defaultBalanceAmount = (giftCardPromoCode?.balance.amount ?? 0) / 100;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm<CreateGiftCardPromoCodeFormInputs>({
        defaultValues: {
            redeemCode: defaultRedeemCode,
            balanceAmount: defaultBalanceAmount,
        },
    });

    useEffect(() => {
        setValue('redeemCode', defaultRedeemCode);
        setValue('balanceAmount', defaultBalanceAmount);
    }, [setValue, defaultRedeemCode, defaultBalanceAmount]);

    const { redeemCode, balanceAmount } = watch();

    const [expiresAt, setExpiresAt] = useState(new Date());

    const [create, { data, loading, reset }] = useMutation(UpdateOneGiftCardPromoCodeDocument, {
        variables: {
            giftCardPromoCodeId: giftCardPromoCode?.giftCardPromoCodeId ?? '',
            giftCardPromoCode: { balance: { amount: balanceAmount * 100, currencyCode: 'EUR' }, expiresAt, redeemCode },
        },
    });

    const showSuccessAlert = data?.admins.giftCardPromoCodes.success ?? false;
    const showFailedAlert = data ? !data.admins.giftCardPromoCodes.success : false;

    return (
        <PEDialog title="Promo Code bearbeiten" open={open} onClose={onCancel}>
            <form onSubmit={handleSubmit((_) => create())} className="flex flex-col gap-4">
                <PETextField
                    id="redeem-code"
                    labelTitle="Code"
                    type="text"
                    errorMessage={errors.redeemCode?.message}
                    {...register('redeemCode', {
                        required: 'Ein Code ist notwendig.',
                        minLength: { value: 3, message: 'Code muss mindestens 3 Zeichen lang sein.' },
                    })}
                />
                <PENumberTextField
                    id="balance"
                    labelTitle="Guthaben"
                    errorMessage={errors.balanceAmount?.message}
                    {...register('balanceAmount', {
                        min: { value: 1, message: 'Mindestens 1€' },
                        max: { value: 200, message: 'Höchstens 200€' },
                        valueAsNumber: true,
                    })}
                />
                <PEDatePicker labelTitle="Ablaufdatum" date={expiresAt} setDate={setExpiresAt} />
                <PEButton title="Änderungen speichern" type="submit" disabled={loading} />
            </form>
            <LoadingDialog active={loading} />
            <PEAlert
                open={showSuccessAlert}
                type="SUCCESS"
                title="Änderungen wurden gespeichert"
                primaryButton={{
                    title: 'Okay',
                    onClick: () => {
                        reset();
                        onUpdated();
                    },
                }}
            />
            <PEAlert
                open={showFailedAlert}
                type="ERROR"
                title="Speichern von Änderungen fehlgeschlagen"
                primaryButton={{
                    title: 'Okay',
                    onClick: () => reset(),
                }}
                secondaryButton={{
                    title: 'Erneut versuchen',
                    onClick: () => {
                        reset();
                        create();
                    },
                }}
            />
        </PEDialog>
    );
}
