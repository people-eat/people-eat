import type { Meta, StoryObj } from '@storybook/react';
import { PECostBreakdownPanel } from './PECostBreakdownPanel';

/**
 * Custom component.
 */
const meta: Meta<typeof PECostBreakdownPanel> = {
    component: PECostBreakdownPanel,
    title: 'Cost Breakdown Panel',
    tags: ['autodocs'],
};

export default meta;

export const Primary: StoryObj<typeof PECostBreakdownPanel> = {
    args: {
        costBreakdown: {
            lineItems: [
                {
                    title: 'Line Item 1',
                    price: { amount: 1234, currencyCode: '€' },
                },
                {
                    title: 'Line Item 2',
                    price: { amount: 1234, currencyCode: '€' },
                },
                {
                    title: 'Line Item 3',
                    price: { amount: 1234, currencyCode: '€' },
                },
                {
                    title: 'Line Item 4',
                    price: { amount: 1234, currencyCode: '€' },
                },
            ],
            total: {
                title: 'Summe',
                price: { amount: 1234, currencyCode: '€' },
            },
        },
    },
};
