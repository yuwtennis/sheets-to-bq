function main() {
  // Current active sheet object
  var sheet = SpreadsheetApp.getActiveSpreadsheet();

  // Retrieve last row
  var lastRow = sheet.getLastRow();

  var sheetsConfig = {
    name: "PBI",
    team: "UNAGI",
    index: {
      pbi_id = 0,
      title = 1,
      status = 2,
      story_point = 2
    }
  }

  // Extract data from Sheets
  data = extractFromActiveSheet(sheet, lastRow, sheetsConfig);

  // Load to BQ
  loadToBq(data, "creationline001", "catseye", "pbi")
  
}

function extractFromActiveSheet(sheet, lastRow, sheetsConfig) {
  var range = sheet.getRange(sheetsConfig["name"]+"!A6:D65536");
  var values = range.getValues();
  var data = new Array();
  
  // Beginning index for this range
  Logger.log(range.getRowIndex());

  for ( var r = 0; r <= (lastRow - range.getRowIndex()); r++ ) {
    Logger.log(values[r][0]);

    data.push({
      pbi_id: values[sheetsConfig["index"]["pbi_id"]],
      title: values[sheetsConfig["index"]["title"]],
      status: values[sheetsConfig["index"]["status"]],
      story_point: values[sheetsConfig["index"]["story_point"]],
      team: sheetsConfig["team"]
    })
  }
}


function loadToBq(data, projectId, datasetId, tableId) {
  // Create the data upload job.
  var job = {
    configuration: {
      load: {
        destinationTable: {
          projectId: projectId,
          datasetId: datasetId,
          tableId: tableId
        },
        skipLeadingRows: 1,
        writeDisposition: "WRITE_TRUNCATE"
      }
    }
  };
  job = BigQuery.Jobs.insert(job, projectId, data);
}
