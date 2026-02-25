# DOR React App

Digital Object Repository Simple Search Web Application to evaluate OpenSearch.

## Devcontainer for Local Development

```shell
ls .devcontainer
```

## Local Development Against Remote Servers
### Environment File
``` shell
VITE_OPENSEARCH_URL="http://opensearch:9200"
VITE_OPENSEARCH_CREDENTIALS="admin:password"
VITE_REACTIVESEARCH_URL="http://reactivesearch:8000"
VITE_REACTIVESEARCH_CREDENTIALS="admin:password"
```
### Docker Compose
``` shell
docker compose up -d
docker compose exec -- app npm install
docker compose exec -- app npm run dev
```

### OpenSearch
#### indices (apps)
```shell
curl -X GET "http://localhost:9200/_cat/indices?v" -u admin:password
```
#### fields (mappings)
```shell
curl -X GET "http://localhost:9200/dor-dc/_mapping?pretty" -u admin:password
```

## GitHub Actions to Build Images

``` shell
ls .github/workflows/build-*
```