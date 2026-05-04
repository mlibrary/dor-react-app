/**
 * Search Parser Service Client
 *
 * This module provides a client for the search-parser microservice which
 * parses and transforms raw search queries before sending them to OpenSearch.
 */

const SEARCH_PARSER_URL = import.meta.env.VITE_SEARCH_PARSER_URL || 'http://localhost:4567';

/**
 * Parse a search query using the microservice
 * @param {string} rawQuery - The raw search query entered by the user
 * @returns {Promise<{rawQuery: string, parsedQuery: string}>}
 */
export async function parseSearchQuery(rawQuery) {
    try {
        const response = await fetch(`${SEARCH_PARSER_URL}/parse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: rawQuery }),
        });

        if (!response.ok) {
            throw new Error(`Parser service returned ${response.status}`);
        }

        const result = await response.json();
        return {
            rawQuery: result.raw_query,
            parsedQuery: result.parsed_query,
        };
    } catch (error) {
        console.error('Error calling search parser service:', error);
        // Fallback: return the raw query as-is if the service fails
        return {
            rawQuery,
            parsedQuery: rawQuery,
            error: error.message,
        };
    }
}

/**
 * Check if the search parser service is available
 * @returns {Promise<boolean>}
 */
export async function checkParserHealth() {
    try {
        const response = await fetch(`${SEARCH_PARSER_URL}/health`, {
            method: 'GET',
        });
        return response.ok;
    } catch (error) {
        console.error('Parser service health check failed:', error);
        return false;
    }
}

