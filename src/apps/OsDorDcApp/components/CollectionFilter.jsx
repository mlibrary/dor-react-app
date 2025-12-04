import React from 'react';
import { COLLECTION_OPTIONS } from '../utils/constants.js';

function CollectionFilter({ collectionFilter, onCollectionChange }) {
    const getButtonStyle = (filterValue) => ({
        padding: '10px 20px',
        fontSize: '14px',
        backgroundColor: collectionFilter === filterValue
            ? (filterValue === COLLECTION_OPTIONS.ALL ? '#2196F3'
                : filterValue === COLLECTION_OPTIONS.ON_TIME ? '#4CAF50'
                    : '#f44336')
            : '#e0e0e0',
        color: collectionFilter === filterValue ? 'white' : '#333',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: collectionFilter === filterValue ? 'bold' : 'normal'
    });

    return (
        <div style={{ marginBottom: '30px' }}>
            <label style={{ marginRight: '15px', fontWeight: 'bold' }}>Filter by Collection:</label>
            <div style={{ display: 'inline-flex', gap: '10px' }}>
                <button
                    onClick={() => onCollectionChange(COLLECTION_OPTIONS.ALL)}
                    style={getButtonStyle(COLLECTION_OPTIONS.ALL)}
                >
                    All Things
                </button>
                <button
                    onClick={() => onCollectionChange(COLLECTION_OPTIONS.ON_TIME)}
                    style={getButtonStyle(COLLECTION_OPTIONS.ON_TIME)}
                >
                    ✅ On Time
                </button>
                <button
                    onClick={() => onCollectionChange(COLLECTION_OPTIONS.CANCELLED)}
                    style={getButtonStyle(COLLECTION_OPTIONS.CANCELLED)}
                >
                    ❌ Cancelled
                </button>
            </div>
        </div>
    );
}

export default CollectionFilter;
