import { LightningElement, api } from 'lwc';

export default class OrderTable extends LightningElement {
    @api orders = [];

    get processedOrders() {
        return (this.orders || []).map(o => {
            const status = (o.Order_Status__c || '').toLowerCase();
            let orderBadgeClass = 'status-badge ';
            if (status === 'delivered') orderBadgeClass += 'badge-green';
            else if (status === 'pending') orderBadgeClass += 'badge-orange';
            else if (status === 'cancelled') orderBadgeClass += 'badge-red';
            else orderBadgeClass += 'badge-blue';

            const payment = (o.Payment_Status__c || '').toLowerCase();
            let paymentBadgeClass = 'status-badge ';
            if (payment === 'paid' || payment === 'success') paymentBadgeClass += 'badge-green';
            else if (payment === 'pending') paymentBadgeClass += 'badge-orange';
            else paymentBadgeClass += 'badge-blue';

            return {
                ...o,
                formattedDate: o.CreatedDate ? new Date(o.CreatedDate).toLocaleDateString() : '',
                orderBadgeClass,
                paymentBadgeClass
            };
        });
    }

    get hasOrders() {
        return this.orders && this.orders.length > 0;
    }
}
