import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
    ReactiveBase,
    ReactiveList,
    ResultList,
    SearchBox,
    SelectedFilters,
    StateProvider,
} from '@appbaseio/reactivesearch';
import CollapsibleMultiList from './components/CollapsibleMultiList.jsx';

import {Alert, Button, Card, Col, Row,} from 'antd';
import {FormOutlined, ClearOutlined} from '@ant-design/icons';
import DOMPurify from 'dompurify';

import {REACTIVESEARCH_CONFIG} from './utils/constants.js';
import {buildOpenSearchQuery} from './utils/queryBuilder.js';
import {parseSearchQuery, checkParserHealth} from './services/searchParserService.js';

// Helper function to sanitize HTML and properly decode HTML entities
// This ensures Unicode characters are displayed correctly
const sanitizeHtml = (html) => {
    if (!html) return '';

    // Normalize input: handle arrays by joining, then coerce to string
    let htmlString = html;
    if (Array.isArray(html)) {
        htmlString = html.join(', ');
    } else {
        htmlString = String(html);
    }

    // DOMPurify sanitizes the HTML to prevent XSS attacks
    // It also properly decodes HTML entities like &eacute; → é
    const sanitized = DOMPurify.sanitize(htmlString, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'span'],
        ALLOWED_ATTR: ['href', 'rel']
    });

    // Note: We don't allow 'target' attribute to avoid reverse-tabnabbing risks.
    // If external links need to open in new tabs, they should be handled
    // explicitly in the JSX with proper rel="noopener noreferrer" attributes.

    return sanitized;
};

function RsDorDcApp() {
    const [connectionError, setConnectionError] = useState(null);
    const [parserError, setParserError] = useState(null);
    const [parserAvailable, setParserAvailable] = useState(true);
    const [filters, setFilters] = useState({
        collection: [],
        subject: [],
        date: [],
        coverage: [],
        group: [],
        type: [],
        HLB: [],
    });
    const latestDataRef = useRef([]);
    const searchQueryRef = useRef('');
    const parsedQueryRef = useRef('');
    const parsedQueryDslRef = useRef(null);
    const setSearchStateRef = useRef(null);
    const parseDebounceRef = useRef(null);        // setTimeout handle
    const parseAbortControllerRef = useRef(null); // AbortController for in-flight /parse request

    useEffect(() => {
        // Test connections to ReactiveSearch and Search Parser
        const testConnections = async () => {
            // Test ReactiveSearch connection
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

            // Test Search Parser service
            const parserHealthy = await checkParserHealth();
            setParserAvailable(parserHealthy);
            if (!parserHealthy) {
                setParserError('Search parser service is unavailable. Using raw queries.');
                console.warn('Search parser service is not available, queries will not be transformed');
            }
        };
        testConnections();
    }, []);

    // Generate Google Form URL with prepopulated fields - memoized to avoid recreation
    const generateFeedbackFormUrl = useCallback((searchQueryOverride) => {
        const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSehpVZ-rcfsvv9fTlRwIpO2JR7fx29pveSh9A7djlBxOm1l1A/viewform?usp=pp_url';

        const params = new URLSearchParams();

        // Identifier - generate a unique UUID for this feedback submission
        const identifier = crypto.randomUUID();
        params.append('entry.886322516', identifier);

        // Index Version — use the configured index name so this field
        // tracks the active index automatically without a code change.
        params.append('entry.1352964690', REACTIVESEARCH_CONFIG.index);


        // Search query - use override if provided, otherwise use ref
        const queryValue = searchQueryOverride !== undefined ? searchQueryOverride : searchQueryRef.current;

        // Build complete query string including filters
        let fullQuery = queryValue || '';

        // Add active filters to the query
        const filterParts = [];
        if (filters.collection.length > 0) {
            filterParts.push(`Collection: ${filters.collection.join(', ')}`);
        }
        if (filters.subject.length > 0) {
            filterParts.push(`Subject: ${filters.subject.join(', ')}`);
        }
        if (filters.date.length > 0) {
            filterParts.push(`Date: ${filters.date.join(', ')}`);
        }
        if (filters.coverage.length > 0) {
            filterParts.push(`Coverage: ${filters.coverage.join(', ')}`);
        }
        if (filters.group.length > 0) {
            filterParts.push(`Group: ${filters.group.join(', ')}`);
        }
        if (filters.type.length > 0) {
            filterParts.push(`Type: ${filters.type.join(', ')}`);
        }
        if (filters.HLB.length > 0) {
            filterParts.push(`Subject Area: ${filters.HLB.join(', ')}`);
        }

        if (filterParts.length > 0) {
            if (fullQuery) {
                fullQuery += '\n\nActive Filters:\n' + filterParts.join('\n');
            } else {
                fullQuery = 'Active Filters:\n' + filterParts.join('\n');
            }
        }

        if (fullQuery) {
            params.append('entry.396741779', fullQuery);
        }

        // Top 5 results - use the latest data from ref
        const resultsData = latestDataRef.current;
        if (resultsData && resultsData.length > 0) {
            const top5Results = resultsData.slice(0, 5).map((item, index) => {
                // Handle dc_title as either string or array
                let title = 'Untitled';
                if (item.dc_title) {
                    const titleRaw = Array.isArray(item.dc_title) ? item.dc_title.join(', ') : item.dc_title;
                    title = titleRaw.replace(/<[^>]*>/g, '');
                }
                return `${index + 1}. ${title}`;
            }).join('\n');

            params.append('entry.1552271952', top5Results);
        }

        // Parsed query - the parser service's normalized query string.
        // Falls back to the raw query when the parser is unavailable.
        const parsedQuery = parsedQueryRef.current || queryValue || '';
        if (parsedQuery) {
            params.append('entry.579946332', parsedQuery);
        }

        return `${baseUrl}&${params.toString()}`;
    }, [filters]);

    // Memoized filter change handlers
    const handleCollectionChange = useCallback((value) => {
        setFilters(prev => ({ ...prev, collection: value || [] }));
    }, []);

    const handleSubjectChange = useCallback((value) => {
        setFilters(prev => ({ ...prev, subject: value || [] }));
    }, []);

    const handleDateChange = useCallback((value) => {
        setFilters(prev => ({ ...prev, date: value || [] }));
    }, []);

    const handleCoverageChange = useCallback((value) => {
        setFilters(prev => ({ ...prev, coverage: value || [] }));
    }, []);

    const handleGroupChange = useCallback((value) => {
        setFilters(prev => ({ ...prev, group: value || [] }));
    }, []);

    const handleTypeChange = useCallback((value) => {
        setFilters(prev => ({ ...prev, type: value || [] }));
    }, []);

    const handleHLBChange = useCallback((value) => {
        setFilters(prev => ({ ...prev, HLB: value || [] }));
    }, []);

    const handleSearchChange = useCallback((value) => {
        // Update the raw query ref immediately (used by feedback form etc.)
        searchQueryRef.current = value || '';

        // Cancel any pending debounce timer and any in-flight parse request.
        // This prevents both a burst of requests on fast typing and stale
        // responses from an earlier (slower) request overwriting parsedQueryDslRef
        // after a newer keystroke has already been processed.
        clearTimeout(parseDebounceRef.current);
        if (parseAbortControllerRef.current) {
            parseAbortControllerRef.current.abort();
            parseAbortControllerRef.current = null;
        }

        // Reset DSL immediately so customQuery uses the fallback path while
        // the debounce is pending — avoids serving stale DSL to ReactiveSearch.
        parsedQueryRef.current = value || '';
        parsedQueryDslRef.current = null;

        if (!parserAvailable || !value) return;

        // Debounce: only fire the parse request 300 ms after the last keystroke.
        parseDebounceRef.current = setTimeout(async () => {
            const controller = new AbortController();
            parseAbortControllerRef.current = controller;

            try {
                const result = await parseSearchQuery(value, { signal: controller.signal });
                parsedQueryRef.current = result.parsedQuery;
                parsedQueryDslRef.current = result.parsedQueryDsl;

                if (parserError && !result.error) {
                    setParserError(null);
                }
                if (result.error && !parserError) {
                    setParserError('Search parser service error: using raw query');
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    // Request was superseded by a newer keystroke — do nothing.
                    return;
                }
                console.error('Error parsing query:', error);
                parsedQueryRef.current = value;
                parsedQueryDslRef.current = null;
                setParserError('Parser service error: using raw query');
            }
        }, 300);
    }, [parserAvailable, parserError]);

    const clearAllFilters = useCallback(() => {
        setFilters({
            collection: [],
            subject: [],
            date: [],
            coverage: [],
            group: [],
            type: [],
            HLB: [],
        });
        if (setSearchStateRef.current) {
            setSearchStateRef.current({});
        }
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
            {parserError && (
                <Alert
                    message="Search Parser Service Warning"
                    description={parserError}
                    type="warning"
                    showIcon
                    closable
                    onClose={() => setParserError(null)}
                    style={{marginBottom: 20}}
                />
            )}
            <ReactiveBase
                app={REACTIVESEARCH_CONFIG.index}
                credentials={REACTIVESEARCH_CONFIG.credentials}
                url={REACTIVESEARCH_CONFIG.url}
                reactivesearchAPIConfig={{
                    recordAnalytics: false,
                    suggestionAnalytics: false,
                    enableQueryRules: false,
                }}
            >
                <StateProvider
                    render={({ setSearchState }) => {
                        setSearchStateRef.current = setSearchState;
                        return null;
                    }}
                />
                <Row gutter={16} style={{padding: 20}}>
                    <Col span={6}>
                        <Card>
                            <CollapsibleMultiList
                                componentId="collection"
                                dataField="collection_name.facet"
                                title="Collection"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search collections"
                                react={{
                                    and: ["search", "collection", "subject", "date", "coverage", "group", "type", "HLB"]
                                }}
                                onValueChange={handleCollectionChange}
                            />
                        </Card>
                        <Card>
                            <CollapsibleMultiList
                                componentId="subject"
                                dataField="dc_subject.facet"
                                title="Subject"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search subjects"
                                react={{
                                    and: ["search", "collection", "subject", "date", "coverage", "group", "type", "HLB"]
                                }}
                                onValueChange={handleSubjectChange}
                            />
                        </Card>
                        <Card>
                            <CollapsibleMultiList
                                componentId="date"
                                dataField="dc_date.facet"
                                title="Date"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search dates"
                                react={{
                                    and: ["search", "collection", "subject", "date", "coverage", "group", "type", "HLB"]
                                }}
                                onValueChange={handleDateChange}
                            />
                        </Card>
                        <Card>
                            <CollapsibleMultiList
                                componentId="coverage"
                                dataField="dc_coverage.facet"
                                title="Coverage"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search coverage"
                                react={{
                                    and: ["search", "collection", "subject", "date", "coverage", "group", "type", "HLB"]
                                }}
                                onValueChange={handleCoverageChange}
                            />
                        </Card>
                        <Card>
                            <CollapsibleMultiList
                                componentId="group"
                                dataField="group_name.facet"
                                title="Group"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search groups"
                                react={{
                                    and: ["search", "collection", "subject", "date", "coverage", "group", "type", "HLB"]
                                }}
                                onValueChange={handleGroupChange}
                            />
                        </Card>
                        <Card>
                            <CollapsibleMultiList
                                componentId="type"
                                dataField="collection_type.facet"
                                title="Type"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={false}
                                react={{
                                    and: ["search", "collection", "subject", "date", "coverage", "group", "type", "HLB"]
                                }}
                                onValueChange={handleTypeChange}
                            />
                        </Card>
                        <Card>
                            <CollapsibleMultiList
                                componentId="HLB"
                                dataField="hlb.facet"
                                title="Subject Area"
                                aggregationSize={2000}
                                sortBy="count"
                                showSearch={true}
                                placeholder="Search subject areas"
                                react={{
                                    and: ["search", "collection", "subject", "date", "coverage", "group", "type", "HLB"]
                                }}
                                onValueChange={handleHLBChange}
                            />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <SearchBox
                            componentId="search"
                            dataField={["ic_all"]}
                            placeholder="Search All (Use AND, OR, NOT for Boolean logic)"
                            queryFormat="and"
                            fuzziness={0}
                            enableRecentSuggestions={false}
                            onValueChange={handleSearchChange}
                            customQuery={(value, props) => {
                                if (!value) return null;

                                // Use parsed DSL from parser service when available,
                                // falling back to the raw query string for manual DSL construction.
                                return buildOpenSearchQuery(
                                    parsedQueryRef.current || value,
                                    parsedQueryDslRef.current,
                                    props.dataField
                                );
                            }}
                        />
                        <div style={{marginTop: '16px', marginBottom: '16px', display: 'flex', gap: '8px'}}>
                            <Button
                                type="primary"
                                icon={<FormOutlined />}
                                onClick={() => {
                                    const url = generateFeedbackFormUrl(searchQueryRef.current);
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                }}
                            >
                                Provide Feedback on Search Results
                            </Button>
                            <Button
                                icon={<ClearOutlined />}
                                onClick={clearAllFilters}
                            >
                                Clear All Filters
                            </Button>
                        </div>
                        <SelectedFilters/>
                        <div id="result">
                            <ReactiveList
                                componentId="results"
                                dataField="ic_all"
                                size={9}
                                pagination={true}
                                react={{
                                    and: ["search", "collection", "subject", "date", "coverage", "group", "type", "HLB"],
                                }}
                                render={({data}) => {
                                    // Store latest data in ref for feedback form
                                    latestDataRef.current = data || [];

                                    return (
                                    <ReactiveList.ResultListWrapper>
                                        {data.map((item) => (
                                            <ResultList key={item._id} className="result-list-container">
                                                <ResultList.Content>
                                                     <ResultList.Title dangerouslySetInnerHTML={{__html: sanitizeHtml(item.dc_title)}}/>
                                                     <ResultList.Description
                                                         dangerouslySetInnerHTML={{__html: sanitizeHtml(item.dc_description)}}/>
                                                     <br/>
                                                     {item.dc_creator && (
                                                         <div dangerouslySetInnerHTML={{__html: sanitizeHtml(item.dc_creator)}}/>)}
                                                    {item.collection_id && item.item_id && item.media_id && item.media_id !== "NOFILE" && (
                                                        <div>
                                                            <img
                                                                src={`https://quod.lib.umich.edu/cgi/i/image/api/image/${item.collection_id}:${item.item_id}:${item.media_id}/full/140,/0/native.jpg`}/>
                                                        </div>
                                                    )}
                                                    {item.collection_name && <div>{item.collection_name}</div>}
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
                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'auto 1fr',
                                                        gap: '8px 16px',
                                                        alignItems: 'start'
                                                    }}>
                                                        {item.collection_name && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>collection_name:</div>
                                                                <div>{Array.isArray(item.collection_name) ? item.collection_name.join(', ') : item.collection_name}</div>
                                                            </>
                                                        )}
                                                        {item.hlb && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>hlb:</div>
                                                                <div>{Array.isArray(item.hlb) ? item.hlb.join(', ') : item.hlb}</div>
                                                            </>
                                                        )}
                                                    {item.group_name && (
                                                        <>
                                                            <div style={{fontWeight: 'bold'}}>group_name:</div>
                                                            <div>{Array.isArray(item.group_name) ? item.group_name.join(', ') : item.group_name}</div>
                                                        </>
                                                    )}
                                                        {item.dc_contributor && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_contributor:</div>
                                                                <div>{Array.isArray(item.dc_contributor) ? item.dc_contributor.join(', ') : item.dc_contributor}</div>
                                                            </>
                                                        )}
                                                        {item.dc_coverage && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_coverage:</div>
                                                                <div>{Array.isArray(item.dc_coverage) ? item.dc_coverage.join(', ') : item.dc_coverage}</div>
                                                            </>
                                                        )}
                                                        {item.dc_creator && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_creator:</div>
                                                                <div>{Array.isArray(item.dc_creator) ? item.dc_creator.join(', ') : item.dc_creator}</div>
                                                            </>
                                                        )}
                                                        {item.dc_date && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_date:</div>
                                                                <div>{Array.isArray(item.dc_date) ? item.dc_date.join(', ') : item.dc_date}</div>
                                                            </>
                                                        )}
                                                        {item.dc_description && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_description:</div>
                                                                <div>{Array.isArray(item.dc_description) ? item.dc_description.join(', ') : item.dc_description}</div>
                                                            </>
                                                        )}
                                                        {item.dc_format && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_format:</div>
                                                                <div>{Array.isArray(item.dc_format) ? item.dc_format.join(', ') : item.dc_format}</div>
                                                            </>
                                                        )}
                                                        {item.dc_genre && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_genre:</div>
                                                                <div>{Array.isArray(item.dc_genre) ? item.dc_genre.join(', ') : item.dc_genre}</div>
                                                            </>
                                                        )}
                                                        {item.dc_language && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_language:</div>
                                                                <div>{Array.isArray(item.dc_language) ? item.dc_language.join(', ') : item.dc_language}</div>
                                                            </>
                                                        )}
                                                        {item.dc_location && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_location:</div>
                                                                <div>{Array.isArray(item.dc_location) ? item.dc_location.join(', ') : item.dc_location}</div>
                                                            </>
                                                        )}
                                                        {item.dc_publisher && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_publisher:</div>
                                                                <div>{Array.isArray(item.dc_publisher) ? item.dc_publisher.join(', ') : item.dc_publisher}</div>
                                                            </>
                                                        )}
                                                        {item.dc_rights && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_rights:</div>
                                                                <div>{Array.isArray(item.dc_rights) ? item.dc_rights.join(', ') : item.dc_rights}</div>
                                                            </>
                                                        )}
                                                        {item.dc_relation && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_relation:</div>
                                                                <div>{Array.isArray(item.dc_relation) ? item.dc_relation.join(', ') : item.dc_relation}</div>
                                                            </>
                                                        )}
                                                        {item.dc_source && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_source:</div>
                                                                <div>{Array.isArray(item.dc_source) ? item.dc_source.join(', ') : item.dc_source}</div>
                                                            </>
                                                        )}
                                                        {item.dc_subject && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_subject:</div>
                                                                <div>{Array.isArray(item.dc_subject) ? item.dc_subject.join(', ') : item.dc_subject}</div>
                                                            </>
                                                        )}
                                                        {item.dc_type && (
                                                            <>
                                                                <div style={{fontWeight: 'bold'}}>dc_type:</div>
                                                                <div>{Array.isArray(item.dc_type) ? item.dc_type.join(', ') : item.dc_type}</div>
                                                            </>
                                                        )}

                                                     </div>
                                                </ResultList.Content>
                                            </ResultList>
                                        ))}
                                    </ReactiveList.ResultListWrapper>
                                );
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            </ReactiveBase>
        </div>
    );
}

export default RsDorDcApp;
