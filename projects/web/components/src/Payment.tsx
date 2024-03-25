import { useMutation } from '@apollo/client';
import { PEButton } from '@people-eat/web-core-components';
import { UserBookingRequestConfirmPaymentSetupDocument } from '@people-eat/web-domain';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import { useState, type PropsWithChildren, type ReactElement } from 'react';

export function Payment({
    children,
    bookingRequestId,
    userId,
}: PropsWithChildren<{ bookingRequestId: string; userId: string }>): ReactElement {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const [resultMessage, setResultMessage] = useState<string | undefined>();

    const [confirmPaymentSetup, { loading }] = useMutation(UserBookingRequestConfirmPaymentSetupDocument, {
        variables: { userId, bookingRequestId },
    });

    async function pay(): Promise<void> {
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        // Make sure to change this to your payment completion page ${window.location.origin}
        // const { error } = await stripe.confirmPayment({
        //     elements,
        //     confirmParams: { return_url: `${window.location.origin}/profile?tab=4` },
        // });
        const { error } = await stripe.confirmSetup({
            elements,
            confirmParams: { return_url: `${window.location.origin}/profile/bookings/${bookingRequestId}` },
            redirect: 'if_required',
        });

        if (error) {
            if (error.type === 'card_error' || error.type === 'validation_error') setResultMessage(error.message);
            else setResultMessage('An unexpected error occurred.');

            return;
        }

        confirmPaymentSetup()
            .then(({ data }) => data?.users.bookingRequests.success && router.push(`/profile/bookings/${bookingRequestId}`))
            .catch(() => undefined);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-8 w-full">
                <div className="flex-1">{children}</div>
                <div className="flex flex-1 items-stretch">
                    <PaymentElement id="payment-element" />
                </div>
            </div>

            <PEButton title="Fertig" onClick={(): void => void pay()} />

            {resultMessage && <span>{resultMessage}</span>}

            {loading && 'Loading'}
        </div>
    );
}