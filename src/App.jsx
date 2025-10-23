import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import FlightSearchApp from './apps/FlightSearchApp/index.jsx';
// Import other apps as needed
// import AnotherApp from './AnotherApp';
// import YetAnotherApp from './YetAnotherApp';

function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
                <Link to="/" style={{ marginRight: '20px' }}>Flight Search</Link>
                {/* Add more navigation links */}
                {/* <Link to="/app2" style={{ marginRight: '20px' }}>Another App</Link> */}
                {/* <Link to="/app3">Yet Another App</Link> */}
            </nav>

            <Routes>
                <Route path="/" element={<FlightSearchApp />} />
                {/* Add more routes */}
                {/* <Route path="/app2" element={<AnotherApp />} /> */}
                {/* <Route path="/app3" element={<YetAnotherApp />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
