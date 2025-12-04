import React, { useState, useEffect } from "react";
import SearchBar from './components/SearchBar.jsx';
import CollectionFilter from './components/CollectionFilter.jsx';
import PriceRangeFilter from './components/PriceRangeFilter.jsx';
// import FlightCard from './components/FlightCard.jsx';
import { searchThings } from './services/openSearchService.js';
import { COLLECTION_OPTIONS, PRICE_RANGE } from './utils/constants.js';

function OsDorDcApp() {
    const [things, setThings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [collectionFilter, setCollectionFilter] = useState(COLLECTION_OPTIONS.ALL);
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

    const fetchThings = async (query, collection, priceRange) => {
        setLoading(true);
        setError(null);

        try {
            // Normalise empty query to null so that the backend treats it as “no filter”
            const trimmedQuery = query.trim();
            const effectiveQuery = trimmedQuery ? trimmedQuery : null;
            // Encode the query to safely pass to the backend
            const encodedQuery = encodeURIComponent(effectiveQuery ?? "");

            console.log("Searching things:", { query: trimmedQuery, collection, priceRange, encodedQuery });

            const results = await searchThings(encodedQuery, collection, priceRange);
            console.log("Received things:", results);
            setThings(results);
        } catch (err) {
            console.error('Error fetching things:', err);
            setError('Failed to fetch things. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (actualMaxPrice > 0) {
            fetchThings("", COLLECTION_OPTIONS.ALL, { min: actualMinPrice, max: actualMaxPrice });
        }
    }, [actualMaxPrice]); // Fetch things once we have price stats

    const handleSearch = () => {
        fetchThings(searchQuery, collectionFilter, { min: minPrice, max: maxPrice });
    };

    const handleClear = () => {
        setSearchQuery("");
        fetchThings("", collectionFilter, { min: minPrice, max: maxPrice });
    };

    const handleCollectionChange = (newCollection) => {
        setCollectionFilter(newCollection);
        fetchThings(searchQuery, newCollection, { min: minPrice, max: maxPrice });
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
        fetchThings(searchQuery, collectionFilter, { min: newMin, max: newMax });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>OS DOR DC APP Demo</h1>

            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                onClear={handleClear}
            />

            <CollectionFilter
                collectionFilter={collectionFilter}
                onCollectionChange={handleCollectionChange}
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
                <p>Loading things...</p>
            ) : (
                <>
                    <h2>
                        {searchQuery
                            ? `Search Results for "${searchQuery}" (${things.length} things)`
                            : `All Things (${things.length} things)`}
                        {/*{collectionFilter !== COLLECTION_OPTIONS.ALL &&*/}
                        {/*    ` - ${collectionFilter === COLLECTION_OPTIONS.CANCELLED ? "Cancelled" : "On Time"}`}*/}
                        {/*{(minPrice > actualMinPrice || maxPrice < actualMaxPrice) &&*/}
                        {/*    ` - Price: $${minPrice}-$${maxPrice}`}*/}
                    </h2>
                    {things.length === 0 ? (
                        <p>No things found. Try adjusting your filters.</p>
                    ) : (
                        <div>
                            {things.map((thing) => (
                                <div>{thing._id}</div>
                                // <FlightCard key={thing._id} thing={thing} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default OsDorDcApp;
