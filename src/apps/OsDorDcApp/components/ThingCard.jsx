import React from 'react';

function ThingCard({ thing }) {
    return (
        <div style={{
            marginBottom: '15px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: '#fafafa'
        }}>
            <h3>{thing._source.ThingNum} - {thing._source.Carrier}</h3>
            <p><strong>From:</strong> {thing._source.OriginCityName} ({thing._source.OriginCountry})</p>
            <p><strong>To:</strong> {thing._source.DestCityName} ({thing._source.DestCountry})</p>
            <p><strong>Price:</strong> ${thing._source.AvgTicketPrice.toFixed(2)}</p>
            <p><strong>Distance:</strong> {thing._source.DistanceKilometers.toFixed(0)} km</p>
            <p><strong>Collection:</strong> {thing._source.Cancelled ? '❌ Cancelled' : '✅ On Time'}</p>
        </div>
    );
}

export default ThingCard;
