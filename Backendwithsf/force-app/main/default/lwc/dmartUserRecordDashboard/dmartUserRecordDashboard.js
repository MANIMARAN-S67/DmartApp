// dmartUserRecordDashboard.js
import { LightningElement, api, wire } from 'lwc';
import getUserData from '@salesforce/apex/DmartAdminDashboardController.getUserData';

const ORDER_ITEM_COLUMNS = [
    { label: 'Product Name', fieldName: 'Product_Name__c', type: 'text' },
    { label: 'Quantity', fieldName: 'Quantity__c', type: 'number', cellAttributes: { alignment: 'left' } },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', typeAttributes: { currencyCode: 'INR' } }
];

const LOG_COLUMNS = [
    { label: 'Action', fieldName: 'Action__c', type: 'text', initialWidth: 120 },
    { label: 'Path', fieldName: 'Path__c', type: 'text', initialWidth: 130 },
    { label: 'Timestamp', fieldName: 'formattedDate', type: 'text', initialWidth: 170 },
    { label: 'Details', fieldName: 'Details__c', type: 'text' }
];

export default class DmartUserRecordDashboard extends LightningElement {
    @api recordId;
    
    isLoading = true;
    orders = [];
    activityLogs = [];
    
    orderItemColumns = ORDER_ITEM_COLUMNS;
    logColumns = LOG_COLUMNS;
    activeSections = [];
    
    @wire(getUserData, { userId: '$recordId' })
    wiredUserData({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.orders = (data.orders || []).map(order => {
                return {
                    ...order,
                    formattedDate: new Date(order.CreatedDate).toLocaleDateString(),
                    hasItems: order.DMart_Order_Items__r && order.DMart_Order_Items__r.length > 0,
                    items: order.DMart_Order_Items__r || []
                };
            });
            this.activityLogs = (data.activityLogs || []).map(log => {
                return {
                    ...log,
                    formattedDate: log.Timestamp__c ? new Date(log.Timestamp__c).toLocaleString() : new Date(log.CreatedDate).toLocaleString()
                };
            });
            if (this.orders.length > 0) {
                this.activeSections = [this.orders[0].Id];
            } else {
                this.activeSections = [];
            }
        } else if (error) {
            console.error('Error fetching user data:', error);
            this.orders = [];
            this.activityLogs = [];
        }
    }
    
    get hasOrders() {
        return this.orders && this.orders.length > 0;
    }
    
    get hasLogs() {
        return this.activityLogs && this.activityLogs.length > 0;
    }
    
    get ordersCount() {
        return this.orders ? this.orders.length : 0;
    }
    
    get logsCount() {
        return this.activityLogs ? this.activityLogs.length : 0;
    }
    
    get ordersTabLabel() {
        return `Orders (${this.ordersCount})`;
    }
    
    get logsTabLabel() {
        return `Activity Logs (${this.logsCount})`;
    }
}
