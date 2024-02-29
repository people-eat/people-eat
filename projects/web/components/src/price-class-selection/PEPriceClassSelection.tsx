import { PriceClass } from '@people-eat/web-domain';
import { PEPriceClassCard } from './PEPriceClassCard';

export interface PEPriceClassSelectionProps {
    selectedPriceClass: PriceClass;
    onChange: (changedSelectedPriceClass: PriceClass) => void;
    layout?: 'VERTICAL' | 'HORIZONTAL';
}

const priceClasses: PriceClass[] = ['SIMPLE', 'FINE', 'GOURMET'];

export function PEPriceClassSelection({ selectedPriceClass, onChange, layout = 'HORIZONTAL' }: PEPriceClassSelectionProps) {
    if (layout === 'HORIZONTAL') {
        return (
            <div className="flex gap-4">
                {priceClasses.map((priceClass) => (
                    <PEPriceClassCard
                        key={priceClass}
                        priceClass={priceClass}
                        selected={selectedPriceClass === priceClass}
                        onSelect={() => onChange(priceClass)}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {priceClasses.map((priceClass) => (
                <PEPriceClassCard
                    key={priceClass}
                    priceClass={priceClass}
                    selected={selectedPriceClass === priceClass}
                    onSelect={() => onChange(priceClass)}
                />
            ))}
        </div>
    );
}
