import React from 'react';
import { useEffect, useState } from 'react';
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

import {
    Row,
    Button,
    Col,
    Card,
} from 'antd';

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
    const [priceRange, setPriceRange] = useState({ start: 0, end: 1100 });

    useEffect(() => {
        // Query OpenSearch for min/max of products.price
        const fetchRange = async () => {
            try {
                const resp = await fetch('http://localhost:8000/opensearch_dashboards_sample_data_ecommerce/_search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic cnMtYWRtaW4tdXNlcjpycy1wYXNzd29yZA=='
                    },
                    body: JSON.stringify({
                        size: 0,
                        aggs: {
                            minPrice: { min: { field: 'products.price' } },
                            maxPrice: { max: { field: 'products.price' } }
                        }
                    })
                });
                const data = await resp.json();
                const min = data.aggregations.minPrice.value || 0;
                const max = data.aggregations.maxPrice.value || 1100;
                setPriceRange({ start: min, end: max });
            } catch (e) {
                console.error('Failed to fetch price range', e);
            }
        };
        fetchRange();
    }, []); // run once on mount

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
                        <Card>
                            <RangeInput
                                componentId="pricerange"
                                dataField="products.price"
                                title="Price"
                                range={priceRange}
                                setValue={1}
                                react={{
                                    and: ['search', 'categoryfilter'],
                                }}
                                showHistogram={true}
                            />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <SearchBox
                            // autosuggest={false}
                            componentId="search"
                            dataField={["customer_full_name"]}
                            placeholder="Search Destination"
                        />
                        <SelectedFilters />
                        <div id="result">
                            <ReactiveList
                                componentId="results"
                                dataField="_score"
                                size={6}
                                pagination={true}
                                react={{
                                    and: ["search", "categoryfilter", "pricerange"],
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
