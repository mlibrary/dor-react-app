import React, { useState, useEffect } from "react";

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFlights = (query) => {
    setLoading(true);
    
    // Build the OpenSearch query
    const searchBody = query.trim() === "" 
      ? { size: 10, query: { match_all: {} } }
      : {
          size: 10,
          query: {
            multi_match: {
              query: query,
              fields: [
                "OriginCityName",
                "DestCityName",
                "Carrier",
                "FlightNum",
                "OriginCountry",
                "DestCountry"
              ]
            }
          }
        };

    fetch('http://localhost:9200/opensearch_dashboards_sample_data_flights/_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody)
    })
    .then(res => res.json())
    .then(data => {
      setFlights(data.hits.hits);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching flights:', err);
      setLoading(false);
    });
  };

  useEffect(() => {
    // Initial load
    fetchFlights("");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFlights(searchQuery);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Flight Search Demo ✈️</h1>
      
      {/* Search Box */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
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
              onClick={() => {
                setSearchQuery("");
                fetchFlights("");
              }}
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

      {/* Results */}
      {loading ? (
        <p>Loading flights...</p>
      ) : (
        <>
          <h2>
            {searchQuery 
              ? `Search Results for "${searchQuery}" (${flights.length} flights)` 
              : `All Flights (${flights.length} flights)`}
          </h2>
          {flights.length === 0 ? (
            <p>No flights found. Try a different search term.</p>
          ) : (
            <div>
              {flights.map((flight) => (
                <div key={flight._id} style={{ 
                  marginBottom: '15px', 
                  padding: '15px', 
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#fafafa'
                }}>
                  <h3>{flight._source.FlightNum} - {flight._source.Carrier}</h3>
                  <p><strong>From:</strong> {flight._source.OriginCityName} ({flight._source.OriginCountry})</p>
                  <p><strong>To:</strong> {flight._source.DestCityName} ({flight._source.DestCountry})</p>
                  <p><strong>Price:</strong> ${flight._source.AvgTicketPrice.toFixed(2)}</p>
                  <p><strong>Distance:</strong> {flight._source.DistanceKilometers.toFixed(0)} km</p>
                  <p><strong>Status:</strong> {flight._source.Cancelled ? '❌ Cancelled' : '✅ On Time'}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
