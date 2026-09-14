// dmartProductRecordDashboard.js
import { LightningElement, api, wire } from 'lwc';
import getProductData from '@salesforce/apex/DmartRecordDashboardsController.getProductData';

const COLUMNS = [
    { label: 'Order Name', fieldName: 'OrderName', type: 'text' },
    { label: 'Quantity', fieldName: 'Quantity__c', type: 'number', cellAttributes: { alignment: 'left' } },
    { label: 'Price Sold', fieldName: 'Price__c', type: 'currency', typeAttributes: { currencyCode: 'INR' } },
    { label: 'Order Status', fieldName: 'OrderStatus', type: 'text' },
    { label: 'Date', fieldName: 'formattedDate', type: 'text' }
];

export default class DmartProductRecordDashboard extends LightningElement {
    @api recordId;
    
    isLoading = true;
    productInfo;
    recentPurchases = [];
    purchaseColumns = COLUMNS;

    @wire(getProductData, { recordId: '$recordId' })
    wiredData({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.productInfo = data.productInfo;
            if (data.recentPurchases) {
                this.recentPurchases = data.recentPurchases.map(item => {
                    return {
                        ...item,
                        OrderName: item.DMart_Order__r ? item.DMart_Order__r.Name : 'Unknown',
                        OrderStatus: item.DMart_Order__r ? item.DMart_Order__r.Order_Status__c : 'Unknown',
                        formattedDate: new Date(item.CreatedDate).toLocaleDateString()
                    };
                });
            }
        } else if (error) {
            console.error('Error fetching product data:', error);
            this.recentPurchases = [];
        }
    }

    get hasPurchases() {
        return this.recentPurchases && this.recentPurchases.length > 0;
    }

    get purchasesCount() {
        return this.recentPurchases ? this.recentPurchases.length : 0;
    }
}
