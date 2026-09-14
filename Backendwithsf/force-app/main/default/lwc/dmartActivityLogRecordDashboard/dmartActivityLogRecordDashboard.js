// dmartActivityLogRecordDashboard.js
import { LightningElement, api, wire } from 'lwc';
import getActivityLogData from '@salesforce/apex/DmartRecordDashboardsController.getActivityLogData';

export default class DmartActivityLogRecordDashboard extends LightningElement {
    @api recordId;
    
    isLoading = true;
    logInfo;
    userInfo;
    formattedDate;

    @wire(getActivityLogData, { recordId: '$recordId' })
    wiredData({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.logInfo = data.logInfo;
            this.userInfo = data.userInfo;
            
            if (this.logInfo) {
                let dt = this.logInfo.Timestamp__c || this.logInfo.CreatedDate;
                this.formattedDate = new Date(dt).toLocaleString();
            }
        } else if (error) {
            console.error('Error fetching log data:', error);
        }
    }
}
