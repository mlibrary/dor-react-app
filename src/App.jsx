import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import FlightSearchApp from './apps/FlightSearchApp/index.jsx';
import RsFlightSearchApp from './apps/RsFlightSearchApp/index.jsx';
// import YetAnotherApp from './YetAnotherApp';

function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
                <Link to="/" style={{ marginRight: '20px' }}>Flight Search</Link>
                <Link to="/rs" style={{ marginRight: '20px' }}>RS Flight Search</Link>
                {/* <Link to="/app3">Yet Another App</Link> */}
            </nav>

            <Routes>
                <Route path="/" element={<FlightSearchApp />} />
                <Route path="/rs" element={<RsFlightSearchApp />} />
                {/* <Route path="/app3" element={<YetAnotherApp />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
