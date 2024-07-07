import { useEffect } from 'react';
import { clarity } from 'react-microsoft-clarity';

export interface AnalyticsClarityProps {
    enabled?: boolean | null;
}

export function AnalyticsClarity({ enabled }: AnalyticsClarityProps) {
    useEffect(() => {
        if (enabled) clarity.init('l6qxwo5j7v');
    });

    return <></>;
}
