/**
 * RFIL Shipment - Minimal Apps Script Backend
 * Replace SHEET_ID with your Google Sheet ID (the xlsx uploaded to Drive and converted to Google Sheets)
 *
 * Endpoints:
 *  - GET ?action=listShipments
 *  - POST {action: 'postScan', data: {...} }
 *  - POST {action: 'submitShipment', shipmentId: 'BLR5-...'} 
 */

const SHEET_ID = '1YdcOKOWGEHZA1pPHX-FmwV5cXAdyfSmfOt7PevwaJj4'; // <- update this

function doGet(e) {
  var action = e.parameter.action || '';
  if (action == 'listShipments') return listShipments();
  return jsonOut({error: 'unknown action'});
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var action = body.action || '';
    if (action == 'postScan') return postScan(body.data);
    if (action == 'submitShipment') return submitShipment(body.shipmentId);
    if (action == 'createShipment') return createShipment(body.data);
    return jsonOut({error: 'unknown action'});
  } catch (err) {
    return jsonOut({error: 'invalid request', details: String(err)});
  }
}

function ss() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function listShipments() {
  var sh = ss().getSheetByName('shipments_master');
  var data = sh.getDataRange().getValues();
  if (data.length <= 1) return jsonOut([]);
  var header = data[0];
  var rows = [];
  for (var i=1;i<data.length;i++) {
    var r = data[i];
    var obj = {};
    for (var j=0;j<header.length;j++) obj[header[j]] = r[j];
    rows.push(obj);
  }
  return jsonOut(rows);
}

function postScan(payload) {
  if (!payload || !payload.shipmentId || !payload.fnsku) {
    return jsonOut({error: 'missing fields in scan payload'});
  }
  var sh = ss().getSheetByName('scanlines');
  var now = new Date();
  var scanId = payload.scan_id || Utilities.getUuid();
  sh.appendRow([scanId, payload.shipmentId, payload.box_id || '', payload.fnsku, payload.qty || 1, payload.scanned_by || Session.getActiveUser().getEmail(), now.toISOString()]);
  return jsonOut({success: true, scan_id: scanId});
}

function submitShipment(shipmentId) {
  if (!shipmentId) return jsonOut({error: 'shipmentId required'});
  var sh = ss().getSheetByName('shipments_master');
  var data = sh.getDataRange().getValues();
  var header = data[0];
  var idIdx = header.indexOf('shipment_id');
  var statusIdx = header.indexOf('status');
  var submittedAtIdx = header.indexOf('submitted_at');
  for (var i=1;i<data.length;i++) {
    if (String(data[i][idIdx]) == String(shipmentId)) {
      data[i][statusIdx] = 'Submitted';
      data[i][submittedAtIdx] = new Date().toISOString();
      sh.getRange(i+1,1,1,header.length).setValues([data[i]]);
      return jsonOut({success: true, shipmentId: shipmentId});
    }
  }
  return jsonOut({error: 'shipment not found'});
}

function createShipment(data) {
  if (!data || !data.shipment_id) return jsonOut({error: 'shipment_id required'});
  var sh = ss().getSheetByName('shipments_master');
  sh.appendRow([data.shipment_id, data.location || '', data.created_by || Session.getActiveUser().getEmail(), data.created_at || new Date().toISOString(), data.total_qty_expected || '', data.status || 'Draft', data.working_by || '', data.submitted_at || '', data.packing_id || '', data.notes || '']);
  return jsonOut({success: true, shipment_id: data.shipment_id});
}
