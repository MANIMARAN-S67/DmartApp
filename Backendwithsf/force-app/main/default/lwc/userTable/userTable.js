import { LightningElement, api, track } from 'lwc';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email__c', type: 'email' },
    { label: 'Phone', fieldName: 'Phone__c', type: 'phone' },
    { label: 'Address', fieldName: 'Formatted_Address__c', type: 'text' },
    { label: 'Registered On', fieldName: 'formattedDate', type: 'text' }
];

export default class UserTable extends LightningElement {
    @api users = [];
    @track searchKey = '';
    columns = COLUMNS;

    handleSearchChange(event) {
        this.searchKey = event.target.value.toLowerCase();
    }

    get filteredUsers() {
        if (!this.searchKey) return this.processedUsers;
        return this.processedUsers.filter(u => {
            const name = u.Name ? u.Name.toLowerCase() : '';
            const email = u.Email__c ? u.Email__c.toLowerCase() : '';
            const phone = u.Phone__c ? u.Phone__c.toLowerCase() : '';
            return name.includes(this.searchKey) || email.includes(this.searchKey) || phone.includes(this.searchKey);
        });
    }

    get processedUsers() {
        return (this.users || []).map(u => ({
            ...u,
            formattedDate: u.CreatedDate ? new Date(u.CreatedDate).toLocaleDateString() : ''
        }));
    }

    get hasUsers() {
        return this.filteredUsers && this.filteredUsers.length > 0;
    }
}
