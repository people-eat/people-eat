import { BookingRequestStatus, translatedBookingRequestStatus } from '@people-eat/web-domain';

export interface BookingRequestStatusPillProps {
    status: BookingRequestStatus;
}

export function BookingRequestStatusPill({ status }: BookingRequestStatusPillProps) {
    if (status === 'OPEN') {
        return (
            <span className="text-green-500 bg-gray-100 text-center" style={{ padding: '4px 16px', borderRadius: 16 }}>
                {translatedBookingRequestStatus[status]}
            </span>
        );
    }

    if (status === 'PENDING') {
        return (
            <span className="text-blue-400 text-center" style={{ padding: '4px 16px', backgroundColor: 'lightgray', borderRadius: 16 }}>
                {translatedBookingRequestStatus[status]}
            </span>
        );
    }

    if (status === 'CANCELED') {
        return (
            <span className="text-red-400 text-center" style={{ padding: '4px 16px', backgroundColor: 'lightgray', borderRadius: 16 }}>
                {translatedBookingRequestStatus[status]}
            </span>
        );
    }

    if (status === 'COMPLETED')
        return (
            <span className="text-center" style={{ padding: '4px 16px', backgroundColor: 'lightgray', borderRadius: 16 }}>
                {translatedBookingRequestStatus[status]}
            </span>
        );
}
