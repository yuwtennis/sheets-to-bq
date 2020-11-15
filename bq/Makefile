
LOCATION := asia-northeast1
PROJECT_ID := creationline001
DATASET_NAME := catseye
TABLE_NAME := SenbinYojitsu
SCHEMA_FILE := schema.json

deploy:
	echo "Creating dataset..."
        # Table will never expire
	bq --location=$(LOCATION) mk -d --default_table_expiration 0 --description "My dataset."  $(PROJECT_ID):$(DATASET_NAME)

	echo "Creating table..."
	bq --location=$(LOCATION) mk -t  $(PROJECT_ID):$(DATASET_NAME).$(TABLE_NAME) ./$(SCHEMA_FILE)

clean:
	echo "Delete table..."
	bq --location=$(LOCATION) rm -f -t $(PROJECT_ID):$(DATASET_NAME).$(TABLE_NAME)

	echo "Delete dataset..."
	bq --location=$(LOCATION) rm -f -d $(PROJECT_ID):$(DATASET_NAME)
