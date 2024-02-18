import { Dialog } from '@headlessui/react';
import { XIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';

export interface PEFullPageSheetProps {
    title: string;
    open: boolean;
    onClose: () => void;
}

export function PEFullPageSheet({ children, title, open, onClose }: PropsWithChildren<PEFullPageSheetProps>) {
    return (
        <Dialog as="div" open={open} onClose={onClose}>
            <div className="fixed inset-0 z-10" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white p-6 flex flex-col gap-4">
                <div className="flex justify-between">
                    <h1 className="font-bold text-lg">{title}</h1>
                    <button className="rounded-full" onClick={onClose}>
                        <XIcon />
                    </button>
                </div>
                {children}
            </Dialog.Panel>
        </Dialog>
    );
}
