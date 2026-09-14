// dmartOrderRecordDashboard.js
import { LightningElement, api, wire } from 'lwc';
import getOrderData from '@salesforce/apex/DmartRecordDashboardsController.getOrderData';

const COLUMNS = [
    { label: 'Product Name', fieldName: 'Product_Name__c', type: 'text' },
    { label: 'Category', fieldName: 'Category', type: 'text' },
    { label: 'Quantity', fieldName: 'Quantity__c', type: 'number', cellAttributes: { alignment: 'left' } },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', typeAttributes: { currencyCode: 'INR' } }
];

export default class DmartOrderRecordDashboard extends LightningElement {
    @api recordId;
    
    isLoading = true;
    orderInfo;
    userInfo;
    orderItems = [];
    itemColumns = COLUMNS;

    @wire(getOrderData, { recordId: '$recordId' })
    wiredData({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.orderInfo = data.orderInfo;
            this.userInfo = data.userInfo;
            if (data.orderItems) {
                this.orderItems = data.orderItems.map(item => {
                    return {
                        ...item,
                        Category: item.Product_dmart__r ? item.Product_dmart__r.Category__c : 'N/A'
                    };
                });
            }
        } else if (error) {
            console.error('Error fetching order data:', error);
            this.orderItems = [];
        }
    }

    get hasItems() {
        return this.orderItems && this.orderItems.length > 0;
    }

    get itemsCount() {
        return this.orderItems ? this.orderItems.length : 0;
    }
}
