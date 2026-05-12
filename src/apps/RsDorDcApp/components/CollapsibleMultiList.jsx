import React from 'react';
import { MultiList } from '@appbaseio/reactivesearch';

/**
 * CollapsibleMultiList wraps ReactiveSearch MultiList with one extra behaviour:
 * when one or more items are selected, only the selected items are shown.
 * ReactiveSearch v4 silently ignores a component's own componentId in its
 * react prop (to prevent infinite loops), so self-collapsing via react.and
 * never actually fires.  This render-prop approach achieves the same result
 * purely on the client side — the full aggregation is still fetched, we just
 * hide unselected rows when the filter is active.
 */
function CollapsibleMultiList(props) {
    return (
        <MultiList
            {...props}
            render={({ data, value, handleChange, loading }) => {
                if (loading) return <div style={{ padding: '8px', color: '#999' }}>Loading…</div>;
                if (!data || data.length === 0) return <div style={{ padding: '8px', color: '#999' }}>No options</div>;

                const selected = value || [];
                const displayItems = selected.length > 0
                    ? data.filter(item => selected.includes(item.key))
                    : data;

                return (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {displayItems.map(item => (
                            <li
                                key={item.key}
                                onClick={() => handleChange(item.key)}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '3px 0' }}
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
                );
            }}
        />
    );
}

export default CollapsibleMultiList;

