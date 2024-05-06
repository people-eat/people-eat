import { CostBreakdown, formatPrice } from '@people-eat/web-domain';

export interface PECostBreakdownPanelProps {
    costBreakdown: CostBreakdown;
}

export function PECostBreakdownPanel({ costBreakdown }: PECostBreakdownPanelProps) {
    const { lineItems, total, totalPerPerson } = costBreakdown;
    return (
        <section className="flex flex-col gap-4">
            {lineItems.map(({ title, price }) => (
                <div className="flex justify-between" key={title}>
                    <span>{title}</span>
                    <span>{formatPrice(price)}</span>
                </div>
            ))}
            <hr />
            {(total || totalPerPerson) && (
                <div className="flex flex-col gap-2">
                    {total && (
                        <div className="flex justify-between">
                            <span className="font-semibold">{total.title}</span>
                            <span className="font-semibold">{formatPrice(total.price)}</span>
                        </div>
                    )}
                    {totalPerPerson && (
                        <div className="flex justify-between">
                            <span className="font-light">Preis pro Person</span>
                            <span className="font-light">{formatPrice(totalPerPerson.price)}</span>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
