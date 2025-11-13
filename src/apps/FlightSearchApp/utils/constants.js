export const OPENSEARCH_CONFIG = {
    url: 'http://opensearch:9200',
    index: 'opensearch_dashboards_sample_data_flights'
};

export const SEARCH_FIELDS = [
    "Origin",
    "Dest",
    "OriginCityName",
    "DestCityName",
    "OriginCountry",
    "DestCountry",
    "Carrier",
    "FlightNum"
];

export const STATUS_OPTIONS = {
    ALL: 'all',
    ON_TIME: 'ontime',
    CANCELLED: 'cancelled'
};

export const PRICE_RANGE = {
    STEP: 10,
    DEFAULT_MIN: 0,      // Fallback if query fails
    DEFAULT_MAX: 1200    // Fallback if query fails
};
