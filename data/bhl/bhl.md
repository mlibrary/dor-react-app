

curl -X POST "http://localhost:8000/bhl_index/_search?pretty" \
-H "Content-Type: application/json" \
-H "Authorization: Basic cnMtYWRtaW4tdXNlcjpycy1wYXNzd29yZA==" \
-d '{
"_source": ["title"],
"query": {
"match_all": {}
}
}'

curl "http://localhost:9200/_cat/indices?v"

curl -X POST "http://localhost:9200/bhl/_search?pretty" \
-H "Content-Type: application/json" \
-H "Authorization: Basic cnMtYWRtaW4tdXNlcjpycy1wYXNzd29yZA==" \
-d '{
"_source": ["title"],
"query": {
"match_all": {}
}
}'

GET test_index1/_search
{
"query": {
"match_all": {}
}
}

curl -X POST "http://localhost:9200/bhl/_search?pretty" \
-H "Content-Type: application/json" \
-d '{
"query": {
"match_all": {}
}
}'

curl "http://localhost:9200/bhl"

curl "http://localhost:9200/bhl/_doc/BL001001?pretty"


curl -X POST "http://localhost:9200/bhl/_search?pretty" \
-H "Content-Type: application/json" \
-d '{
"query": {
"match": {
"title.search": "1879 University of Michigan Football Team"
}
}
}'


curl -X POST "http://localhost:9200/bhl/_search?pretty" \
-H "Content-Type: application/json" \
-d '{
"query": {
"match": {
"date": "1879"
}
}
}'

curl "http://localhost:9200/bhl/_search?pretty" \
 '{
"query": {
"match": {
"date": "1879"
}
}
}'

curl -XGET "http://localhost:9200/bhl/_search?pretty" -H 'Content-Type: application/json' -d'
{
"query": {
"match": {
"date": {
"query": "1879",
"analyzer": "simple"
}
}
}
}
'


curl -X POST "http://localhost:9200/bhl/_search?pretty" \
-H "Content-Type: application/json" \
-d '{
"_source": ["title"],
"query": { "match_all": {} }
}'



curl -X POST "http://localhost:9200/bhl/_search?pretty" \
-H "Content-Type: application/json" \
-d '{
"_source": ["title"],
"query": { "match_all": {} }
}'



curl -X POST "http://localhost:9200/bhl/_refresh"
