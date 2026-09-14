import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getDashboardSummary from '@salesforce/apex/DmartAdminDashboardController.getDashboardSummary';
// Import our new Premium Hero Image
import HERO_IMAGE from '@salesforce/resourceUrl/DMartPremiumHero';

const EMPTY_SUMMARY = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    categoryCounts: []
};

const STATUS_CLASS_MAP = {
    'Delivered':  'badge-solid-green',
    'Shipped':    'badge-solid-blue',
    'Processing': 'badge-solid-orange',
    'Cancelled':  'badge-solid-red',
    'Pending':    'badge-solid-gray'
};

const DEFAULT_CATEGORIES = [
    { id: 'c1', name: 'Fresh Produce', icon: 'utility:food_and_drink', colorClass: 'cat-emerald' },
    { id: 'c2', name: 'Dairy & Eggs', icon: 'utility:steps', colorClass: 'cat-blue' },
    { id: 'c3', name: 'Beverages', icon: 'utility:coffee', colorClass: 'cat-purple' },
    { id: 'c4', name: 'Household', icon: 'utility:home', colorClass: 'cat-orange' }
];

const NAV_ITEMS = [
    { id: 'dashboard',  label: 'Dashboard',  icon: 'utility:home',         isActive: true,  targetApiName: 'DmartHome' },
    { id: 'products',   label: 'Products',   icon: 'utility:product',      isActive: false, targetApiName: 'Product_dmart__c' },
    { id: 'orders',     label: 'Orders',     icon: 'utility:cases',        isActive: false, targetApiName: 'DMart_Order__c' },
    { id: 'customers',  label: 'Customers',  icon: 'utility:groups',       isActive: false, targetApiName: 'Dmart_User__c' },
    { id: 'reports',    label: 'Reports',    icon: 'utility:chart',        isActive: false, targetApiName: 'Report' }
];

export default class DmartHome extends NavigationMixin(LightningElement) {
    @track summaryData = { ...EMPTY_SUMMARY };
    @track isLoading = true;
    @track navItems = NAV_ITEMS.map(n => ({ ...n, cssClass: this._navCss(n) }));
    @track topCategories = DEFAULT_CATEGORIES;

    heroImageUrl = HERO_IMAGE;

    get greeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning,';
        if (hour < 18) return 'Good Afternoon,';
        return 'Good Evening,';
    }

    @wire(getDashboardSummary)
    wiredSummary(result) {
        const { data, error } = result;
        this.isLoading = false;

        if (data) {
            this.summaryData = {
                ...data,
                recentOrders: data.recentOrders || [],
                lowStockProducts: data.lowStockProducts || []
            };
        } else if (error) {
            console.error('dmartHome error:', error);
        }
    }

    get lowStockCount() {
        return (this.summaryData.lowStockProducts || []).length;
    }

    get processedOrders() {
        return (this.summaryData.recentOrders || []).slice(0, 5).map(o => ({
            ...o,
            statusClass: STATUS_CLASS_MAP[o.Order_Status__c] || 'badge-solid-gray',
            customerName: o.Name || 'Customer'
        }));
    }

    get processedLowStockProducts() {
        return (this.summaryData.lowStockProducts || []).slice(0, 4).map(p => {
            return {
                ...p,
                isCritical: p.Stock_Quantity__c < 10
            };
        });
    }

    _navCss(item) {
        return item.isActive ? 'nav-item nav-item--active' : 'nav-item';
    }

    handleNavClick(event) {
        const id = event.currentTarget.dataset.id;
        const clickedItem = this.navItems.find(n => n.id === id);
        
        this.navItems = this.navItems.map(n => ({
            ...n,
            isActive: n.id === id,
            cssClass: this._navCss({ ...n, isActive: n.id === id })
        }));

        if (clickedItem && clickedItem.targetApiName) {
            this[NavigationMixin.Navigate]({
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: clickedItem.targetApiName,
                    actionName: 'list'
                }
            });
        }
    }

    handleSearch() {
        this.showToast('Search', 'Searching records...', 'info');
    }

    handleSearchKey(event) {
        if (event.keyCode === 13) {
            this.handleSearch();
        }
    }

    handleProfileClick() {
        this.showToast('Profile', 'Opening Profile Settings...', 'info');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}