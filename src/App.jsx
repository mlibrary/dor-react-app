import React from "react";
// import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import RsDorDcApp from './apps/RsDorDcApp/index.jsx';
// import OsDorDcApp from './apps/OsDorDcApp/index.jsx';

function App() {
    return <RsDorDcApp />;

    // return (
    //     <BrowserRouter>
    //         <nav style={{padding: '20px', backgroundColor: '#f0f0f0'}}>
    //             <Link to="/" style={{marginRight: '20px'}}>RS-DOR-DC</Link>
    //             <Link to="/os" style={{marginRight: '20px'}}>OS-DOR-DC</Link>
    //         </nav>
    //
    //         <Routes>
    //             <Route path="/" element={<RsDorDcApp/>}/>
    //             <Route path="/os" element={<OsDorDcApp/>}/>
    //         </Routes>
    //     </BrowserRouter>
    // );
}

export default App;
