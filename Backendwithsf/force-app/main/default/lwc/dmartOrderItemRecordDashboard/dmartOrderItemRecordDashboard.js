// dmartOrderItemRecordDashboard.js
import { LightningElement, api, wire } from 'lwc';
import getOrderItemData from '@salesforce/apex/DmartRecordDashboardsController.getOrderItemData';

export default class DmartOrderItemRecordDashboard extends LightningElement {
    @api recordId;
    
    isLoading = true;
    itemInfo;
    orderInfo;
    productInfo;

    @wire(getOrderItemData, { recordId: '$recordId' })
    wiredData({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.itemInfo = data.itemInfo;
            this.orderInfo = data.orderInfo;
            this.productInfo = data.productInfo;
        } else if (error) {
            console.error('Error fetching order item data:', error);
        }
    }

    get totalPrice() {
        if (this.itemInfo && this.itemInfo.Quantity__c && this.itemInfo.Price__c) {
            return this.itemInfo.Quantity__c * this.itemInfo.Price__c;
        }
        return 0;
    }
}
