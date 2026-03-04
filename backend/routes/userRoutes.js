const express = require('express');
const axios = require('axios');
const router = express.Router();

/* ================= GET SALESFORCE TOKEN ================= */
async function getSalesforceToken() {

    const response = await axios.post(
        "https://login.salesforce.com/services/oauth2/token",
        new URLSearchParams({
            grant_type: "password",
            client_id: process.env.SF_CLIENT_ID,
            client_secret: process.env.SF_CLIENT_SECRET,
            username: process.env.SF_USERNAME,
            password: process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
        }),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }
    );

    return {
        accessToken: response.data.access_token,
        instanceUrl: response.data.instance_url
    };
}

/* ================= REGISTER USER ================= */
router.post('/', async (req, res) => {

    const { name, email, phone } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and Email are required"
        });
    }

    try {

        const { accessToken, instanceUrl } = await getSalesforceToken();

        const createResponse = await axios.post(
            `${instanceUrl}/services/data/v59.0/sobjects/Account`,
            {
                Name: name,
                Email__c: email,
                Phone: phone || ""
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            success: true,
            accountId: createResponse.data.id
        });

    } catch (error) {
        console.error("Registration Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Salesforce Registration Failed"
        });
    }
});

/* ================= LOGIN USER ================= */
router.post('/login', async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email required" });
    }

    try {

        const { accessToken, instanceUrl } = await getSalesforceToken();

        const query = `
            SELECT Id, Name, Email__c, Phone
            FROM Account
            WHERE Email__c = '${email.replace(/'/g, "\\'")}'
            LIMIT 1
        `;

        const sfResponse = await axios.get(
            `${instanceUrl}/services/data/v59.0/query?q=${encodeURIComponent(query)}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        if (sfResponse.data.records.length === 0) {
            return res.json({ error: "User not found" });
        }

        res.json({
            success: true,
            user: sfResponse.data.records[0]
        });

    } catch (error) {
        console.error("Login Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Salesforce Login Failed"
        });
    }
});

/* ================= GET USER BY ID ================= */
router.get('/:id', async (req, res) => {

    const accountId = req.params.id;

    try {

        const { accessToken, instanceUrl } = await getSalesforceToken();

        const response = await axios.get(
            `${instanceUrl}/services/data/v59.0/sobjects/Account/${accountId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        res.json({
            success: true,
            user: response.data
        });

    } catch (error) {
        console.error("Get User Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
});

module.exports = router;