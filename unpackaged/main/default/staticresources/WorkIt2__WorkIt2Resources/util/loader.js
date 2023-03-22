/*
	Workit! 4 loader methods
	copyright 2013, CronSights
*/

if (!window.addEventListener) {
	//ie8
	window.attachEvent('onload', wiInitTimerFrame);
}
else {
	window.addEventListener('load', wiInitTimerFrame, false);
}

function wiInitTimerFrame() {
	f = document.getElementById('wiFrame');

	if (self == top)
		setTimeout("f.contentWindow.location.replace('/apex/workit2__workitHome');", 1);
}
/*


var wiVFHost;
var wiVFPage = '/apex/workit2__workitHome';
var wiLoadDelay = 1;

var wiTimerLoaded = false;

var wiUniTabEnabled = true;
var wiUniTabFocused = false;
var wiUniTabActivateTO;

function wiInitTimerFrame() {
	f = document.getElementById('wiFrame');

	//f.onload = wiUniTabLoad;
	if (!f.addEventListener) {
		//ie8
		f.attachEvent('onload', wiUniTabLoad);
	}
	else {
		f.addEventListener('load', wiUniTabLoad, false);
	}

	if ((!wiVFHost) && (location.host.indexOf('.my.') == -1)) {
		str = window.location.href + '';
		inst = str.match(/(?:[a-zA-Z0-9\-]*\.)?([a-zA-Z0-9\-]*)\.(?:salesforce\.com|visual\.force\.com)/i)[1];
		if (inst=='emea')
			inst = 'eu0';
		wiVFHost = 'https://workit2.' + inst + '.visual.force.com';
	}
	else
		wiVFHost = '';

	if (self == top)
		setTimeout("f.contentWindow.location.replace(wiVFHost + wiVFPage);", wiLoadDelay);
}

function wiUniTabLoad() {
	wiTimerLoaded = true;

	if (wiUniTabFocused)
		wiUniTabStartTimer();
}

function wiUniTabFocus() {
	wiUniTabFocused = true;

	if (wiTimerLoaded)
		wiUniTabActivateSet();
}

function wiUniTabBlur() {
	clearTimeout(wiUniTabActivateTO);
	//wiUniTabFocused = false;
}

function wiUniTabActivateSet() {
	clearTimeout(wiUniTabActivateTO);
	wiUniTabActivateTO = setTimeout("wiUniTabStartTimer();", 1000);
}

function wiUniTabStartTimer() {
	if (wiUniTabEnabled) {
		try {
			document.getElementById('wiFrame').contentWindow.frames.wiUniFrame.location.replace(wiVFHost +'/resource/WorkIt2__Workit2Resources/util/uniTabFrame.htm');
		}
		catch (err) {wiUniTabEnabled = false;}
	}
}

if (!window.addEventListener) {
	//ie8
	window.attachEvent('onfocus', wiUniTabFocus);
	window.attachEvent('onload', wiInitTimerFrame);
}
else {
	window.addEventListener('focus', wiUniTabFocus, false);
	window.addEventListener('blur', wiUniTabBlur, false);
	window.addEventListener('load', wiInitTimerFrame, false);
}
//vis api
if (document.webkitVisibilityState == 'visible')
	wiUniTabFocused = true;
if (document.visibilityState == 'visible')
	wiUniTabFocused = true;
//safari fix
if ((navigator.userAgent.toLowerCase().indexOf('safari') != -1) && (navigator.userAgent.toLowerCase().indexOf('chrome') == -1))
	wiUniTabFocused = true;
*/