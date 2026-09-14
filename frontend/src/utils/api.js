import axios from 'axios';

// VITE_API_BASE_URL now points directly to the Salesforce Public Site URL
// e.g. https://creative-narwhal-9a3xx3-dev-ed.trailblaze.my.salesforce-sites.com
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Append /services/apexrest as the base for all API calls
const api = axios.create({
    baseURL: `${BASE_URL}/services/apexrest`,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000 // 30 second timeout for Salesforce callouts
});

/**
 * Response interceptor — unwraps the Salesforce Apex ApiResponse envelope.
 *
 * Every Apex REST endpoint returns:
 *   { success: Boolean, message: String, data: Object|Array }
 *
 * This interceptor checks `success`, and if true, restructures the
 * response.data so that consuming pages get a predictable shape:
 *
 *   POST /DmartUserAPI_v2/register   → { success, message, user: {...} }
 *   POST /DmartUserAPI_v2/login      → { success, message, user: {...} }
 *   POST /DmartUserAPI_v2/google-login → { success, message, user: {...} }
 *   GET  /DmartUserAPI_v2/:id        → { success, message, user: {...} }
 *   GET  /DmartProductAPI            → { success, message, products: [...] }
 *   GET  /DmartProductAPI/:id        → { success, message, product: {...} }
 *   POST /DmartOrderAPI              → { success, message, order: {...}, orderId: "..." }
 *   GET  /DmartOrderAPI/:id          → { success, message, orders: [...] }
 *   POST /DmartActivityAPI           → passthrough
 */
api.interceptors.response.use((response) => {
    const raw = response.data;

    // Only unwrap if the Apex ApiResponse wrapper is present
    if (raw && typeof raw.success === 'boolean') {
        const url = response.config.url || '';

        // --- User API ---
        if (url.includes('DmartUserAPI')) {
            response.data = {
                success: raw.success,
                message: raw.message,
                user: raw.data || null,
            };
            return response;
        }

        // --- Product API ---
        if (url.includes('DmartProductAPI')) {
            // Single product vs list
            if (Array.isArray(raw.data)) {
                response.data = {
                    success: raw.success,
                    message: raw.message,
                    products: raw.data,
                };
            } else {
                response.data = {
                    success: raw.success,
                    message: raw.message,
                    product: raw.data,
                };
            }
            return response;
        }

        // --- Order API ---
        if (url.includes('DmartOrderAPI')) {
            if (Array.isArray(raw.data)) {
                // GET orders list
                response.data = {
                    success: raw.success,
                    message: raw.message,
                    orders: raw.data,
                };
            } else {
                // POST create order
                response.data = {
                    success: raw.success,
                    message: raw.message,
                    order: raw.data,
                    orderId: raw.data?.id || null,
                };
            }
            return response;
        }

        // --- Activity API (passthrough) ---
        // No transformation needed
    }

    return response;
}, (error) => {
    return Promise.reject(error);
});

/* ── USER ROUTES (DmartUserAPI_v2) ── */
export const registerUser = (data) => api.post('/DmartUserAPI_v2/register', data);
export const loginUser = (identifier) => api.post('/DmartUserAPI_v2/login', { identifier });
export const getUser = (sfContactId) => api.get(`/DmartUserAPI_v2/${sfContactId}`);

/* ── PRODUCT ROUTES (DmartProductAPI) ── */
export const fetchProducts = () => api.get('/DmartProductAPI');
export const fetchProductById = (id) => api.get(`/DmartProductAPI/${id}`);

/* ── ORDER ROUTES (DmartOrderAPI) ── */
export const createOrder = (contactId, totalAmount, items) =>
    api.post('/DmartOrderAPI', { contactId, totalAmount, items });
export const getOrders = (sfContactId) => api.get(`/DmartOrderAPI/${sfContactId}`);

/**
 * logActivity — fire-and-forget activity log to Salesforce.
 * Circuit breaker: disables itself after first failure (e.g. Activity_Log__c
 * custom object not created yet) to avoid flooding console with errors.
 */
let _activityDisabled = false;
export const logActivity = (contactId, action, path, details) => {
    if (!contactId || _activityDisabled) return;
    api.post('/DmartActivityAPI', {
        contactId,
        action,
        path,
        details,
        timestamp: new Date().toISOString()
    }).catch(() => {
        _activityDisabled = true;
        console.warn('⚠️ Activity logging disabled — Activity_Log__c custom object may not exist in your Salesforce org.');
    });
};

export default api;
