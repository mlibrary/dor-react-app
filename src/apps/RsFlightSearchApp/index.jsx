import React from 'react';
// import { createRoot } from 'react-dom/client';


// import * as ReactiveSearch from '@appbaseio/reactivesearch';
// console.log(Object.keys(ReactiveSearch));
import {
    ReactiveBase,
    SearchBox,
    MultiList,
    SelectedFilters,
    ReactiveList,
    ResultCard,
    MultiRange,
    RangeInput,
    RangeSlider,
    DynamicRangeSlider,
} from '@appbaseio/reactivesearch';

// https://ant.design/docs/react/v5-for-19
// import '@ant-design/v5-patch-for-react-19';
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
    let { first, last } = {"title":"customer_first_name","description":"customer_last_name","showRest":false};
    first = getNestedValue(res,first);
    last = getNestedValue(res,last);
    return (
        <Row onClick={triggerClickAnalytics} type="flex" gutter={16} key={res._id} style={{margin:'20px auto',borderBottom:'1px solid #ededed'}}>
            <Col span={24}>
                <h3 style={{ fontWeight: '600' }} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(first || 'Choose a valid First Field') }}/>
                <p style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(last || 'Choose a valid Last Field')}}/>
            </Col>
        </Row>
    );
};

function RsFlightSearchApp() {
    return (
    <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
        <ReactiveBase
            // app="opensearch_dashboards_sample_data_flights"
            app="opensearch_dashboards_sample_data_ecommerce"
            credentials="rs-admin-user:rs-password"
            url="http://localhost:8000"
            reactivesearchAPIConfig={{
                recordAnalytics: false,
                suggestionAnalytics: false,
                enableQueryRules: false,
            }}
        >
            <Row gutter={16} style={{ padding: 20 }}>
                <Col span={6}>
                    <Card>
                        <MultiList
                            componentId="categoryfilter"
                            dataField="products.category.keyword"
                            // size={100}
                            // style={{
                            //     marginBottom: 20
                            // }}
                            title="Products"
                        />
                    </Card>
                    {/*<Card>*/}
                    {/*    <DynamicRangeSlider*/}
                    {/*        componentId="products.base_price"*/}
                    {/*        dataField="products.price"*/}
                    {/*    />*/}
                    {/*</Card>*/}
                    {/*<Card>*/}
                    {/*    <RangeInput*/}
                    {/*        componentId="pricerange"*/}
                    {/*        // dataField="products.quantity"*/}
                    {/*        dataField="day_of_week_i"*/}
                    {/*        title="Price"*/}
                    {/*        range={{*/}
                    {/*            start: 1,*/}
                    {/*            end: 7,*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</Card>*/}
                </Col>
                <Col span={18}>
                    <SearchBox
                        // autosuggest={false}
                        componentId="search"
                        dataField={["customer_full_name"]}
                        placeholder="Search Destination"
                    />
                    {/*<SelectedFilters />*/}
                    <div id="result">
                        <ReactiveList
                            componentId="results"
                            dataField="_score"
                            size={6}
                            pagination={true}
                            react={{
                                and: ["search", "categoryfilter"],
                            }}
                            render={({ data }) => (
                                <ReactiveList.ResultCardsWrapper>
                                    {data.map((item) => (
                                        <ResultCard key={item._id}>
                                            <ResultCard.Title
                                                dangerouslySetInnerHTML={{
                                                    __html: item.customer_full_name
                                                }}
                                            />
                                            <ResultCard.Description>
                                                {item.category}
                                            </ResultCard.Description>
                                        </ResultCard>
                                    ))}
                                </ReactiveList.ResultCardsWrapper>
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
