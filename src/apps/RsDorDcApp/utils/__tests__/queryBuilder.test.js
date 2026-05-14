/**
 * Tests for utils/queryBuilder.js
 *
 * TDD: these tests define the expected behaviour of the buildOpenSearchQuery
 * helper before it is extracted from index.jsx and enhanced to use parsedQueryDsl.
 *
 * Contract:
 *  - When parsedQueryDsl is a non-null object → return it directly (parser owns the DSL)
 *  - When parsedQueryDsl is null/undefined    → fall back to manual DSL construction
 *    using the queryString (normalized query string, same as current behaviour)
 */

import { describe, it, expect } from 'vitest';
import { buildOpenSearchQuery } from '../queryBuilder.js';

const DATA_FIELDS = ['ic_all'];

// ---------------------------------------------------------------------------
// DSL pass-through (new Phase 2 path)
// ---------------------------------------------------------------------------

describe('buildOpenSearchQuery — DSL pass-through', () => {
    it('returns the parsedQueryDsl object directly when provided', () => {
        const dsl = { query: { match: { ic_all: { query: 'cats', operator: 'and' } } } };
        const result = buildOpenSearchQuery('cats', dsl, DATA_FIELDS);
        expect(result).toEqual(dsl);
    });

    it('returns a complex bool DSL directly without modification', () => {
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
        const result = buildOpenSearchQuery('cats AND dogs', dsl, DATA_FIELDS);
        expect(result).toEqual(dsl);
    });

    it('returns DSL with must_not for NOT queries', () => {
        const dsl = {
            query: {
                bool: {
                    must_not: [{ match: { ic_all: 'spam' } }],
                },
            },
        };
        const result = buildOpenSearchQuery('NOT spam', dsl, DATA_FIELDS);
        expect(result).toEqual(dsl);
    });
});

// ---------------------------------------------------------------------------
// Fallback — manual DSL construction (current behaviour, must not regress)
// ---------------------------------------------------------------------------

describe('buildOpenSearchQuery — fallback (no DSL)', () => {
    it('returns null when value is empty and parsedQueryDsl is null', () => {
        const result = buildOpenSearchQuery('', null, DATA_FIELDS);
        expect(result).toBeNull();
    });

    it('returns null when value is empty string even with no DSL', () => {
        const result = buildOpenSearchQuery('   ', null, DATA_FIELDS);
        expect(result).toBeNull();
    });

    it('builds a query_string query when Boolean operators are present', () => {
        const result = buildOpenSearchQuery('cats AND dogs', null, DATA_FIELDS);
        expect(result).not.toBeNull();
        expect(result.query.query_string).toBeDefined();
        expect(result.query.query_string.query).toBe('cats AND dogs');
        expect(result.query.query_string.default_operator).toBe('AND');
    });

    it('query_string fields matches the provided dataField array', () => {
        const result = buildOpenSearchQuery('cats AND dogs', null, DATA_FIELDS);
        expect(result.query.query_string.fields).toEqual(DATA_FIELDS);
    });

    it('builds a bool/should query for simple term searches', () => {
        const result = buildOpenSearchQuery('cats', null, DATA_FIELDS);
        expect(result).not.toBeNull();
        expect(result.query.bool).toBeDefined();
        expect(result.query.bool.should).toBeDefined();
    });

    it('includes a boosted match clause for simple searches', () => {
        const result = buildOpenSearchQuery('cats', null, DATA_FIELDS);
        const should = result.query.bool.should;
        const boostedMatch = should.find(
            (c) => c.match?.ic_all?.boost !== undefined
        );
        expect(boostedMatch).toBeDefined();
        expect(boostedMatch.match.ic_all.boost).toBe(3);
    });

    it('includes a multi_match phrase clause for simple searches', () => {
        const result = buildOpenSearchQuery('cats', null, DATA_FIELDS);
        const should = result.query.bool.should;
        const phraseMatch = should.find(
            (c) => c.multi_match?.type === 'phrase'
        );
        expect(phraseMatch).toBeDefined();
    });

    it('detects OR operator and uses query_string', () => {
        const result = buildOpenSearchQuery('cats OR dogs', null, DATA_FIELDS);
        expect(result.query.query_string).toBeDefined();
    });

    it('detects NOT operator and uses query_string', () => {
        const result = buildOpenSearchQuery('cats NOT dogs', null, DATA_FIELDS);
        expect(result.query.query_string).toBeDefined();
    });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('buildOpenSearchQuery — edge cases', () => {
    it('prefers DSL over fallback even when the value has Boolean operators', () => {
        const dsl = { query: { bool: { must: [] } } };
        const result = buildOpenSearchQuery('cats AND dogs', dsl, DATA_FIELDS);
        // Should use DSL, not query_string
        expect(result.query.query_string).toBeUndefined();
        expect(result).toEqual(dsl);
    });

    it('treats an empty-object DSL as falsy and falls back to manual construction', () => {
        // An empty object {} is not a valid DSL — treat as "no DSL"
        const result = buildOpenSearchQuery('cats', {}, DATA_FIELDS);
        // {} has no keys → should fall back
        expect(result.query.bool).toBeDefined();
    });
});

