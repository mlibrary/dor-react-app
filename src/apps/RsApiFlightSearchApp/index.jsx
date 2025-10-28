import React, { useState, useEffect } from 'react';
// https://ant.design/docs/react/v5-for-19
// import '@ant-design/v5-patch-for-react-19';
import { Row, Col, Card, Button, Input, Select, Pagination } from 'antd';
import createDOMPurify from 'dompurify';

const { Search } = Input;
const { Option } = Select;
const DOMPurify = createDOMPurify(window);

function RsApiFlightSearchApp() {
    const [flights, setFlights] = useState([]);
    const [origins, setOrigins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const pageSize = 10;

    // Fetch initial data and origins list
    useEffect(() => {
        fetchFlights();
        fetchOrigins();
    }, []);

    // Fetch origins for the filter
    const fetchOrigins = async () => {
        try {
            const response = await fetch('http://localhost:8000/opensearch_dashboards_sample_data_flights/_reactivesearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('rs-admin-user:rs-password')
                },
                body: JSON.stringify({
                    query: [{
                        id: 'origin-filter',
                        type: 'term',
                        dataField: 'Origin',
                        size: 0,
                        aggregationSize: 100,
                        execute: true
                    }]
                })
            });

            const data = await response.json();
            if (data['origin-filter']?.aggregations?.Origin?.buckets) {
                setOrigins(data['origin-filter'].aggregations.Origin.buckets);
            }
        } catch (err) {
            console.error('Error fetching origins:', err);
        }
    };

    const fetchFlights = async (search = searchValue, origin = selectedOrigin, page = currentPage) => {
        setLoading(true);
        console.log('Searching for:', search);

        try {
            const queries = [];

            // Main search query
            const searchQuery = {
                id: 'search-results',
                type: 'search',
                dataField: ['Dest', 'Origin', 'Carrier', 'DestCityName', 'OriginCityName'],
                size: pageSize,
                from: (page - 1) * pageSize,
                includeFields: ['*'],
                execute: true
            };

            // If there's a search value, add the custom query OBJECT (not function)
            if (search && search.trim() !== '') {
                searchQuery.value = search;
                searchQuery.defaultQuery = {
                    query: {
                        bool: {
                            should: [
                                { wildcard: { 'Dest': { value: `*${search}*`, case_insensitive: true } } },
                                { wildcard: { 'Origin': { value: `*${search}*`, case_insensitive: true } } },
                                { wildcard: { 'Carrier': { value: `*${search}*`, case_insensitive: true } } },
                                { wildcard: { 'DestCityName': { value: `*${search}*`, case_insensitive: true } } },
                                { wildcard: { 'OriginCityName': { value: `*${search}*`, case_insensitive: true } } }
                            ],
                            minimum_should_match: 1
                        }
                    }
                };
            }

            // Add react property if origin is selected
            if (origin) {
                searchQuery.react = {
                    and: ['origin-filter']
                };

                queries.push({
                    id: 'origin-filter',
                    type: 'term',
                    dataField: 'Origin',
                    value: origin,
                    execute: false
                });
            }

            queries.push(searchQuery);

            console.log('Sending request:', JSON.stringify({ query: queries }, null, 2));

            const response = await fetch('http://localhost:8000/opensearch_dashboards_sample_data_flights/_reactivesearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('rs-admin-user:rs-password')
                },
                body: JSON.stringify({
                    query: queries,
                    settings: {
                        recordAnalytics: false,
                        backend: 'opensearch'
                    }
                })
            });

            const data = await response.json();
            console.log('Response:', data);

            if (data['search-results']?.hits?.hits) {
                setFlights(data['search-results'].hits.hits);
                setTotalResults(data['search-results'].hits.total.value);
            } else if (data['search-results']?.error) {
                console.error('Search error:', data['search-results'].error);
                setFlights([]);
                setTotalResults(0);
            } else {
                setFlights([]);
                setTotalResults(0);
            }
        } catch (err) {
            console.error('Error fetching flights:', err);
            setFlights([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
        fetchFlights(value, selectedOrigin, 1);
    };

    const handleOriginChange = (value) => {
        setSelectedOrigin(value);
        setCurrentPage(1);
        fetchFlights(searchValue, value, 1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchFlights(searchValue, selectedOrigin, page);
    };

    const handleClearOrigin = () => {
        setSelectedOrigin(null);
        setCurrentPage(1);
        fetchFlights(searchValue, null, 1);
    };

    const renderFlightCard = (flight) => {
        const source = flight._source;
        return (
            <Card 
                key={flight._id} 
                style={{ marginBottom: '16px' }}
                hoverable
            >
                <Row gutter={16}>
                    <Col span={4}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                {source.Carrier}
                            </div>
                            <div style={{ fontSize: '12px', color: '#888' }}>
                                Carrier
                            </div>
                        </div>
                    </Col>
                    <Col span={16}>
                        <div style={{ marginBottom: '8px' }}>
                            <strong>{source.Origin}</strong> ({source.OriginCityName}) 
                            {' → '}
                            <strong>{source.Dest}</strong> ({source.DestCityName})
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            Flight: {source.FlightNum} | 
                            Distance: {Math.round(source.DistanceMiles)} mi | 
                            Price: ${Math.round(source.AvgTicketPrice)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                            {source.Cancelled ? (
                                <span style={{ color: 'red' }}>❌ Cancelled</span>
                            ) : source.FlightDelay ? (
                                <span style={{ color: 'orange' }}>⚠️ Delayed ({source.FlightDelayMin} min)</span>
                            ) : (
                                <span style={{ color: 'green' }}>✅ On Time</span>
                            )}
                        </div>
                    </Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            {new Date(source.timestamp).toLocaleDateString()}
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
            <h1>ReactiveSearch API Flight Search 🛫</h1>
            
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={6}>
                    <Select
                        placeholder="Filter by Origin"
                        style={{ width: '100%' }}
                        size="large"
                        onChange={handleOriginChange}
                        value={selectedOrigin}
                        allowClear
                        onClear={handleClearOrigin}
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {origins.map(origin => (
                            <Option key={origin.key} value={origin.key}>
                                {origin.key} ({origin.doc_count})
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={18}>
                    <Search
                        name="search"
                        placeholder="Search by destination, origin, carrier, or city..."
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                    />
                </Col>
            </Row>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Loading flights...</p>
                </div>
            ) : (
                <>
                    <div style={{ marginBottom: '16px' }}>
                        <h2>
                            Found {totalResults} flights
                            {searchValue && ` for "${searchValue}"`}
                            {selectedOrigin && ` from ${selectedOrigin}`}
                        </h2>
                    </div>

                    {flights.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>No flights found. Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <>
                            {flights.map(renderFlightCard)}
                            
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <Pagination
                                    current={currentPage}
                                    total={totalResults}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showTotal={(total, range) => 
                                        `${range[0]}-${range[1]} of ${total} flights`
                                    }
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default RsApiFlightSearchApp;
