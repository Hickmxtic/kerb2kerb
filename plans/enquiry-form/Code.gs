// Kerb2Kerb enquiry form backend — Google Apps Script web app.
// Receives the site's enquiry form as JSON, appends a row to the
// "Enquiries" sheet, and emails James. Deployed by James in his own Google
// account (steps in SETUP.md next to this file).

var NOTIFY_EMAIL = 'james@kerb2kerb.co.uk';
var SHEET_NAME = 'Enquiries';
// Only needed if this script was created at script.google.com rather than
// from inside the sheet (Extensions -> Apps Script). Paste the long ID from
// the sheet's URL: https://docs.google.com/spreadsheets/d/<THIS PART>/edit
var SHEET_ID = '';

var COLUMNS = [
  'received', 'name', 'whatsapp', 'job_type', 'pickup', 'dropoff',
  'bags_or_load', 'preferred_date', 'preferred_time', 'quoted_price',
  'notes', 'source', 'page'
];

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ ok: false, error: 'bad json' });
  }

  var sheet = getSheet();
  var row = COLUMNS.map(function (col) {
    if (col === 'received') return new Date();
    return data[col] == null ? '' : String(data[col]).slice(0, 500);
  });
  sheet.appendRow(row);

  var subject = 'Kerb2Kerb enquiry: ' + (data.job_type || 'job') +
    (data.quoted_price ? ' — ' + data.quoted_price : '');
  var body = COLUMNS.filter(function (c) { return c !== 'received'; })
    .map(function (c) { return c + ': ' + (data[c] || ''); })
    .join('\n');
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

  return respond({ ok: true });
}

// Lets the site check the endpoint is alive without submitting anything.
function doGet() {
  return respond({ ok: true, service: 'kerb2kerb-enquiries' });
}

function getSheet() {
  var ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
