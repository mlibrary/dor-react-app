import { ReactiveBase } from '@appbaseio/reactivesearch';
import '@appbaseio/reactivesearch/lib/styles.css';

function App() {
    return (
   <ReactiveBase
     app="your-index-name"
     url="http://localhost:9200"
   >
     {/* Your components */}
   </ReactiveBase>
    );
}
