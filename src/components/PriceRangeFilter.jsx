import React from 'react';
import { PRICE_RANGE } from '../utils/constants';

function PriceRangeFilter({ minPrice, maxPrice, actualMinPrice, actualMaxPrice, onPriceChange }) {
    const rangeMin = actualMinPrice || PRICE_RANGE.MIN;
    const rangeMax = actualMaxPrice || PRICE_RANGE.MAX;

    return (
        <div style={{ marginBottom: '30px' }}>
            <label style={{ marginRight: '15px', fontWeight: 'bold' }}>
                Filter by Price: ${minPrice} - ${maxPrice}
            </label>
            <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                marginTop: '10px'
            }}>
                <div style={{ flex: 1 }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontSize: '14px'
                    }}>
                        Min Price: ${minPrice}
                    </label>
                    <input
                        type="range"
                        min={rangeMin}
                        max={rangeMax}
                        step={PRICE_RANGE.STEP}
                        value={minPrice}
                        onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontSize: '14px'
                    }}>
                        Max Price: ${maxPrice}
                    </label>
                    <input
                        type="range"
                        min={rangeMin}
                        max={rangeMax}
                        step={PRICE_RANGE.STEP}
                        value={maxPrice}
                        onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>
                <button
                    onClick={() => onPriceChange(rangeMin, rangeMax)}
                    style={{
                        padding: '8px 15px',
                        fontSize: '14px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

export default PriceRangeFilter;
