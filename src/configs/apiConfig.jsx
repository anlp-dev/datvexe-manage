const API_BASE_URL_DEPLOY = 'http://54.206.126.69:9999';

const headers = {
    'Content-Type': 'application/json',
};

const getAuthHeaders = (token) => ({
    ...headers,
    'Authorization': `Bearer ${token}`,
});

const apiConfig = {
    baseUrl: API_BASE_URL_DEPLOY,
    headers,
    getAuthHeaders,
};

export default apiConfig;