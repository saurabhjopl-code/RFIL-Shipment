/**
 * RFIL Shipment Apps Script Backend (Skeleton)
 * Add your logic: read/write Sheets, locking, validation, exports.
 */

function doGet(e) {
  return ContentService.createTextOutput("RFIL Shipment API");
}

function startPacking(shipmentId, packerEmail, deviceId) {
  // TODO: implement logic with LockService and Sheets
}

function postScan(scanPayload) {
  // TODO
}

function closeBox(shipmentId, boxIndex) {
  // TODO
}

function submitShipment(shipmentId) {
  // TODO
}

function confirmShipment(shipmentId, enteredDraftId) {
  // TODO
}

function getShipmentSnapshot(shipmentId) {
  // TODO
}
