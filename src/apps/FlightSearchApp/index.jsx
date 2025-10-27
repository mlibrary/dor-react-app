import React, { useState, useEffect } from "react";
import SearchBar from './components/SearchBar.jsx';
import StatusFilter from './components/StatusFilter.jsx';
import PriceRangeFilter from './components/PriceRangeFilter.jsx';
import FlightCard from './components/FlightCard.jsx';
import { searchFlights, getPriceStats } from './services/openSearchService.js';
import { STATUS_OPTIONS, PRICE_RANGE } from './utils/constants.js';

function FlightSearchApp() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState(STATUS_OPTIONS.ALL);
    const [minPrice, setMinPrice] = useState(PRICE_RANGE.DEFAULT_MIN);
    const [maxPrice, setMaxPrice] = useState(PRICE_RANGE.DEFAULT_MAX);
    const [actualMinPrice, setActualMinPrice] = useState(PRICE_RANGE.DEFAULT_MIN);
    const [actualMaxPrice, setActualMaxPrice] = useState(PRICE_RANGE.DEFAULT_MAX);
    const [error, setError] = useState(null);

    // Fetch price stats on component mount
    useEffect(() => {
        const fetchPriceStats = async () => {
            try {
                const stats = await getPriceStats();
                setActualMinPrice(stats.min);
                setActualMaxPrice(stats.max);
                setMinPrice(stats.min);
                setMaxPrice(stats.max);
            } catch (err) {
                console.error('Error fetching price stats:', err);
                // Fallback to defaults from constants
            }
        };

        fetchPriceStats();
    }, []);

    const fetchFlights = async (query, status, priceRange) => {
        setLoading(true);
        setError(null);

        try {
            // Normalise empty query to null so that the backend treats it as “no filter”
            const trimmedQuery = query.trim();
            const effectiveQuery = trimmedQuery ? trimmedQuery : null;
            // Encode the query to safely pass to the backend
            const encodedQuery = encodeURIComponent(effectiveQuery ?? "");

            console.log("Searching flights:", { query: trimmedQuery, status, priceRange, encodedQuery });

            const results = await searchFlights(encodedQuery, status, priceRange);
            console.log("Received flights:", results);
            setFlights(results);
        } catch (err) {
            console.error('Error fetching flights:', err);
            setError('Failed to fetch flights. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (actualMaxPrice > 0) {
            fetchFlights("", STATUS_OPTIONS.ALL, { min: actualMinPrice, max: actualMaxPrice });
        }
    }, [actualMaxPrice]); // Fetch flights once we have price stats

    const handleSearch = () => {
        fetchFlights(searchQuery, statusFilter, { min: minPrice, max: maxPrice });
    };

    const handleClear = () => {
        setSearchQuery("");
        fetchFlights("", statusFilter, { min: minPrice, max: maxPrice });
    };

    const handleStatusChange = (newStatus) => {
        setStatusFilter(newStatus);
        fetchFlights(searchQuery, newStatus, { min: minPrice, max: maxPrice });
    };

    const handlePriceChange = (newMin, newMax) => {
        // Ensure min doesn't exceed max
        if (newMin > newMax) {
            newMin = newMax;
        }
        if (newMax < newMin) {
            newMax = newMin;
        }

        setMinPrice(newMin);
        setMaxPrice(newMax);
        fetchFlights(searchQuery, statusFilter, { min: newMin, max: newMax });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Flight Search Demo ✈️</h1>

            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                onClear={handleClear}
            />

            <StatusFilter
                statusFilter={statusFilter}
                onStatusChange={handleStatusChange}
            />

            <PriceRangeFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                actualMinPrice={actualMinPrice}
                actualMaxPrice={actualMaxPrice}
                onPriceChange={handlePriceChange}
            />

            {error && (
                <div style={{
                    padding: '15px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            {loading ? (
                <p>Loading flights...</p>
            ) : (
                <>
                    <h2>
                        {searchQuery
                            ? `Search Results for "${searchQuery}" (${flights.length} flights)`
                            : `All Flights (${flights.length} flights)`}
                        {statusFilter !== STATUS_OPTIONS.ALL &&
                            ` - ${statusFilter === STATUS_OPTIONS.CANCELLED ? "Cancelled" : "On Time"}`}
                        {(minPrice > actualMinPrice || maxPrice < actualMaxPrice) &&
                            ` - Price: $${minPrice}-$${maxPrice}`}
                    </h2>
                    {flights.length === 0 ? (
                        <p>No flights found. Try adjusting your filters.</p>
                    ) : (
                        <div>
                            {flights.map((flight) => (
                                <FlightCard key={flight._id} flight={flight} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default FlightSearchApp;
