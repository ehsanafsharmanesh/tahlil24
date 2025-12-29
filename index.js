function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  var data = JSON.parse(e.postData.contents);
  var rows = sheet.getDataRange().getValues();
  
  function createResponse(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  }

  // ورود و دریافت تاریخچه برای تحلیل
  if (data.action === "login") {
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0].toString() === data.code.toString() && rows[i][1].toString() === data.password.toString()) {
        return createResponse({ status: "success", code: data.code, history: rows[i][2] ? JSON.parse(rows[i][2]) : [] });
      }
    }
    return createResponse({ status: "error" });
  }

  // ذخیره و آپدیت تحلیل
  if (data.action === "save") {
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0].toString() === data.code.toString()) {
        var history = rows[i][2] ? JSON.parse(rows[i][2]) : [];
        history.push(data.newData); // اضافه شدن به تحلیل قبلی
        sheet.getRange(i + 1, 3).setValue(JSON.stringify(history));
        return createResponse({ status: "success" });
      }
    }
  }
}
