/**
 * Search Parser Service Client
 *
 * This module provides a client for the search-parser microservice which
 * parses and transforms raw search queries before sending them to OpenSearch.
 */

const SEARCH_PARSER_URL = import.meta.env.VITE_SEARCH_PARSER_URL || 'http://localhost:4567';

/**
 * Parse a search query using the microservice.
 *
 * @param {string} rawQuery - The raw search query entered by the user
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] - Optional AbortSignal to cancel the request.
 *   If the signal fires, the returned promise rejects with a DOMException whose
 *   name is 'AbortError'. The caller is responsible for handling that case.
 * @returns {Promise<{
 *   rawQuery: string,
 *   parsedQuery: string,
 *   parsedQueryDsl: object|null,
 *   error?: string
 * }>}
 *
 * Response fields:
 *  - rawQuery        — the original query string echoed back by the service
 *  - parsedQuery     — normalized query string (the parser's canonical form of the input)
 *  - parsedQueryDsl  — OpenSearch Query DSL object, or null if unavailable
 */
export async function parseSearchQuery(rawQuery, { signal } = {}) {
    try {
        const response = await fetch(`${SEARCH_PARSER_URL}/parse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: rawQuery }),
            signal,
        });

        if (!response.ok) {
            throw new Error(`Parser service returned ${response.status}`);
        }

        const result = await response.json();
        return {
            rawQuery: result.raw_query,
            parsedQuery: result.parsed_query,
            parsedQueryDsl: result.parsed_query_dsl ?? null,
        };
    } catch (error) {
        // AbortError means the caller cancelled this request intentionally
        // (a newer keystroke superseded it). Re-throw so the caller can
        // ignore it without treating it as a service failure.
        if (error.name === 'AbortError') {
            throw error;
        }
        console.error('Error calling search parser service:', error);
        // Fallback: return the raw query as-is if the service fails
        return {
            rawQuery,
            parsedQuery: rawQuery,
            parsedQueryDsl: null,
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

