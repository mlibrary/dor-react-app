import React from 'react';
import { STATUS_OPTIONS } from '../utils/constants';

function StatusFilter({ statusFilter, onStatusChange }) {
    const getButtonStyle = (filterValue) => ({
        padding: '10px 20px',
        fontSize: '14px',
        backgroundColor: statusFilter === filterValue
            ? (filterValue === STATUS_OPTIONS.ALL ? '#2196F3'
                : filterValue === STATUS_OPTIONS.ON_TIME ? '#4CAF50'
                    : '#f44336')
            : '#e0e0e0',
        color: statusFilter === filterValue ? 'white' : '#333',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: statusFilter === filterValue ? 'bold' : 'normal'
    });

    return (
        <div style={{ marginBottom: '30px' }}>
            <label style={{ marginRight: '15px', fontWeight: 'bold' }}>Filter by Status:</label>
            <div style={{ display: 'inline-flex', gap: '10px' }}>
                <button
                    onClick={() => onStatusChange(STATUS_OPTIONS.ALL)}
                    style={getButtonStyle(STATUS_OPTIONS.ALL)}
                >
                    All Flights
                </button>
                <button
                    onClick={() => onStatusChange(STATUS_OPTIONS.ON_TIME)}
                    style={getButtonStyle(STATUS_OPTIONS.ON_TIME)}
                >
                    ✅ On Time
                </button>
                <button
                    onClick={() => onStatusChange(STATUS_OPTIONS.CANCELLED)}
                    style={getButtonStyle(STATUS_OPTIONS.CANCELLED)}
                >
                    ❌ Cancelled
                </button>
            </div>
        </div>
    );
}

export default StatusFilter;
