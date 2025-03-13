const API_BASE_URL_DEPLOY = 'https://api.datvexe-manage.id.vn';
const API_LOCAL = 'http://localhost:9999';

const headers = {
    'Content-Type': 'application/json',
};

const getAuthHeaders = (token) => ({
    ...headers,
    'Authorization': `Bearer ${token}`,
});

const apiConfig = {
    baseUrl: API_LOCAL,
    headers,
    getAuthHeaders,
};

export default apiConfig;