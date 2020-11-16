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
    status_column: "L3:L1000",
    sprint_term_unit: 7,
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
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  var now = new Date()

  // The day of this click event will be end of sprint
  var sprint_to = Utilities.formatDate(now, "Asia/Tokyo", "yyyy-MM-dd");

  // The day sprint began will be sprint_term_unit days
  var sprint_from = Utilities.formatDate(
    new Date(now.getTime() - MILLIS_PER_DAY * sheetsConfig["sprint_term_unit"]), "Asia/Tokyo", "yyyy-MM-dd");
  
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
          "sprint_name": "sprint-"+sprint_from,
          "sprint_from": sprint_from,
          "sprint_to": sprint_to
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
