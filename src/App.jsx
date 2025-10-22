import { ReactiveBase } from '@appbaseio/reactivesearch';
import '@appbaseio/reactivesearch/lib/styles.css';

function App() {
    return (
        <ReactiveBase
            app="dor-react-app"
            url="https://your-cluster-url"
            // or use credentials if needed
            credentials="username:password"
        >
            {/* Your search components go here */}
        </ReactiveBase>
    );
}
