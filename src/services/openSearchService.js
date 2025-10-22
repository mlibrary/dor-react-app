import { OPENSEARCH_CONFIG, SEARCH_FIELDS } from '../utils/constants';

export const searchFlights = async (query, status, priceRange = null, size = 50) => {
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

  // Build filters array
  const filters = [];

  // Add status filter
  if (status !== "all") {
    filters.push({
      term: {
        Cancelled: status === "cancelled"
      }
    });
  }

  // Add price range filter
  if (priceRange && (priceRange.min > 0 || priceRange.max < 1200)) {
    filters.push({
      range: {
        AvgTicketPrice: {
          gte: priceRange.min,
          lte: priceRange.max
        }
      }
    });
  }

  // Build the search body
  let searchBody;
  if (filters.length === 0) {
    searchBody = {
      size,
      query: queryObj
    };
  } else {
    searchBody = {
      size,
      query: {
        bool: {
          must: queryObj,
          filter: filters
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
