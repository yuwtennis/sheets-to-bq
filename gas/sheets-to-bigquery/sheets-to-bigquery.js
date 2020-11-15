function onClickSharyo() {
  // Gcloud configuration
  var gcloudConfig = {
    project_id: "MY_PROJECT_ID",
    dataset_id: "MY_DATASET_ID",
    table_id: "MY_TABLE_ID"
  }
  
  // Sheet configuration
  var sheetsConfig = {
    team: "UNAGI",
    sprint_complete_status: "sprint complete",
    sprint_archived_status: "完了",
    range: "MY_SHEET_NAME!A3:M1000",
    index: {
      pbi_id: 0,
      title: 2,
      status: 11,
      scheduled_sp: 7,
      actual_sp: 8
    },
    status_column: "L3:L1000"
  }

  // Current active sheet object
  var sheet = SpreadsheetApp.getActiveSpreadsheet();

  // Retrieve last row
  var lastRow = sheet.getLastRow();

  // Extract data from Sheets
  json_data = extractFromActiveSheet(sheet, lastRow, sheetsConfig);
  
  Logger.log('Length:'+json_data.length);
  Logger.log(json_data);
  
  if(json_data.length > 0) {
    // Load to BQ
    insertRowsAsStream(json_data, gcloudConfig["project_id"], gcloudConfig["dataset_id"], gcloudConfig["table_id"]);
  
    // Change status to archived status
    setSprintStatusAsArchived(sheet, lastRow, sheetsConfig);
  } else {
    Logger.log("No data to sync to BQ.")
  }
}

function extractFromActiveSheet(sheet, lastRow, sheetsConfig) {
  var range = sheet.getRange(sheetsConfig["range"]);
  var values = range.getValues();
  var json_data = new Array();
  
  // Beginning index for this range
  Logger.log(range.getRowIndex());

  for ( var r = 0; r <= (lastRow - range.getRowIndex()); r++ ) {
    Logger.log(values[r][sheetsConfig["index"]["pbi_id"]]+","+values[r][sheetsConfig["index"]["status"]]);
    
    if (values[r][sheetsConfig["index"]["status"]] == sheetsConfig["sprint_complete_status"] ) {
      json_data.push({
        "insertId": Math.floor(values[r][sheetsConfig["index"]["pbi_id"]]), 
        "json": {
          "pbi_id": Math.floor(values[r][sheetsConfig["index"]["pbi_id"]]),
          "title": values[r][sheetsConfig["index"]["title"]],
          "status": values[r][sheetsConfig["index"]["status"]],
          "scheduled_sp": Math.floor(values[r][sheetsConfig["index"]["scheduled_sp"]]),
          "actual_sp": Math.floor(values[r][sheetsConfig["index"]["actual_sp"]]),
          "sprint_name": "sprint-"+Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd")
        }
      })
    }
  }
  
  return json_data
}

function insertRowsAsStream(json_data, projectId, datasetId, tableId) {
  var resp = BigQuery.Tabledata.insertAll({"rows":json_data}, projectId, datasetId, tableId);
  
  Logger.log(resp)
}

function setSprintStatusAsArchived(sheet, lastRow, sheetsConfig){
  var range = sheet.getRange(sheetsConfig["status_column"]);
  var values = range.getValues();
  
  for ( var r = 0; r <= (lastRow - range.getRowIndex()); r++ ) {
    if(values[r][0] == sheetsConfig["sprint_complete_status"]) {
      values[r][0] = sheetsConfig["sprint_archived_status"];
    }
  }
  
  range.setValues(values)
}
