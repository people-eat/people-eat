import { useMutation } from '@apollo/client';
import { PEButton, PEDatePicker, PEDialog, PENumberTextField, PETextField } from '@people-eat/web-components';
import { CreateOneGIftCardPromoCodeDocument } from '@people-eat/web-domain';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export interface CreateGiftCardPromoCodeFormInputs {
    redeemCode: string;
    balanceAmount: number;
}

export interface AdminCreateGiftCardPromoCodeDialogProps {
    open: boolean;
}

export function AdminCreateGiftCardPromoCodeDialog({ open }: AdminCreateGiftCardPromoCodeDialogProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateGiftCardPromoCodeFormInputs>();

    const { redeemCode, balanceAmount } = watch();

    const [expiresAt, setExpiresAt] = useState(new Date());

    const [create] = useMutation(CreateOneGIftCardPromoCodeDocument, {
        variables: { giftCardPromoCode: { balance: { amount: balanceAmount * 100, currencyCode: 'EUR' }, expiresAt, redeemCode } },
    });

    return (
        <PEDialog title="Neuen Promo Code erstellen" open={open}>
            <form onSubmit={handleSubmit((data) => create())} className="flex flex-col gap-4">
                <PETextField
                    id="dsadasdsadasd"
                    labelTitle="Code"
                    type="text"
                    errorMessage={errors.redeemCode?.message}
                    {...register('redeemCode', {
                        required: 'Dein Gericht braucht noch einen Namen.',
                        minLength: { value: 3, message: 'Der Name des Gerichts muss mindestens 5 Zeichen lang sein' },
                    })}
                />
                <PENumberTextField
                    id="maximumTravelDistance"
                    labelTitle="Guthaben"
                    {...register('balanceAmount', { min: 1, max: 200, valueAsNumber: true })}
                />
                <PEDatePicker labelTitle="Ablaufdatum" date={expiresAt} setDate={setExpiresAt} />
                <PEButton title="Erstellen" type="submit" />
            </form>
        </PEDialog>
    );
}
