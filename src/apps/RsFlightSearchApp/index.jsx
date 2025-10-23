// import styles from './RsFlightSearchApp.module.css'
//
// function RsFlightSearchApp() {
//     // ... existing code ...
//
//     return (
//         <div className={styles.container}>
//             <h1 className={styles.title}>RS Flight Search Demo ✈️</h1>
//             {/* Use styles.className throughout your component */}
//         </div>
//     );
// }
//
// export default RsFlightSearchApp;
//

import React from 'react';
// import { createRoot } from 'react-dom/client';


// import * as ReactiveSearch from '@appbaseio/reactivesearch';
// console.log(Object.keys(ReactiveSearch));
import {
    ReactiveBase,
    SearchBox,
    MultiList,
    SelectedFilters,
    ReactiveList
} from '@appbaseio/reactivesearch';

import {
    Row,
    Button,
    Col,
    Card,
} from 'antd';
// import 'antd/dist/reset.css';


import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window);

function getNestedValue(obj, path) {
    const keys = path.split('.');
    const currentObject = obj;
    const nestedValue = keys.reduce((value, key) => {
        if (value) {
            return value[key];
        }
        return '';
    }, currentObject);
    if (typeof nestedValue === 'object') {
        return JSON.stringify(nestedValue);
    }
    return nestedValue;
}

function renderItem(res, triggerClickAnalytics) {
    let { image, url, description, title } = {"title":"Dest","description":"Origin","image":"Carrier","url":"","showRest":false};
    image = getNestedValue(res,image);
    title = getNestedValue(res,title);
    url = getNestedValue(res,url);
    description = getNestedValue(res,description)
    return (
        <Row onClick={triggerClickAnalytics} type="flex" gutter={16} key={res._id} style={{margin:'20px auto',borderBottom:'1px solid #ededed'}}>
            <Col span={image ? 6 : 0}>
                {image &&  <img src={image} alt={title} /> }
            </Col>
            <Col span={image ? 18 : 24}>
                <h3 style={{ fontWeight: '600' }} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(title || 'Choose a valid Title Field') }}/>
                <p style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(description || 'Choose a valid Description Field')}}/>
            </Col>
            <div style={{padding:'20px'}}>
                {url ? <Button shape="circle" icon="link" style={{ marginRight: '5px' }} onClick={() => window.open(url, '_blank')} />
                    : null}
            </div>
        </Row>
    );
};

function RsFlightSearchApp() {
    return (
    <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
        <ReactiveBase
            app="opensearch_dashboards_sample_data_flights"
            credentials="rs-admin-user:rs-password"
            url="http://localhost:8000"
            analytics={false}
            searchStateHeader
        >
            <Row gutter={16} style={{ padding: 20 }}>
                <Col span={6}>
                    <Card>
                        <MultiList
                            componentId="list-1"
                            dataField="Origin"
                            size={100}
                            style={{
                                marginBottom: 20
                            }}
                            title="Origin"
                        />
                    </Card>
                </Col>
                <Col span={18}>
                    <SearchBox
                        componentId="search"
                        dataField={[
                            'Carrier',
                            'Dest'
                        ]}
                        fieldWeights={[
                            1,
                            1
                        ]}
                        fuzziness={0}
                        highlight={true}
                        highlightField={[
                            'Carrier',
                            'Dest'
                        ]}
                        placeholder="Search Carrier or Destination"
                        title="Search"
                        style={{
                            marginBottom: 20
                        }}
                    />

                    <SelectedFilters />
                    <div id="result">
                        <ReactiveList
                            componentId="result"
                            dataField="_score"
                            pagination={true}
                            // react={{
                            //     and: [
                            //         'search',
                            renderItem={renderItem}
                            size={5}
                            style={{
                                marginTop: 20
                            }}
                            renderNoResults={() => (
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    No flights found. Try adjusting your filters.
                                </div>
                            )}
                        />
                    </div>
                </Col>

            </Row>
        </ReactiveBase>
    </div>
    );
}

export default RsFlightSearchApp;
