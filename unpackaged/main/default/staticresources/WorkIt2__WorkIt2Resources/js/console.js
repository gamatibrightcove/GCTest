/*
	Workit! 4 console methods
	copyright 2014, CronSights
*/
var timerPage = 'workit2__workitConsole';
var wiVFHost;

var focusedPtId = '';
var focusedStId = '';

$j = jQuery.noConflict();

$j(document).ready(function(){
    sforce.console.onFocusedPrimaryTab(pTabFocus);
	sforce.console.onFocusedSubtab(sTabFocus);
	sforce.console.addEventListener('vfTabLoad', function(result){vfTabOverride(result)});
	sforce.console.addEventListener('vfTabUnLoad', function(result){vfTabRestore(result)});

	setTimeout("sforce.console.getFocusedSubtabId(sTabFocus);", 500);
});

function vfTabOverride(result) {
	tabId = result.message.split('_')[0];
	url = result.message.split('_')[1];

	f = $j('.timerFrames iframe[tabId=' + tabId + ']');
	f.attr('src', '/apex/' + timerPage + '?uri=' + encodeURIComponent(url));
	f.attr('uriOverride', 'true');
}

function vfTabRestore(result) {
	tabId = result.message;
	f = $j('.timerFrames iframe[tabId=' + tabId + ']');
	f.attr('src', '/apex/' + timerPage + '?uri=' + encodeURIComponent(f.attr('uri')));
	f.attr('uriOverride', 'false');
}

function pTabFocus(result) {
	focusedPtId = result.id;
	sforce.console.getFocusedSubtabId(sTabFocus);
}

function sTabFocus(result) {
	focusedStId = result.id;
	sforce.console.getPageInfo(focusedStId , function(result) {evalFocusedTab(focusedStId, result)});
}

function evalFocusedTab(tabId, result) {
	if (!result.success)
		return;

	if (!wiVFHost) {
		wiVFHost = 'https://' + window.location.host;
	}

	o = jQuery.parseJSON(result.pageInfo);

	$j('.timerFrames iframe').hide();

	f = $j('.timerFrames iframe[tabId=' + tabId + ']');

	if (f.size() == 0) {
		$j('<iframe />', {
			width: '180px', height:'310px',
			src: '/apex/' + timerPage + '?uri=' + encodeURIComponent(o.url),
			frameBorder: '0',
			tabId: tabId,
			uri: o.url,
			uriOverride: 'false'

		}).appendTo('.timerFrames');
	}
	else {
		try {
			f.each(function () {this.contentWindow.frames.wiUniFrame.location.replace(wiVFHost +'/resource/WorkIt2__Workit2Resources/util/uniTabFrame.htm');});
		}
		catch (err) {}
		f.show();
	}
}

function evalAllTabs() {
	$j('.timerFrames iframe').each(function() {
		var tabId = $j(this).attr('tabId');
		if (tabId != 'blank')
			sforce.console.getPageInfo(tabId, function(result) {evalSingleTab(tabId, result)});
	});

	if ($j('.timerFrames iframe:visible').size() == 0) {
		f = $j('.timerFrames iframe[tabId=blank]');
		if (f.size() > 0)
			f.show();
		else {
			$j('<iframe />', {
				width: '180px', height:'310px',
				src: '/apex/' + timerPage + '?uri=blank',
				frameBorder: '0',
				tabId: 'blank',
				uri: 'blank'
			}).appendTo('.timerFrames');
		}
	}
}

function evalSingleTab(tabId, result) {
	if (!result.success)
		$j('.timerFrames iframe[tabId=' + tabId + ']').remove();
	else {
		o = jQuery.parseJSON(result.pageInfo);
		f = $j('.timerFrames iframe[tabId=' + tabId + ']');

		if ((!uriComp(o.url, f.attr('uri'))) && (f.attr('uriOverride') == 'false'))  {
			f.attr('uri', o.url);
			f.attr('src', '/apex/' + timerPage + '?uri=' + encodeURIComponent(o.url));
		}
	}
}

function uriComp(a, b) {
	if (a == b)
		return true;

	s1 = a.match(/(?:https?:\/\/[-\w.]+)?\/(.+)/i)[1];
	s2 = b.match(/(?:https?:\/\/[-\w.]+)?\/(.+)/i)[1];

	if (s1 == s2)
		return true;

	return false;
}


setInterval("evalAllTabs();", 1000);