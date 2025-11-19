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

function RsDorDcApp() {
    return (
        <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
            <ReactiveBase
                app="dor-dc"
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
                                componentId="filter"
                                dataField="dc_cov.keyword"
                                // size={100}
                                // style={{
                                //     marginBottom: 20
                                // }}
                                title="Filter"
                            />                        </Card>
                        <Card>
                            <MultiList
                                componentId="dc_cov_filter"
                                dataField="dc_cov.keyword"
                                // size={100}
                                // style={{
                                //     marginBottom: 20
                                // }}
                                title="dc_cov"
                            />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <SearchBox
                            // autosuggest={false}
                            componentId="search"
                            dataField={["all"]}
                            placeholder="Search All"
                        />
                        <SelectedFilters />
                        <div id="result">
                            <ReactiveList
                                componentId="results"
                                dataField="all"
                                size={9}
                                pagination={true}
                                react={{
                                    and: ["search", "dc_cov_filter"],
                                }}
                                render={({ data }) => (
                                    <ReactiveList.ResultCardsWrapper>
                                        {data.map((item) => (
                                            <ResultCard key={item._id}>
                                                <ResultCard.Title
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.collection_name
                                                    }}
                                                />
                                                <ResultCard.Description>
                                                    <div>
                                                        {/*<div>{item.subjects}</div>*/}
                                                        {/*<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description || '') }} />*/}
                                                        {/*<br/>*/}
                                                        <div>{item.xxdc_de}</div>
                                                        {/*<div>Collection: {item.collection_title}</div>*/}
                                                        {/*<div>ID: {item.id}</div>*/}
                                                        {/*<div>EAD: {item.finding_aid}</div>*/}
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

export default RsDorDcApp;
