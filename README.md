# Motivation

Extract data from google sheets and analyze on Data studio 360 .
Specifically targeting usecase for calculating velocity in Scrum product backlog.

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
| scheduled_sp | INT64 | Scheduled story point |
| actual_sp | INT64 | Actual story point |
| sprint_name | STRING | Sprint name |
| sprint_from | STRING | Beginning of sprint |
| sprint_to | STRING | End of sprint |

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

First change settings in `gas-to-bq/sheets-to-bq.js`

### gcloudConfig
| Name | Description |
| ---- | ----------- |
| project_id | Project Id for target BigQuery service |
| dataset_id | DataSet Id you are going to use |
| table_id | Table Id you are going to use |

### sheetsConfig
| Name | Description | Default |
| ---- | ----------  | ------- |
| sprint_complete_status | _status_ column value when sprint is completed.  | sprint complete |
| sprint_archived_status | _status_ column value when pbi item is completed. | 完了 |
| range | Range in target sheet which you are working on in _a1 notation_ format. | A3:M1000 |
| index.pbi_id | Index number for PBI number column | 0 |
| index.title | Index number for title column . Usually this will be something like story description.| 2 |
| index.status | Index number for status column. | 11 |
| index.scheduled_sp | Index number for estimated story point. | 7 |
| index.actual_sp | Index number for actual story point. | 8 |
| status_column | Status column in _a1 notation_ format. | L3:L1000 |

1. (Only once) clasp login
```
cd gas
clasp login
```

2. (Only once) Create project
```
clasp create --parentId SHEETS_ID --title "My Project Name" --rootDir ./my-work-dir
```

3. Push to google app script. THIS WILL OVERWRITE CURRENT EXISTING SCRIPTS IN PROJECT.
```
 clasp push
```
