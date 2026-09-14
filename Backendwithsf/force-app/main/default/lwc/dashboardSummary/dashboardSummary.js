import { LightningElement, api } from 'lwc';

export default class DashboardSummary extends LightningElement {
    @api totalUsers = 0;
    @api totalProducts = 0;
    @api totalOrders = 0;
    @api revenue = 0;
}
