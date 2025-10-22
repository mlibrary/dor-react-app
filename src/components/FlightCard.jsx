import React from 'react';

function FlightCard({ flight }) {
    return (
        <div style={{
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
    );
}

export default FlightCard;
