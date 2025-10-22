import { OPENSEARCH_CONFIG, SEARCH_FIELDS } from '../utils/constants';

export const searchFlights = async (query, status, size = 50) => {
    // Build the base query
    let queryObj;
    if (query.trim() === "") {
        queryObj = { match_all: {} };
    } else {
        queryObj = {
            multi_match: {
                query: query,
                fields: SEARCH_FIELDS
            }
        };
    }

    // Build the filter for status
    let searchBody;
    if (status === "all") {
        searchBody = {
            size,
            query: queryObj
        };
    } else {
        // Use bool query with filter for status
        searchBody = {
            size,
            query: {
                bool: {
                    must: queryObj,
                    filter: {
                        term: {
                            Cancelled: status === "cancelled"
                        }
                    }
                }
            }
        };
    }

    const response = await fetch(`${OPENSEARCH_CONFIG.url}/${OPENSEARCH_CONFIG.index}/_search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.hits.hits;
};
