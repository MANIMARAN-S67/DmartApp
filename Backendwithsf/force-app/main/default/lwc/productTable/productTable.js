import { LightningElement, api } from 'lwc';

const LOW_STOCK_THRESHOLD = 15;

export default class ProductTable extends LightningElement {
    @api products = [];
    @api lowStockProducts = [];

    get processedProducts() {
        return (this.products || []).map(p => {
            const stock = p.Stock_Quantity__c || 0;
            const isLow = stock < LOW_STOCK_THRESHOLD;
            return {
                ...p,
                stockStatus: isLow ? 'Low Stock' : 'In Stock',
                badgeClass: isLow ? 'stock-badge badge-red' : 'stock-badge badge-green',
                rowClass: isLow ? 'low-stock-row' : ''
            };
        });
    }

    get hasProducts() {
        return this.products && this.products.length > 0;
    }

    get hasLowStock() {
        return this.lowStockProducts && this.lowStockProducts.length > 0;
    }

    get lowStockCount() {
        return this.lowStockProducts ? this.lowStockProducts.length : 0;
    }
}
