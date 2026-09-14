import { LightningElement, track } from 'lwc';

export default class DashboardHeader extends LightningElement {
    @track currentDateTime = '';
    _timer;

    connectedCallback() {
        this.updateTime();
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._timer = setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    disconnectedCallback() {
        if (this._timer) {
            clearInterval(this._timer);
        }
    }

    updateTime() {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        this.currentDateTime = new Date().toLocaleString('en-IN', options);
    }

    handleRefresh() {
        // Fire event to parent (dmartDashboard) to re-fetch data
        this.dispatchEvent(new CustomEvent('refresh'));
    }
}
