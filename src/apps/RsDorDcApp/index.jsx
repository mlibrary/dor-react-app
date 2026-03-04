import React, {useState, useEffect} from 'react';

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
    Alert,
} from 'antd';

import {REACTIVESEARCH_CONFIG, SEARCH_FIELDS} from './utils/constants.js';


function RsDorDcApp() {
    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        // Test connection to ReactiveSearch
        const testConnection = async () => {
            try {
                const response = await fetch(REACTIVESEARCH_CONFIG.url, {
                    method: 'HEAD',
                    headers: {
                        'Authorization': 'Basic ' + btoa(REACTIVESEARCH_CONFIG.credentials)
                    }
                });
                if (!response.ok) {
                    setConnectionError(`Cannot connect to ReactiveSearch service (HTTP ${response.status})`);
                }
            } catch (error) {
                setConnectionError(`Cannot connect to ReactiveSearch service: ${error.message}`);
            }
        };
        testConnection();
    }, []);

    return (
        <div style={{padding: '20px', maxWidth: '100%', margin: '0 auto'}}>
            {connectionError && (
                <Alert
                    message="Connection Error"
                    description={`${connectionError}. The search functionality may not work properly. Please contact the system administrator.`}
                    type="error"
                    showIcon
                    closable
                    style={{marginBottom: 20}}
                />
            )}
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
                                dataField="collection_name.keyword"
                                title="Collection"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search collections"
                                react={{
                                    and: ["search", "subject", "coverage", "date"]
                                }}
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="subject"
                                dataField="dc_su.keyword"
                                title="Subject"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search subjects"
                                react={{
                                    and: ["search", "coll", "coverage", "date"]
                                }}
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="date"
                                dataField="dc_da.keyword"
                                title="Date"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search dates"
                                react={{
                                    and: ["search", "coll", "subject", "coverage"]
                                }}
                            />
                        </Card>
                        <Card>
                            <MultiList
                                componentId="coverage"
                                dataField="dc_cov.keyword"
                                title="Coverage"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search coverage"
                                react={{
                                    and: ["search", "coll", "subject", "date"]
                                }}
                            />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <SearchBox
                            // autosuggest={false}
                            componentId="search"
                            dataField={["ic_all"]}
                            placeholder="Search All"
                        />
                        <SelectedFilters/>
                        <div id="result">
                            <ReactiveList
                                componentId="results"
                                dataField="ic_all"
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
                                                    <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', alignItems: 'start'}}>
                                                        {item.XXX_dc_de && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>XXX_dc_de:</div>
                                                                <div>{Array.isArray(item.XXX_dc_de) ? item.XXX_dc_de.join(', ') : item.XXX_dc_de}</div>
                                                            </>
                                                        )}
                                                        {item.dc_co && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_co:</div>
                                                                <div>{Array.isArray(item.dc_co) ? item.dc_co.join(', ') : item.dc_co}</div>
                                                            </>
                                                        )}
                                                        {item.dc_cov && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_cov:</div>
                                                                <div>{Array.isArray(item.dc_cov) ? item.dc_cov.join(', ') : item.dc_cov}</div>
                                                            </>
                                                        )}
                                                        {item.dc_cr && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_cr:</div>
                                                                <div>{Array.isArray(item.dc_cr) ? item.dc_cr.join(', ') : item.dc_cr}</div>
                                                            </>
                                                        )}
                                                        {item.dc_da && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_da:</div>
                                                                <div>{Array.isArray(item.dc_da) ? item.dc_da.join(', ') : item.dc_da}</div>
                                                            </>
                                                        )}
                                                        {item.dc_de && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_de:</div>
                                                                <div>{Array.isArray(item.dc_de) ? item.dc_de.join(', ') : item.dc_de}</div>
                                                            </>
                                                        )}
                                                        {item.dc_fo && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_fo:</div>
                                                                <div>{Array.isArray(item.dc_fo) ? item.dc_fo.join(', ') : item.dc_fo}</div>
                                                            </>
                                                        )}
                                                        {item.dc_ge && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_ge:</div>
                                                                <div>{Array.isArray(item.dc_ge) ? item.dc_ge.join(', ') : item.dc_ge}</div>
                                                            </>
                                                        )}
                                                        {item.dc_la && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_la:</div>
                                                                <div>{Array.isArray(item.dc_la) ? item.dc_la.join(', ') : item.dc_la}</div>
                                                            </>
                                                        )}
                                                        {item.dc_lo && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_lo:</div>
                                                                <div>{Array.isArray(item.dc_lo) ? item.dc_lo.join(', ') : item.dc_lo}</div>
                                                            </>
                                                        )}
                                                        {item.dc_pu && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_pu:</div>
                                                                <div>{Array.isArray(item.dc_pu) ? item.dc_pu.join(', ') : item.dc_pu}</div>
                                                            </>
                                                        )}
                                                        {item.dc_re && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_re:</div>
                                                                <div>{Array.isArray(item.dc_re) ? item.dc_re.join(', ') : item.dc_re}</div>
                                                            </>
                                                        )}
                                                        {item.dc_rel && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_rel:</div>
                                                                <div>{Array.isArray(item.dc_rel) ? item.dc_rel.join(', ') : item.dc_rel}</div>
                                                            </>
                                                        )}
                                                        {item.dc_so && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_so:</div>
                                                                <div>{Array.isArray(item.dc_so) ? item.dc_so.join(', ') : item.dc_so}</div>
                                                            </>
                                                        )}
                                                        {item.dc_su && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_su:</div>
                                                                <div>{Array.isArray(item.dc_su) ? item.dc_su.join(', ') : item.dc_su}</div>
                                                            </>
                                                        )}
                                                        {item.dc_ty && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_ty:</div>
                                                                <div>{Array.isArray(item.dc_ty) ? item.dc_ty.join(', ') : item.dc_ty}</div>
                                                            </>
                                                        )}
                                                        {item.dc_type && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_type:</div>
                                                                <div>{Array.isArray(item.dc_type) ? item.dc_type.join(', ') : item.dc_type}</div>
                                                            </>
                                                        )}
                                                        {item.xx_dc_co && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>xx_dc_co:</div>
                                                                <div>{Array.isArray(item.xx_dc_co) ? item.xx_dc_co.join(', ') : item.xx_dc_co}</div>
                                                            </>
                                                        )}
                                                        {item.xx_dc_cr && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>xx_dc_cr:</div>
                                                                <div>{Array.isArray(item.xx_dc_cr) ? item.xx_dc_cr.join(', ') : item.xx_dc_cr}</div>
                                                            </>
                                                        )}
                                                        {item.xx_dc_cv && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>xx_dc_cv:</div>
                                                                <div>{Array.isArray(item.xx_dc_cv) ? item.xx_dc_cv.join(', ') : item.xx_dc_cv}</div>
                                                            </>
                                                        )}
                                                        {item.xx_dc_fo && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>xx_dc_fo:</div>
                                                                <div>{Array.isArray(item.xx_dc_fo) ? item.xx_dc_fo.join(', ') : item.xx_dc_fo}</div>
                                                            </>
                                                        )}
                                                        {item.xx_dc_so && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>xx_dc_so:</div>
                                                                <div>{Array.isArray(item.xx_dc_so) ? item.xx_dc_so.join(', ') : item.xx_dc_so}</div>
                                                            </>
                                                        )}

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
