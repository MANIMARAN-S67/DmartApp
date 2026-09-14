import { LightningElement, wire } from 'lwc';
import getAllUsers from '@salesforce/apex/DmartAdminDashboardController.getAllUsers';
import getUserData from '@salesforce/apex/DmartAdminDashboardController.getUserData';

const USER_COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email__c', type: 'email' }
];

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

export default class DmartUserDashboard extends LightningElement {
    users = [];
    filteredUsers = [];
    searchKey = '';
    isLoadingUsers = true;
    isLoadingDetails = false;
    
    selectedUserId;
    selectedUserName;
    selectedUserEmail;
    selectedUserPhone;
    selectedUserAddress;
    selectedUserRows = [];
    
    orders = [];
    activityLogs = [];
    
    userColumns = USER_COLUMNS;
    orderItemColumns = ORDER_ITEM_COLUMNS;
    logColumns = LOG_COLUMNS;
    
    activeSections = [];
    
    @wire(getAllUsers)
    wiredUsers({ error, data }) {
        this.isLoadingUsers = false;
        if (data) {
            this.users = data;
            this.filterUsers();
        } else if (error) {
            console.error('Error fetching users:', error);
            this.users = [];
            this.filteredUsers = [];
        }
    }
    
    @wire(getUserData, { userId: '$selectedUserId' })
    wiredUserData({ error, data }) {
        this.isLoadingDetails = false;
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
    
    handleSearchChange(event) {
        this.searchKey = event.target.value.toLowerCase();
        this.filterUsers();
    }
    
    filterUsers() {
        if (!this.searchKey) {
            this.filteredUsers = this.users;
        } else {
            this.filteredUsers = this.users.filter(user => {
                const name = user.Name ? user.Name.toLowerCase() : '';
                const email = user.Email__c ? user.Email__c.toLowerCase() : '';
                return name.includes(this.searchKey) || email.includes(this.searchKey);
            });
        }
    }
    
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        if (selectedRows.length > 0) {
            const nextUserId = selectedRows[0].Id;
            if (nextUserId !== this.selectedUserId) {
                this.isLoadingDetails = true;
                this.selectedUserId = nextUserId;
                this.selectedUserName = selectedRows[0].Name;
                this.selectedUserEmail = selectedRows[0].Email__c;
                this.selectedUserPhone = selectedRows[0].Phone__c;
                this.selectedUserAddress = selectedRows[0].Formatted_Address__c;
                this.selectedUserRows = [nextUserId];
            }
        } else {
            this.selectedUserId = undefined;
            this.selectedUserName = undefined;
            this.selectedUserEmail = undefined;
            this.selectedUserPhone = undefined;
            this.selectedUserAddress = undefined;
            this.selectedUserRows = [];
            this.orders = [];
            this.activityLogs = [];
        }
    }
    
    get hasUsers() {
        return this.filteredUsers && this.filteredUsers.length > 0;
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
