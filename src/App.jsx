import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import FlightSearchApp from './apps/FlightSearchApp/index.jsx';
import RsFlightSearchApp from './apps/RsFlightSearchApp/index.jsx';
import RsApiFlightSearchApp from './apps/RsApiFlightSearchApp/index.jsx';


function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
                <Link to="/" style={{ marginRight: '20px' }}>Flight Search</Link>
                <Link to="/rs" style={{ marginRight: '20px' }}>RS Flight Search</Link>
                <Link to="/rs-api" style={{ marginRight: '20px' }}>RS API Flight Search</Link>
            </nav>

            <Routes>
                <Route path="/" element={<FlightSearchApp />} />
                <Route path="/rs" element={<RsFlightSearchApp />} />
                <Route path="/rs-api" element={<RsApiFlightSearchApp />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
