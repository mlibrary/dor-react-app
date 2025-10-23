import React from 'react';

function SearchBar({ searchQuery, setSearchQuery, onSearch, onClear }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by city, carrier, flight number..."
                    style={{
                        flex: 1,
                        padding: '12px 15px',
                        fontSize: '16px',
                        border: '2px solid #ddd',
                        borderRadius: '5px',
                        outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
                <button
                    type="submit"
                    style={{
                        padding: '12px 30px',
                        fontSize: '16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                >
                    Search
                </button>
                {searchQuery && (
                    <button
                        type="button"
                        onClick={onClear}
                        style={{
                            padding: '12px 20px',
                            fontSize: '16px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#da190b'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
                    >
                        Clear
                    </button>
                )}
            </div>
        </form>
    );
}

export default SearchBar;
