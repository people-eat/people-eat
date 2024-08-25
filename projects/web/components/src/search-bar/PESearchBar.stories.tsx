import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PESearchBar } from './PESearchBar';
import { SearchMode } from '@people-eat/web-domain';

/**
 * Depends on Combobox, Popover, Transition from @headlessui/react for mobile dialog.
 */
const meta: Meta<typeof PESearchBar> = {
    component: PESearchBar,
    title: 'Search Bar',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PESearchBar> = {
    render: () => {
        const [adults, setAdults] = useState(2);
        const [kids, setKids] = useState(0);
        const [date, setDate] = useState(new Date());

        return (
            <PESearchBar
                onLocationSearchTextChange={() => undefined}
                locationSearchResults={[]}
                setSelectedLocation={() => undefined}
                adults={adults}
                setAdults={setAdults}
                kids={kids}
                setKids={setKids}
                date={date}
                setDate={setDate}
                onSearchMenus={() => undefined}
                onSearchCooks={() => undefined}
                searchMode="MENUS"
                setSearchMode={function (changedSearchMode: SearchMode): void {
                    throw new Error('Function not implemented.');
                }}
            />
        );
    },
};
