import { CostBreakdown, formatPrice } from '@people-eat/web-domain';

export interface PECostBreakdownPanelProps {
    costBreakdown: CostBreakdown;
}

export function PECostBreakdownPanel({ costBreakdown }: PECostBreakdownPanelProps) {
    const { lineItems, total } = costBreakdown;
    return (
        <section className="flex flex-col gap-4">
            {lineItems.map(({ title, price }) => (
                <div className="flex justify-between" key={title}>
                    <span>{title}</span>
                    <span>{formatPrice(price)}</span>
                </div>
            ))}
            <hr />
            {total && (
                <div className="flex justify-between">
                    <span className="font-semibold">{total.title}</span>
                    <span className="font-semibold">{formatPrice(total.price)}</span>
                </div>
            )}
        </section>
    );
}
