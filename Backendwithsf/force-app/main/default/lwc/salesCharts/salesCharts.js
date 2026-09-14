import { LightningElement, api } from 'lwc';

export default class SalesCharts extends LightningElement {
    @api orderStatusCounts = [];
    @api categoryCounts = [];

    get hasStatusData() {
        return this.orderStatusCounts && this.orderStatusCounts.length > 0;
    }

    get hasCategoryData() {
        return this.categoryCounts && this.categoryCounts.length > 0;
    }

    get processedStatusData() {
        if (!this.orderStatusCounts) return [];
        const total = this.orderStatusCounts.reduce((sum, item) => sum + (item.count || 0), 0);
        return this.orderStatusCounts.map(item => {
            const count = item.count || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return {
                status: item.status,
                count: count,
                percentage: pct,
                barStyle: `width: ${pct}%`
            };
        });
    }

    get processedCategoryData() {
        if (!this.categoryCounts) return [];
        const total = this.categoryCounts.reduce((sum, item) => sum + (item.count || 0), 0);
        return this.categoryCounts.map(item => {
            const count = item.count || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return {
                category: item.category,
                count: count,
                percentage: pct,
                barStyle: `width: ${pct}%`
            };
        });
    }
}
