/**
 * Tests for searchParserService.js
 *
 * TDD: these tests define the expected shape of parseSearchQuery's return value
 * after Phase 2 changes, including the new `parsedQueryDsl` field.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseSearchQuery, checkParserHealth } from '../searchParserService.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockFetchOk(body) {
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => body,
    });
}

function mockFetchError(status = 500) {
    global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status,
    });
}

function mockFetchNetworkFailure() {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
}

beforeEach(() => {
    vi.resetAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// parseSearchQuery — existing behaviour (must not regress)
// ---------------------------------------------------------------------------

describe('parseSearchQuery — existing fields', () => {
    it('returns rawQuery from result.raw_query', async () => {
        mockFetchOk({
            raw_query: 'cats',
            parsed_query: 'cats',
            parsed_query_dsl: { query: { match: { ic_all: 'cats' } } },
        });

        const result = await parseSearchQuery('cats');
        expect(result.rawQuery).toBe('cats');
    });

    it('returns parsedQuery (normalized query string) from result.parsed_query', async () => {
        mockFetchOk({
            raw_query: 'cats AND dogs',
            parsed_query: 'cats AND dogs',
            parsed_query_dsl: { query: { bool: { must: [] } } },
        });

        const result = await parseSearchQuery('cats AND dogs');
        expect(result.parsedQuery).toBe('cats AND dogs');
    });

    it('falls back to rawQuery for both fields when the service returns HTTP error', async () => {
        mockFetchError(503);

        const result = await parseSearchQuery('hello');
        expect(result.rawQuery).toBe('hello');
        expect(result.parsedQuery).toBe('hello');
    });

    it('falls back to rawQuery when there is a network failure', async () => {
        mockFetchNetworkFailure();

        const result = await parseSearchQuery('hello');
        expect(result.rawQuery).toBe('hello');
        expect(result.parsedQuery).toBe('hello');
        expect(result.error).toBeDefined();
    });
});

// ---------------------------------------------------------------------------
// parseSearchQuery — new parsedQueryDsl field (Phase 2)
// ---------------------------------------------------------------------------

describe('parseSearchQuery — parsedQueryDsl (Phase 2)', () => {
    it('returns parsedQueryDsl object from result.parsed_query_dsl', async () => {
        const dsl = { query: { match: { ic_all: { query: 'cats', operator: 'and' } } } };
        mockFetchOk({
            raw_query: 'cats',
            parsed_query: 'cats',
            parsed_query_dsl: dsl,
        });

        const result = await parseSearchQuery('cats');
        expect(result.parsedQueryDsl).toEqual(dsl);
    });

    it('returns null parsedQueryDsl when service response omits that field', async () => {
        mockFetchOk({
            raw_query: 'cats',
            parsed_query: 'cats',
            // no parsed_query_dsl key
        });

        const result = await parseSearchQuery('cats');
        expect(result.parsedQueryDsl).toBeNull();
    });

    it('returns null parsedQueryDsl on HTTP error (fallback path)', async () => {
        mockFetchError(500);

        const result = await parseSearchQuery('hello');
        expect(result.parsedQueryDsl).toBeNull();
    });

    it('returns null parsedQueryDsl on network failure (fallback path)', async () => {
        mockFetchNetworkFailure();

        const result = await parseSearchQuery('hello');
        expect(result.parsedQueryDsl).toBeNull();
    });

    it('handles complex nested DSL objects correctly', async () => {
        const dsl = {
            query: {
                bool: {
                    must: [
                        { match: { ic_all: 'cats' } },
                        { match: { ic_all: 'dogs' } },
                    ],
                },
            },
        };
        mockFetchOk({
            raw_query: 'cats AND dogs',
            parsed_query: 'cats AND dogs',
            parsed_query_dsl: dsl,
        });

        const result = await parseSearchQuery('cats AND dogs');
        expect(result.parsedQueryDsl).toEqual(dsl);
        expect(result.parsedQueryDsl.query.bool.must).toHaveLength(2);
    });
});

// ---------------------------------------------------------------------------
// parseSearchQuery — AbortSignal / cancellation
// ---------------------------------------------------------------------------

describe('parseSearchQuery — AbortSignal', () => {
    it('passes the signal option through to fetch', async () => {
        mockFetchOk({ raw_query: 'cats', parsed_query: 'cats', parsed_query_dsl: null });
        const controller = new AbortController();

        await parseSearchQuery('cats', { signal: controller.signal });

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/parse'),
            expect.objectContaining({ signal: controller.signal })
        );
    });

    it('re-throws AbortError without wrapping it in a fallback result', async () => {
        const abortError = new DOMException('Aborted', 'AbortError');
        global.fetch = vi.fn().mockRejectedValue(abortError);
        const controller = new AbortController();

        await expect(
            parseSearchQuery('cats', { signal: controller.signal })
        ).rejects.toThrow(abortError);
    });

    it('does not call console.error for AbortError (not a service failure)', async () => {
        const abortError = new DOMException('Aborted', 'AbortError');
        global.fetch = vi.fn().mockRejectedValue(abortError);
        const consoleSpy = vi.spyOn(console, 'error');

        await expect(parseSearchQuery('cats')).rejects.toThrow(abortError);
        expect(consoleSpy).not.toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// checkParserHealth
// ---------------------------------------------------------------------------

describe('checkParserHealth', () => {
    it('returns true when service responds ok', async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true });
        expect(await checkParserHealth()).toBe(true);
    });

    it('returns false when service responds not-ok', async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: false });
        expect(await checkParserHealth()).toBe(false);
    });

    it('returns false on network failure', async () => {
        mockFetchNetworkFailure();
        expect(await checkParserHealth()).toBe(false);
    });
});

