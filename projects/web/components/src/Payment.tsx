import { useMutation } from '@apollo/client';
import { PEAlert, PEButton } from '@people-eat/web-core-components';
import { UserBookingRequestConfirmPaymentSetupDocument } from '@people-eat/web-domain';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import { useState, type PropsWithChildren, type ReactElement } from 'react';
import { LoadingDialog } from './loading-dialog/LoadingDialog';

export function Payment({
    children,
    bookingRequestId,
    userId,
}: PropsWithChildren<{ bookingRequestId: string; userId: string }>): ReactElement {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const [resultMessage, setResultMessage] = useState<string | undefined>();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const [payLoading, setPayLoading] = useState(false);

    const [confirmPaymentSetup, { loading }] = useMutation(UserBookingRequestConfirmPaymentSetupDocument, {
        variables: { userId, bookingRequestId },
    });

    async function pay(): Promise<void> {
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setPayLoading(true);

        // Make sure to change this to your payment completion page ${window.location.origin}
        // const { error } = await stripe.confirmPayment({
        //     elements,
        //     confirmParams: { return_url: `${window.location.origin}/profile?tab=4` },
        // });
        const { error } = await stripe.confirmSetup({
            elements,
            confirmParams: { return_url: `${window.location.origin}/profile/bookings/s/${bookingRequestId}` },
            redirect: 'if_required',
        });

        setPayLoading(false);

        if (error) {
            if (error.type === 'card_error' || error.type === 'validation_error') setResultMessage(error.message);
            else setResultMessage('An unexpected error occurred.');

            return;
        }

        confirmPaymentSetup()
            .then(({ data }) => data?.users.bookingRequests.success && setShowSuccessAlert(true))
            .catch(() => undefined);
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex gap-8 w-full flex-col md:flex-row">
                    <div className="flex-1">{children}</div>
                    <PaymentElement id="payment-element" className="flex-1" options={{ layout: 'tabs' }} />
                </div>

                <PEButton title="Buchungsanfrage senden" onClick={(): void => void pay()} />

                {resultMessage && <span>{resultMessage}</span>}
            </div>

            <LoadingDialog title="Zahlungsdaten werden verarbeitet." active={loading || payLoading} />

            <PEAlert
                open={showSuccessAlert}
                type="SUCCESS"
                title="Buchung erfolgreich"
                subtitle="Vielen Dank für deine Buchung. Wir werden uns in Kürze mit dir in Verbindung setzen."
                primaryButton={{
                    title: 'Zur Buchungsübersicht',
                    onClick: () => router.push(`/profile/bookings/s/${bookingRequestId}`),
                }}
            />
        </>
    );
}
