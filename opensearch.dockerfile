FROM opensearchproject/opensearch:3 AS opensearch

RUN bin/opensearch-plugin install --batch analysis-icu

