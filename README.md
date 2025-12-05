# DOR React App

Digital Object Repository Simple Search Web Application to evaluate OpenSearch.

## Devcontainer for Local Development

```shell
ls .devcontainer
```

## Local Development Against Remote Servers

``` shell
docker compose build
docker compose up
docker compose exec -- app npm install
docker compose exec -- app npm run dev
```

## GitHub Actions to Build Images

``` shell
ls .github/workflows/build-*
```