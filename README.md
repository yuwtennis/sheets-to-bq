# velocity

# Motivation

Extract data from google sheets and analyze on Data studio 360 .
Specifically targeting usecase for managing velocity in Scrum product backlog.

# Concept

* Store data in BigQuery to analyze _long term trend_ .
* Push data from Google Sheets to BigQuery using Google App Script via button event .

# Bigquery

## 

## Schema 

Define schema in bigquery .

| Name | Column Type | Description |
| ---- | ---- | ----------- |
| PBI num | INT64 | PBI number |
| title | STRING | title of the item |
| status | STRING | Status of Sprint |
