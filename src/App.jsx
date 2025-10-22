import React, { useState, useEffect } from "react";
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import FlightCard from './components/FlightCard';
import { searchFlights } from './services/openSearchService';
import { STATUS_OPTIONS } from './utils/constants';

function App() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState(STATUS_OPTIONS.ALL);
    const [error, setError] = useState(null);

    const fetchFlights = async (query, status) => {
        setLoading(true);
        setError(null);

        try {
            const results = await searchFlights(query, status);
            setFlights(results);
        } catch (err) {
            console.error('Error fetching flights:', err);
            setError('Failed to fetch flights. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights("", STATUS_OPTIONS.ALL);
    }, []);

    const handleSearch = () => {
        fetchFlights(searchQuery, statusFilter);
    };

    const handleClear = () => {
        setSearchQuery("");
        fetchFlights("", statusFilter);
    };

    const handleStatusChange = (newStatus) => {
        setStatusFilter(newStatus);
        fetchFlights(searchQuery, newStatus);
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
                    </h2>
                    {flights.length === 0 ? (
                        <p>No flights found. Try a different search term or filter.</p>
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

export default App;
