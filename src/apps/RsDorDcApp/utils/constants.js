export const REACTIVESEARCH_CONFIG = {
    url: import.meta.env.VITE_REACTIVESEARCH_URL || 'http://reactivesearch:8000',
    credentials: import.meta.env.VITE_REACTIVESEARCH_CREDENTIALS || 'admin:password',
    // Custom endpoint configuration (if not using default _reactivesearch.v3)
    customEndpoint: import.meta.env.VITE_CUSTOM_SEARCH_ENDPOINT || '/_search/template',
    // Search template configuration
    searchTemplate: {
        id: import.meta.env.VITE_SEARCH_TEMPLATE_ID || 'dor_search_template', // Template name/ID
        useTemplate: import.meta.env.VITE_USE_SEARCH_TEMPLATE === 'true' || true, // Enable/disable template usage
    }
};

export const SEARCH_FIELDS = [
    "ic_all"
];

export const COLLECTION_OPTIONS = {
    ALL: 'all',
    ON_TIME: 'ontime',
    CANCELLED: 'cancelled'
};

export const PRICE_RANGE = {
    STEP: 10,
    DEFAULT_MIN: 0,      // Fallback if query fails
    DEFAULT_MAX: 1200    // Fallback if query fails
};
