export interface BookingRequestStatusPillProps {
    status: 'OPEN' | 'PENDING' | 'CANCELED' | 'COMPLETED';
}

export function BookingRequestStatusPill({ status }: BookingRequestStatusPillProps) {
    if (status === 'OPEN') {
        return (
            <span className="text-green-500 text-center" style={{ padding: '4px 16px', backgroundColor: 'lightgray', borderRadius: 16 }}>
                Offen
            </span>
        );
    }

    if (status === 'PENDING') {
        return (
            <span className="text-blue-400 text-center" style={{ padding: '4px 16px', backgroundColor: 'lightgray', borderRadius: 16 }}>
                In Bearbeitung
            </span>
        );
    }

    if (status === 'CANCELED') {
        return (
            <span className="text-red-400 text-center" style={{ padding: '4px 16px', backgroundColor: 'lightgray', borderRadius: 16 }}>
                Abgesagt
            </span>
        );
    }

    if (status === 'COMPLETED')
        return (
            <span className="text-center" style={{ padding: '4px 16px', backgroundColor: 'lightgray', borderRadius: 16 }}>
                Abgeschlossen
            </span>
        );
}
