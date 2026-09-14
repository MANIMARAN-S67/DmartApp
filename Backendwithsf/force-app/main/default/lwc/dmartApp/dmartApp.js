import { LightningElement, track } from 'lwc';

export default class DmartApp extends LightningElement {
    @track currentPage = 'login'; // 'login', 'register', 'home'
    @track currentUser = null;

    get showLogin() { return this.currentPage === 'login'; }
    get showRegister() { return this.currentPage === 'register'; }
    get showHome() { return this.currentPage === 'home'; }

    handleNavigate(event) {
        this.currentPage = event.detail.page;
    }

    handleLoginSuccess(event) {
        this.currentUser = event.detail.user;
        this.currentPage = 'home';
    }
}