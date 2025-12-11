import { OPENSEARCH_CONFIG, SEARCH_FIELDS } from '../utils/constants.js';

export const checkHealth = async () => {
  try {
    const response = await fetch(`${OPENSEARCH_CONFIG.url}/_cluster/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: `${OPENSEARCH_CONFIG.credentials}`
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSearch health check failed:', errorText);
      return { status: 'error', message: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    console.log('OpenSearch cluster health:', data);
    return { status: 'success', data };
  } catch (error) {
    console.error('Error checking OpenSearch health:', error);
    return { status: 'error', message: error.message };
  }
};

// Test function to check OpenSearch connectivity
export const testOpenSearchConnection = async () => {
  try {
    console.log(`Testing OpenSearch connection to: ${OPENSEARCH_CONFIG.url}/dor-dc`);

    // Try a simple cluster health check first
    const healthResponse = await fetch(`${OPENSEARCH_CONFIG.url}/_cluster/health`, {
      method: 'GET',
      credentials: `${OPENSEARCH_CONFIG.credentials}`
    });

    console.log('Health check response:', healthResponse.status, healthResponse.statusText);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Cluster health:', healthData);
      return { success: true, health: healthData };
    } else {
      const errorText = await healthResponse.text();
      console.error('Health check failed:', errorText);
      return { success: false, error: errorText, status: healthResponse.status };
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// export const getPriceStats = async () => {
//   const searchBody = {
//     size: 0,  // Don't return documents, only aggregations
//     aggs: {
//       price_stats: {
//         stats: {
//           field: "AvgTicketPrice"
//         }
//       }
//     }
//   };
//
//   const response = await fetch(`${OPENSEARCH_CONFIG.url}/${OPENSEARCH_CONFIG.index}/_search`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(searchBody)
//   });
//
//   if (!response.ok) {
//     throw new Error(`HTTP error! collection: ${response.collection}`);
//   }
//
//   const data = await response.json();
//   const stats = data.aggregations.price_stats;
//
//   return {
//     min: Math.floor(stats.min),
//     max: Math.ceil(stats.max)
//   };
// };

export const searchThings = async (query, collection, priceRange = null, size = 50) => {
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

  // Add collection filter
  // if (collection !== "all") {
  //   filters.push({
  //     term: {
  //       Cancelled: collection === "cancelled"
  //     }
  //   });
  // }

  // Add price range filter
  // if (priceRange && (priceRange.min !== undefined || priceRange.max !== undefined)) {
  //   filters.push({
  //     range: {
  //       AvgTicketPrice: {
  //         gte: priceRange.min,
  //         lte: priceRange.max
  //       }
  //     }
  //   });
  // }

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

  let mySearchBody;
  mySearchBody = {
      size,
    query: {
        multi_match: {
            query: query,
            fields: SEARCH_FIELDS
        }
    }
  }

  try {
    console.log(`Searching OpenSearch at: ${OPENSEARCH_CONFIG.url}/dor-dc/_search`);
    const response = await fetch(`${OPENSEARCH_CONFIG.url}/dor-dc/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody),
      credentials: `${OPENSEARCH_CONFIG.credentials}`
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSearch error response:', errorText);
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${errorText}`);
    }

    const data = await response.json();
    return data.hits.hits;
  } catch (error) {
    console.error('Error fetching from OpenSearch:', error);
    throw error;
  }
};
