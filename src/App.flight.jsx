import React, { useState, useEffect } from "react";
import { ReactiveBase } from '@appbaseio/reactivesearch';

function FlightList() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from OpenSearch via localhost (browser access)
        fetch('http://localhost:9200/opensearch_dashboards_sample_data_flights/_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                size: 10,
                query: { match_all: {} }
            })
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
    }, []);

    if (loading) return <p>Loading flights...</p>;

    return (
        <div>
            <h2>Flights from OpenSearch:</h2>
            {flights.map((flight) => (
                <div key={flight._id} style={{
                    marginBottom: '15px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
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
    );
}

function App() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Flight Search Demo ✈️</h1>
            <ReactiveBase
                app="opensearch_dashboards_sample_data_flights"
                url="http://localhost:9200"
                enableAppbase={false}
                credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
            >
                <FlightList />
            </ReactiveBase>
        </div>
    );
}

export default App;
