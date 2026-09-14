import { LightningElement, track } from 'lwc';
import loginUser from '@salesforce/apex/DmartAppController.loginUser';

export default class DmartLogin extends LightningElement {
    @track identifier = '';
    @track password = '';
    @track errorMessage = '';
    @track loginMode = 'Email';

    get isEmailMode() { return this.loginMode === 'Email'; }
    get isPhoneMode() { return this.loginMode === 'Phone'; }
    get emailBtnClass() { return this.isEmailMode ? 'toggle-btn active' : 'toggle-btn'; }
    get phoneBtnClass() { return this.isPhoneMode ? 'toggle-btn active' : 'toggle-btn'; }
    get identifierPlaceholder() { return this.isEmailMode ? 'name@example.com' : '9876543210'; }

    handleModeToggle(event) {
        this.loginMode = event.target.dataset.mode;
        this.identifier = ''; // clear input when switching modes
        this.errorMessage = '';
    }

    handleIdentifierChange(event) {
        this.identifier = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleLogin() {
        this.errorMessage = '';
        
        if (!this.identifier) {
            this.errorMessage = `Please enter an ${this.loginMode.toLowerCase()}.`;
            return;
        }

        // Call Apex Imperatively
        // Note: The original backend only expects 'identifier'. 
        // We capture 'password' visually for the layout, but pass identifier as before.
        loginUser({ identifier: this.identifier })
            .then(result => {
                // Dispatch custom event to parent to navigate to Home
                this.dispatchEvent(new CustomEvent('login-success', {
                    detail: { user: result }
                }));
            })
            .catch(error => {
                this.errorMessage = error.body ? error.body.message : 'Login Failed. Please try again.';
            });
    }

    goToRegister() {
        // Tell parent app container to switch to register page
        this.dispatchEvent(new CustomEvent('navigate', {
            detail: { page: 'register' }
        }));
    }
}