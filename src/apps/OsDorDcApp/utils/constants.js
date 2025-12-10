export const OPENSEARCH_CONFIG = {
    url: import.meta.env.VITE_OPENSEARCH_URL || 'https://opensearch.discovery.dor.lib.umich.edu',
    credentials: import.meta.env.VITE_OPENSEARCH_CREDENTIALS || 'admin:DiscOvery0!234dawg',
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
