
var nfc = require('ti.nfc');
var nfcAdapter = null;

$.index.addEventListener('open', function(e) {
	// Must wait until the activity has been opened before setting up NFC
	setupNfc();
});

// Force the instructions into the data area
onClear({});

$.index.open();

function setupNfc() {
	// Create the NFC adapter to be associated with this activity. 
	// There should only be ONE adapter created per activity.
	nfcAdapter = nfc.createNfcAdapter({
		onNdefDiscovered: handleDiscovery,
		onTagDiscovered: handleDiscovery,
		onTechDiscovered: handleDiscovery
	});
	
	$.instructions.text = 'Scan please';
	// It's possible that the device does not support NFC. Check it here
	// before we go any further.
	if (!nfcAdapter.isEnabled()) {
		alert('NFC is not enabled on this device');
		return;
	}
	
	// All tag scans are received by the activity as a new intent. Each
	// scan intent needs to be passed to the nfc adapter for processing.
	var act = Ti.Android.currentActivity;
	act.addEventListener('newintent', function(e) {
		nfcAdapter.onNewIntent(e.intent);
	});
}

function handleDiscovery(e) {
	// Add rows for the message, tag, and each of the records
	$.instructions.text = 'handleDiscovery';
//	Ti.API.info(JSON.stringify(e));
	var data = [];
	data.push(Alloy.createController('rowMessage', { action: e.action }).getView());
	data.push(Alloy.createController('rowTag', { tag: e.tag }).getView());
	if (e.messages) {
		var message = e.messages[0];
		if (message.records) {
			var i, len;
			for (i=0, len=message.records.length; i<len; i++) {
				data.push(Alloy.createController('rowRecord', { record: message.records[i] }).getView());
			}
		}
	}
	$.instructions.zIndex = -10000;
	$.records.setData(data);
	alert("Scan complete");
};

function onClear(e) {
	$.records.setData([]);
	$.instructions.text = 'Please Scan';
	$.instructions.zIndex = 10000;
}


