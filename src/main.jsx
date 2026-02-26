import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress defaultProps warning from @appbaseio/reactivesearch library
// This is a known issue with the library and React 18+
const originalConsoleError = console.error;
console.error = (...args) => {
    if (
        typeof args[0] === 'string' &&
        args[0].includes('Support for defaultProps will be removed')
    ) {
        return;
    }
    originalConsoleError.apply(console, args);
};

createRoot(document.getElementById('root')).render(
    <App/>
)
