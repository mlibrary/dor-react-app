export const REACTIVESEARCH_CONFIG = {
    url: import.meta.env.VITE_REACTIVESEARCH_URL || 'http://reactivesearch:8000',
    credentials: import.meta.env.VITE_REACTIVESEARCH_CREDENTIALS || 'admin:password',
    index: import.meta.env.VITE_OPENSEARCH_INDEX || 'dor-dc-20260513',
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
