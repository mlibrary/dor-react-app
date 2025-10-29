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

function RsBhlApp() {
    return (
        <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
            <ReactiveBase
                app="bhl"
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
                                componentId="repositoryfilter"
                                dataField="repository.keyword"
                                // size={100}
                                // style={{
                                //     marginBottom: 20
                                // }}
                                title="Repository"
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="mirlynfilter"
                                dataField="bhl_mirlyn.keyword"
                                // size={100}
                                // style={{
                                //     marginBottom: 20
                                // }}
                                title="MIRLYN"
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="genrefilter"
                                dataField="genre.keyword"
                                // size={100}
                                // style={{
                                //     marginBottom: 20
                                // }}
                                title="Genre"
                            />
                        </Card>
                        {/*<Card>*/}
                        {/*    <RangeInput*/}
                        {/*        componentId="pricerange"*/}
                        {/*        dataField="products.price"*/}
                        {/*        title="Price"*/}
                        {/*        range={priceRange}*/}
                        {/*        setValue={1}*/}
                        {/*        react={{*/}
                        {/*            and: ['search', 'categoryfilter'],*/}
                        {/*        }}*/}
                        {/*        showHistogram={true}*/}
                        {/*    />*/}
                        {/*</Card>*/}
                    </Col>
                    <Col span={18}>
                        <SearchBox
                            // autosuggest={false}
                            componentId="search"
                            dataField={["title"]}
                            placeholder="Search Title"
                        />
                        <SelectedFilters />
                        <div id="result">
                            <ReactiveList
                                componentId="results"
                                dataField="title"
                                size={9}
                                pagination={true}
                                react={{
                                    and: ["search", "repositoryfilter", "mirlynfilter", "genrefilter"],
                                }}
                                render={({ data }) => (
                                    <ReactiveList.ResultCardsWrapper>
                                        {data.map((item) => (
                                            <ResultCard key={item._id}>
                                                <ResultCard.Title
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.title
                                                    }}
                                                />
                                                <ResultCard.Description>
                                                    <div>
                                                        {/*<div>{item.subjects}</div>*/}
                                                        {/*<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description || '') }} />*/}
                                                        {/*<br/>*/}
                                                        <div>{item.repository}</div>
                                                        {/*<div>Collection: {item.collection_title}</div>*/}
                                                        <div>ID: {item.id}</div>
                                                        <div>EAD: {item.finding_aid}</div>
                                                    </div>
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

export default RsBhlApp;
