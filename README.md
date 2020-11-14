# velocity

# Motivation

Extract data from google sheets and analyze on Data studio 360 .
Specifically targeting usecase for managing velocity in Scrum product backlog.

# Concept

* Store data in BigQuery to analyze _long term trend_ .
* Push data from Google Sheets to BigQuery using Google App Script via button event .

# Bigquery

## Schema 

Define schema in bigquery .

| Name | Column Type | Description |
| ---- | ---- | ----------- |
| pbi_id | INT64 | PBI number |
| title | STRING | Title of the item |
| status | STRING | Status of sprint |

# HOW TO

## Pre requisite

* [clasp](https://github.com/google/clasp)
* [gcloud](https://cloud.google.com/sdk/gcloud)
* [bq](https://cloud.google.com/bigquery/docs/bq-command-line-tool)

## Create dataset and table

```
gcloud auth login
cd bq
make deploy
```

## Deploy app script

1. (Only once) clasp login
```
cd gas
clasp login
```

2. (Only once) Create project
```
clasp create --parentId SHEETS_ID --title "Extract PBI" --rootDir ./catseye
```
