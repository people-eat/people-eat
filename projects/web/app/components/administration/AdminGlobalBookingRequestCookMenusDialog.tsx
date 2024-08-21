import { useQuery } from '@apollo/client';
import { LoadingDialog } from '@people-eat/web-components';
import { PEButton, PEDialog } from '@people-eat/web-components';
import { AdminGetCookMenusDocument } from '@people-eat/web-domain';
import { useState } from 'react';
import { AdminGlobalBookingRequestCookMenuDialog } from './AdminGlobalBookingRequestCookMenuDialog';

export interface AdminGlobalBookingRequestCookMenusDialogProps {
    open: boolean;
    onClose: () => void;
    globalBookingRequestId: string;
    cookId: string;
}

export function AdminGlobalBookingRequestCookMenusDialog({
    open,
    onClose,
    globalBookingRequestId,
    cookId,
}: AdminGlobalBookingRequestCookMenusDialogProps) {
    const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>();

    const { loading: getMenusLoading, data: getMenusData } = useQuery(AdminGetCookMenusDocument, { variables: { cookId } });

    const loading = getMenusLoading;

    return (
        <>
            <LoadingDialog active={loading} />

            <AdminGlobalBookingRequestCookMenuDialog
                open={Boolean(selectedMenuId)}
                onClose={() => setSelectedMenuId(undefined)}
                globalBookingRequestId={globalBookingRequestId}
                cookId={cookId}
                menuId={selectedMenuId!}
            />

            <PEDialog open={open} onClose={onClose} title="Menüs des Kochs">
                <table className="w-full text-left">
                    <thead className="bg-white">
                        <tr>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                Titel
                            </th>
                            <th scope="col" className="px-3 py-3.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {getMenusData?.cooks.menus.findMany?.map((menu) => (
                            <tr key={menu.menuId}>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{menu.title}</td>
                                <td className="px-3 py-4 text-sm">
                                    <PEButton title="konfigurieren" type="secondary" onClick={() => setSelectedMenuId(menu.menuId)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </PEDialog>
        </>
    );
}
