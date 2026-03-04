const jsforce = require('jsforce');
require('dotenv').config();

// Create connection using jsforce
const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
});

const username = process.env.SF_USERNAME;
// Password + Security Token combined
const password = (process.env.SF_PASSWORD || '') + (process.env.SF_SECURITY_TOKEN || '');

// Connect to Salesforce
if (username && password) {
    conn.login(username, password)
        .then(userInfo => {
            console.log('Successfully connected to Salesforce!');
            console.log('User ID:', userInfo.id);
            console.log('Org ID:', userInfo.organizationId);
        })
        .catch(err => {
            console.error('Failed to connect to Salesforce (Mock mode will be used if configured):', err.message);
        });
} else {
    console.warn('Salesforce credentials not found in environment variables. Add them to .env file.');
}

module.exports = conn;
