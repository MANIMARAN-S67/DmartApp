import { LightningElement, api } from 'lwc';

const ACTION_COLORS = {
    login: 'dot-green',
    logout: 'dot-gray',
    order: 'dot-blue',
    payment: 'dot-purple',
    product: 'dot-orange',
    default: 'dot-blue'
};

export default class ActivityLog extends LightningElement {
    @api activities = [];

    get processedLogs() {
        return (this.activities || []).map(log => {
            const action = (log.Action__c || '').toLowerCase();
            let dotColor = ACTION_COLORS.default;
            if (action.includes('login')) dotColor = ACTION_COLORS.login;
            else if (action.includes('logout')) dotColor = ACTION_COLORS.logout;
            else if (action.includes('order')) dotColor = ACTION_COLORS.order;
            else if (action.includes('payment')) dotColor = ACTION_COLORS.payment;
            else if (action.includes('product')) dotColor = ACTION_COLORS.product;

            const ts = log.Timestamp__c || log.CreatedDate;
            return {
                ...log,
                dotColor,
                formattedTime: ts ? new Date(ts).toLocaleString() : ''
            };
        });
    }

    get hasLogs() {
        return this.activities && this.activities.length > 0;
    }
}
