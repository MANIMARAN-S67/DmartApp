import { LightningElement, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getDashboardSummary from '@salesforce/apex/DmartAdminDashboardController.getDashboardSummary';

const EMPTY_SUMMARY = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    recentUsers: [],
    recentProducts: [],
    recentOrders: [],
    recentActivities: [],
    lowStockProducts: [],
    orderStatusCounts: [],
    categoryCounts: []
};

export default class DmartDashboard extends LightningElement {
    @track summaryData = { ...EMPTY_SUMMARY };
    @track isLoading = true;
    @track hasError = false;
    @track errorMessage = '';

    // Store the wired result so we can refresh it
    _wiredResult;

    @wire(getDashboardSummary)
    wiredSummary(result) {
        this._wiredResult = result;
        const { error, data } = result;
        this.isLoading = false;
        if (data) {
            this.summaryData = {
                totalUsers:        data.totalUsers        || 0,
                totalProducts:     data.totalProducts     || 0,
                totalOrders:       data.totalOrders       || 0,
                revenue:           data.revenue           || 0,
                recentUsers:       data.recentUsers       || [],
                recentProducts:    data.recentProducts    || [],
                recentOrders:      data.recentOrders      || [],
                recentActivities:  data.recentActivities  || [],
                lowStockProducts:  data.lowStockProducts  || [],
                orderStatusCounts: data.orderStatusCounts || [],
                categoryCounts:    data.categoryCounts    || []
            };
            this.hasError = false;
        } else if (error) {
            this.hasError = true;
            this.errorMessage = error.body
                ? error.body.message
                : 'An unknown error occurred loading the dashboard.';
            console.error('Dashboard error:', error);
        }
    }

    /** Called when the header refresh button fires the 'refresh' custom event */
    handleRefresh() {
        this.isLoading = true;
        refreshApex(this._wiredResult).finally(() => {
            this.isLoading = false;
        });
    }
}
