import { useEffect } from 'react';

export function useNotLeave() {
    useEffect(() => {
        function beforeUnload(e: BeforeUnloadEvent) {
            // if (!pending) return;
            e.preventDefault();
        }

        window.addEventListener('beforeunload', beforeUnload);

        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        };
    }, []);
}
