import axios from 'axios';
const api = axios.create({
    baseURL: 'https://creative-narwhal-9a3xx3-dev-ed.trailblaze.my.salesforce-sites.com/services/apexrest',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000 
});

api.interceptors.response.use((response) => {
    const raw = response.data;
    if (raw && typeof raw.success === 'boolean') {
        const url = response.config.url || '';
        if (url.includes('DmartUserAPI')) {
            response.data = {
                success: raw.success,
                message: raw.message,
                user: raw.data || null,
            };
            return response;
        }
    }
    return response;
}, (error) => {
    return Promise.reject(error);
});

api.post('/DmartUserAPI_v2/login', { identifier: 'sachin05@gmail.com', password: 'wrong' })
    .then(r => console.log('SUCCESS:', r.data))
    .catch(e => console.log('ERROR:', e.response?.data));
