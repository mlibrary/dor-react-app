export const OPENSEARCH_CONFIG = {
    url: 'http://localhost:9200',
    index: 'opensearch_dashboards_sample_data_flights'
};

export const SEARCH_FIELDS = [
    "OriginCityName",
    "DestCityName",
    "Carrier",
    "FlightNum",
    "OriginCountry",
    "DestCountry"
];

export const STATUS_OPTIONS = {
    ALL: 'all',
    ON_TIME: 'ontime',
    CANCELLED: 'cancelled'
};

export const PRICE_RANGE = {
  MIN: 0,
  MAX: 1200,
  STEP: 50
};
