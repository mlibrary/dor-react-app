/**
 * Query Builder for OpenSearch
 *
 * Centralises the logic for converting a user search query into an
 * OpenSearch Query DSL object suitable for use in a ReactiveSearch
 * `customQuery` callback.
 *
 * Priority:
 *  1. If `parsedQueryDsl` is a non-empty object, return it directly — the
 *     parser service owns the DSL and knows best how to represent the query.
 *  2. Otherwise fall back to the manual DSL construction that was previously
 *     inline in RsDorDcApp/index.jsx, using the Solr-format `queryString`.
 */

/**
 * Build an OpenSearch Query DSL object for the given search input.
 *
 * @param {string} value           - Raw or Solr-format query string from the user
 * @param {object|null} parsedQueryDsl - OpenSearch DSL object from the parser service,
 *                                       or null when unavailable
 * @param {string[]} dataFields    - OpenSearch field names to search across
 * @returns {object|null}          - OpenSearch query object, or null for empty input
 */
export function buildOpenSearchQuery(value, parsedQueryDsl, dataFields) {
    // Empty input → no query
    if (!value || !value.trim()) {
        return null;
    }

    // Phase 2: use DSL from parser service when available and non-empty
    if (parsedQueryDsl && typeof parsedQueryDsl === 'object' && Object.keys(parsedQueryDsl).length > 0) {
        return parsedQueryDsl;
    }

    // Fallback: manual DSL construction (original behaviour)
    const queryToUse = value.trim();
    const hasBooleanOperators = /\b(AND|OR|NOT)\b/i.test(queryToUse);

    if (hasBooleanOperators) {
        // Boolean operators → query_string for proper precedence handling
        return {
            query: {
                query_string: {
                    query: queryToUse,
                    fields: dataFields,
                    default_operator: 'AND',
                },
            },
        };
    }

    // Simple terms → bool/should with boosted match + phrase matching
    return {
        query: {
            bool: {
                should: [
                    {
                        match: {
                            ic_all: {
                                query: queryToUse,
                                operator: 'and',
                                boost: 3,
                            },
                        },
                    },
                    {
                        match: {
                            ic_all: {
                                query: queryToUse,
                                operator: 'or',
                                minimum_should_match: '75%',
                            },
                        },
                    },
                    {
                        multi_match: {
                            query: queryToUse,
                            fields: [
                                'dc_title^5',
                                'dc_title.strict^7',
                                'dc_creator^3',
                                'dc_description^2',
                                'dc_subject^3',
                                'dc_genre',
                                'dc_publisher',
                                'dc_source',
                                'hlb^3',
                                'groupName^2',
                            ],
                            type: 'best_fields',
                            tie_breaker: 0.3,
                        },
                    },
                    {
                        multi_match: {
                            query: queryToUse,
                            type: 'phrase',
                            fields: [
                                'dc_title^8',
                                'dc_title.strict^10',
                                'dc_creator^5',
                                'dc_description^3',
                                'dc_subject^5',
                            ],
                            tie_breaker: 0.3,
                        },
                    },
                ],
                minimum_should_match: 1,
            },
        },
    };
}

