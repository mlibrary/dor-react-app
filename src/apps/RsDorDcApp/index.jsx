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

import {REACTIVESEARCH_CONFIG, SEARCH_FIELDS} from './utils/constants.js';


function RsDorDcApp() {
    return (
        <div style={{padding: '20px', maxWidth: '100%', margin: '0 auto'}}>
            <ReactiveBase
                app="dor-dc"
                credentials={REACTIVESEARCH_CONFIG.credentials}
                url={REACTIVESEARCH_CONFIG.url}
                reactivesearchAPIConfig={{
                    recordAnalytics: false,
                    suggestionAnalytics: false,
                    enableQueryRules: false,
                }}
            >
                <Row gutter={16} style={{padding: 20}}>
                    <Col span={6}>
                        <Card>
                            <MultiList
                                componentId="coll"
                                dataField="collection_name.facet"
                                title="Collection"
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="subject"
                                dataField="dc_su.facet"
                                title="Subject"
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="date"
                                dataField="dc_da.facet"
                                title="Date"
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="coverage"
                                dataField="dc_cov.keyword"
                                title="Coverage"
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
                        <SelectedFilters/>
                        <div id="result">
                            <ReactiveList
                                componentId="results"
                                dataField="all"
                                size={9}
                                pagination={true}
                                react={{
                                    and: ["search", "coll", "subject", "date", "coverage"],
                                }}
                                render={({data}) => (
                                    <ReactiveList.ResultListWrapper>
                                        {data.map((item) => (
                                            <ResultList key={item._id} className="result-list-container">
                                                <ResultList.Content>
                                                    <ResultList.Title dangerouslySetInnerHTML={{__html: item.dc_ti}}/>
                                                    <ResultList.Description dangerouslySetInnerHTML={{__html: item.dc_de}}/>
                                                    <br/>
                                                    {item.dc_cr && (<div dangerouslySetInnerHTML={{__html: item.dc_cr}}/>)}
                                                    {item.collection_id && item.item_id && item.media_id && item.media_id !== "NOFILE" && (
                                                        <div>
                                                            <img src={`https://quod.lib.umich.edu/cgi/i/image/api/image/${item.collection_id}:${item.item_id}:${item.media_id}/full/140,/0/native.jpg`} />
                                                        </div>
                                                    )}
                                                    {item.collection_name && <dib>{item.collection_name}</dib>}
                                                    {item.web_directory && item.item_id && (
                                                        <div>
                                                            <a
                                                                href={`https://quod.lib.umich.edu${item.web_directory}/${item.item_id}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {`https://quod.lib.umich.edu${item.web_directory}/${item.item_id}`}
                                                            </a>
                                                        </div>
                                                    )}
                                                    <br/>
                                                    <div>
                                                        {item.dc_cov && <div>dc_cov: {item.dc_cov}</div>}
                                                        {item.dc_cv && <div>dc_cv: {item.dc_cv}</div>}
                                                        {item.dc_da && <div>dc_da: {item.dc_da}</div>}
                                                        {item.dc_fo && <div>dc_fo: {item.dc_fo}</div>}
                                                        {item.dc_ge && <div>dc_ge: {item.dc_ge}</div>}
                                                        {item.dc_la && <div>dc_la: {item.dc_la}</div>}
                                                        {item.dc_pu && <div>dc_pu: {item.dc_pu}</div>}
                                                        {item.dc_re && <div>dc_re: {item.dc_re}</div>}
                                                        {item.dc_so && <div>dc_so: {item.dc_so}</div>}
                                                        {item.dc_su && <div>dc_su: {item.dc_su}</div>}
                                                        {item.dc_type && <div>dc_type: {item.dc_type}</div>}
                                                        {item.xxdc_da && <div>xxdc_da: {item.xxdc_da}</div>}
                                                        {item.xxdc_de && <div>xxdc_de: {item.xxdc_de}</div>}
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
