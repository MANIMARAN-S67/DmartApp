import { LightningElement, api, wire } from 'lwc';
import getUserOrders from '@salesforce/apex/UserOrdersController.getUserOrders';

const COLUMNS = [
    { label: 'Product Name', fieldName: 'Product_Name__c', type: 'text' },
    { label: 'Quantity', fieldName: 'Quantity__c', type: 'number' },
    { label: 'Price', fieldName: 'Price__c', type: 'currency' }
];

export default class UserOrdersViewer extends LightningElement {
    @api recordId; // Dmart_User__c Id
    orders = [];
    columns = COLUMNS;
    error;
    activeSections = [];

    @wire(getUserOrders, { userId: '$recordId' })
    wiredOrders({ error, data }) {
        if (data) {
            this.orders = data.map(order => {
                return {
                    ...order,
                    formattedDate: new Date(order.CreatedDate).toLocaleDateString(),
                    hasItems: order.DMart_Order_Items__r && order.DMart_Order_Items__r.length > 0,
                    items: order.DMart_Order_Items__r || []
                };
            });
            // Open the first order by default if exists
            if(this.orders.length > 0) {
                this.activeSections = [this.orders[0].Id];
            }
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.orders = [];
        }
    }
    
    get hasOrders() {
        return this.orders && this.orders.length > 0;
    }
}
