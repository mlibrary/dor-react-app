import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import FlightSearchApp from './apps/FlightSearchApp/index.jsx';
import RsFlightSearchApp from './apps/RsFlightSearchApp/index.jsx';
import RsApiFlightSearchApp from './apps/RsApiFlightSearchApp/index.jsx';
import RsBhlApp from './apps/RsBhlApp/index.jsx';
import RsDorDcApp from './apps/RsDorDcApp/index.jsx';
import OsDorDcApp from './apps/OsDorDcApp/index.jsx';

function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
                <Link to="/" style={{ marginRight: '20px' }}>RS-DOR-DC</Link>
                <Link to="/os" style={{marginRight: '20px' }}>OS-DOR-DC</Link>
                <Link to="/flight" style={{ marginRight: '20px' }}>Open Search API</Link>
                <Link to="/rs-api" style={{ marginRight: '20px' }}>Reactive Search API</Link>
                <Link to="/rs" style={{ marginRight: '20px' }}>Reactive Search Components</Link>
                <Link to="/bhl" style={{ marginRight: '20px' }}>RS-BHL</Link>
            </nav>

            <Routes>
                <Route path="/" element={<RsDorDcApp />} />
                <Route path="/os" element={<OsDorDcApp />} />
                <Route path="/flight" element={<FlightSearchApp />} />
                <Route path="/rs-api" element={<RsApiFlightSearchApp />} />
                <Route path="/rs" element={<RsFlightSearchApp />} />
                <Route path="/bhl" element={<RsBhlApp />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
