import React from 'react';

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
    ResultList,
} from '@appbaseio/reactivesearch';

// console.log(Object.keys(ReactiveSearch));

import {
    Row,
    Button,
    Col,
    Card,
} from 'antd';

function RsDorDcApp() {
    return (
        <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
            <ReactiveBase
                app="dor-dc"
                credentials="rs-admin-user:rs-password"
                url="http://reactivesearch.discovery.dor.lib.umich.edu"
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
                                componentId="web_directory_filter"
                                dataField="web_directory.keyword"
                                title="web_directory"
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="collection_id_filter"
                                nestedField="collection_id"
                                dataField="collection_id.facet.keyword"
                                title="collection_id"
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="dc_cov_filter"
                                dataField="dc_cov.keyword"
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
                                    and: ["search", "collection_id_filter", "web_directory_filter", "dc_cov_filter"],
                                }}
                                render={({ data }) => (
                                    <ReactiveList.ResultListWrapper>
                                        {data.map((item) => (
                                            <ResultList key={item._id}>
                                                <ResultList.Content>
                                                    <ResultList.Title dangerouslySetInnerHTML={{__html: item.dc_ti}} />
                                                    <ResultList.Description dangerouslySetInnerHTML={{__html: item.dc_de}} />
                                                    <br />
                                                    <div>
                                                        <div>_id: {item._id}</div>
                                                        <div>XXX_dc_de: {item.XXX_dc_de}</div>
                                                        <div>all: {item.all}</div>
                                                        <div>collection_id: {item.collection_id}</div>
                                                        <div>collection_name: {item.collection_name}</div>
                                                        <div>dc_cov: {item.dc_cov}</div>
                                                        <div>dc_cr: {item.dc_cr}</div>
                                                        <div>dc_cv: {item.dc_cv}</div>
                                                        <div>dc_da: {item.dc_da}</div>
                                                        <div>dc_de: {item.dc_de}</div>
                                                        <div>dc_fo: {item.dc_fo}</div>
                                                        <div>dc_ge: {item.dc_ge}</div>
                                                        <div>dc_id: {item.dc_id}</div>
                                                        <div>dc_la: {item.dc_la}</div>
                                                        <div>dc_lo: {item.dc_lo}</div>
                                                        <div>dc_pu: {item.dc_pu}</div>
                                                        <div>dc_re: {item.dc_re}</div>
                                                        <div>dc_so: {item.dc_so}</div>
                                                        <div>dc_su: {item.dc_su}</div>
                                                        <div>dc_ti: {item.dc_ti}</div>
                                                        <div>dc_type: {item.dc_type}</div>
                                                        <div>ic_all: {item.ic_all}</div>
                                                        <div>item_id: {item.item_id}</div>
                                                        <div>media_id: {item.media_id}</div>
                                                        <div>uid: {item.uid}</div>
                                                        <div>web_directory: {item.web_directory}</div>
                                                        <div>xx_dc_co: {item.xx_dc_co}</div>
                                                        <div>xx_dc_cr: {item.xx_dc_cr}</div>
                                                        <div>xx_dc_cv: {item.xx_dc_cv}</div>
                                                        <div>xxdc_da: {item.xxdc_da}</div>
                                                        <div>xxdc_de: {item.xxdc_de}</div>
                                                    </div>
                                                </ResultList.Content>
                                            </ResultList>
                                        ))}
                                    </ReactiveList.ResultListWrapper>
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
