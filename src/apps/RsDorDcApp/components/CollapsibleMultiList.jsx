import React, { useState } from 'react';
import { MultiList } from '@appbaseio/reactivesearch';

/**
 * CollapsibleMultiList wraps ReactiveSearch MultiList with two extra behaviours:
 *
 * 1. COLLAPSE: when one or more items are selected, only the selected items
 *    are shown (ReactiveSearch v4 silently strips self from react.and, so the
 *    built-in self-filter never fires — we replicate it in the render layer).
 *
 * 2. SCROLL WINDOW: when no items are selected, the list is shown inside a
 *    fixed-height scrollable container (default 10 rows visible). The optional
 *    search box filters the scrolled list client-side.
 */

// Approximate height per item: 3px top + 20px line + 3px bottom = 26px
const ITEM_HEIGHT_PX = 26;
const DEFAULT_VISIBLE_ROWS = 10;

function CollapsibleMultiList(props) {
    const { showSearch, placeholder = 'Search…', visibleRows = DEFAULT_VISIBLE_ROWS, ...multiListProps } = props;
    const [searchTerm, setSearchTerm] = useState('');

    const scrollHeight = visibleRows * ITEM_HEIGHT_PX;

    return (
        <MultiList
            {...multiListProps}
            showSearch={false}   // disable built-in — we render our own input below
            render={({ data, value, handleChange, loading }) => {
                if (loading) return <div style={{ padding: '8px', color: '#999' }}>Loading…</div>;
                if (!data || data.length === 0) return <div style={{ padding: '8px', color: '#999' }}>No options</div>;

                // Normalise: RS v4 may pass an Array, a plain object, or null
                const selected = Array.isArray(value) ? value
                    : (value && typeof value === 'object') ? Object.keys(value).filter(k => value[k])
                    : [];
                const hasSelection = selected.length > 0;

                // Collapsed: show only selected items (no scroll needed).
                // Expanded + searching: show all matching items in scroll window.
                // Expanded + no search: show all items in scroll window.
                const displayItems = hasSelection
                    ? data.filter(item => selected.includes(item.key))
                    : (searchTerm
                        ? data.filter(item => item.key.toLowerCase().includes(searchTerm.toLowerCase()))
                        : data);

                return (
                    <div>
                        {showSearch && !hasSelection && (
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder={placeholder}
                                style={{
                                    width: '100%',
                                    padding: '4px 8px',
                                    marginBottom: '8px',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        )}
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            maxHeight: hasSelection ? 'none' : `${scrollHeight}px`,
                            overflowY: hasSelection ? 'visible' : 'auto',
                        }}>
                            {displayItems.map(item => (
                                <li
                                    key={item.key}
                                    onClick={() => handleChange(item.key)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        padding: '3px 0',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(item.key)}
                                        onChange={() => {}}
                                        style={{ marginRight: 8, flexShrink: 0 }}
                                    />
                                    <span style={{ flex: 1, wordBreak: 'break-word' }}>{item.key}</span>
                                    <span style={{ marginLeft: 6, color: '#999', fontSize: '0.85em', flexShrink: 0 }}>
                                        {item.doc_count.toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            }}
        />
    );
}

export default CollapsibleMultiList;
