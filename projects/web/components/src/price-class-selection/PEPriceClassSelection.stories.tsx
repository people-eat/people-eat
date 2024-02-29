import type { Meta, StoryObj } from '@storybook/react';
import { PEPriceClassSelection } from './PEPriceClassSelection';
import { useState } from 'react';
import { PriceClass } from '@people-eat/web-domain';

const meta: Meta<typeof PEPriceClassSelection> = {
    component: PEPriceClassSelection,
    title: 'Price Class Selection',
};

export default meta;

export const Demo: StoryObj<typeof PEPriceClassSelection> = {
    render: () => {
        const [selectedPriceClass, setSelectedPriceClass] = useState<PriceClass>('FINE');

        return (
            <div className="flex flex-col gap-10">
                <PEPriceClassSelection selectedPriceClass={selectedPriceClass} onChange={setSelectedPriceClass} layout="HORIZONTAL" />
                <PEPriceClassSelection selectedPriceClass={selectedPriceClass} onChange={setSelectedPriceClass} layout="VERTICAL" />
            </div>
        );
    },
};
