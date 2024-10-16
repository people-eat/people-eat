import { useMutation } from '@apollo/client';
import { LoadingDialog, PEAlert, PEButton, PEDatePicker, PEDialog, PENumberTextField, PETextField } from '@people-eat/web-components';
import { CreateOneGiftCardPromoCodeDocument } from '@people-eat/web-domain';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export interface CreateGiftCardPromoCodeFormInputs {
    redeemCode: string;
    balanceAmount: number;
}

export interface AdminCreateGiftCardPromoCodeDialogProps {
    open: boolean;
    onCancel: () => void;
    onCreated: () => void;
}

export function AdminCreateGiftCardPromoCodeDialog({ open, onCancel, onCreated }: AdminCreateGiftCardPromoCodeDialogProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateGiftCardPromoCodeFormInputs>();

    const { redeemCode, balanceAmount } = watch();

    const [expiresAt, setExpiresAt] = useState(new Date());

    const [create, { data, loading, reset }] = useMutation(CreateOneGiftCardPromoCodeDocument, {
        variables: { giftCardPromoCode: { balance: { amount: balanceAmount * 100, currencyCode: 'EUR' }, expiresAt, redeemCode } },
    });

    const showSuccessAlert = data?.admins.giftCardPromoCodes.success ?? false;
    const showFailedAlert = data ? !data.admins.giftCardPromoCodes.success : false;

    return (
        <PEDialog title="Neuen Promo Code erstellen" open={open} onClose={onCancel}>
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
                <PEButton title="Erstellen" type="submit" disabled={loading} />
            </form>
            <LoadingDialog active={loading} />
            <PEAlert
                open={showSuccessAlert}
                type="SUCCESS"
                title="Promo Code wurde erfolgreich erstellt"
                primaryButton={{
                    title: 'Okay',
                    onClick: () => {
                        reset();
                        onCreated();
                    },
                }}
            />
            <PEAlert
                open={showFailedAlert}
                type="ERROR"
                title="Promo Code Erstellung fehlgeschlagen"
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
