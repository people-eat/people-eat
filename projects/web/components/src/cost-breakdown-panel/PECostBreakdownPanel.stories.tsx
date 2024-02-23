import type { Meta, StoryObj } from '@storybook/react';
import { PECostBreakdownPanel } from './PECostBreakdownPanel';

const meta: Meta<typeof PECostBreakdownPanel> = {
    component: PECostBreakdownPanel,
    title: 'Cost Breakdown Panel',
};

export default meta;

export const Primary: StoryObj<typeof PECostBreakdownPanel> = {
    args: {
        costBreakdown: {
            lineItems: [
                {
                    title: 'Line Item 1',
                    price: { amount: '12.34', currencyCode: 'EUR' },
                },
                {
                    title: 'Line Item 2',
                    price: { amount: '12.34', currencyCode: 'EUR' },
                },
                {
                    title: 'Line Item 3',
                    price: { amount: '12.34', currencyCode: 'EUR' },
                },
                {
                    title: 'Line Item 4',
                    price: { amount: '12.34', currencyCode: 'EUR' },
                },
            ],
            total: {
                title: 'Summe',
                price: { amount: '12.34', currencyCode: 'EUR' },
            },
        },
    },
};
