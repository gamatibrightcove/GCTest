/*
	Workit! 4 frontend methods
	copyright 2013, CronSights
	-
*/
var timerEnabled = false;
var sessionSeconds = 0;
var prevSeconds = 0;
var timeoutSeconds = 0;

var crInt = null;
var hbInt = null;
var hbTO = null;
var uniTabActivateTO = null;
var delayedStartTO = null;
var exTimeout;

var delayedStartFired = false;
var timerSoftStopped = false;

var attrSelectorLayout = 'standard';
var attrSelectorNewSessionMode = 'enabled';
var attrSelectorExpandAll = false;

var pollInterval = 10;
var uniTabOn = false;
var consoleOn = false;
var autoStartDelay = 0;

$j = jQuery.noConflict();

$j(document).ready(function(){

	//layoutSizeComponents();

	if ((!(uniTabOn)) || (consoleOn))
		startTimer(2);

	//xVS
	/*
	$j(window).focus(function() {
		if ((uniTabOn) && (!(consoleOn)))
			uniTabSetActivateTimeout();
	});
	*/

	//VS
	if ((!document.hidden) && (uniTabOn) && (!(consoleOn)))
			uniTabSetActivateTimeout();

	$j(document).on('visibilitychange', function () {
		if ((uniTabOn) && (!(consoleOn)))
			if (!document.hidden)
				uniTabSetActivateTimeout();
			else
				uniTabClearActivateTimeout();

	});
	//


	/*
	$j(window).resize(function() {
		layoutSizeComponents();
	});
	*/

	$j(window).blur(function() {
		if (attrSelectorLayout != 'expanded')
			$j('.typeSelectorMenu').fadeOut();

	});

	$j(window).keydown(function(event) {
		if (event.which == 27) {
			commentsCancel();
			if (attrSelectorLayout != 'expanded')
				$j('.typeSelectorMenu').fadeOut();
		}
	});

	$j('.totalTimer .value').text(FormatTime(prevSeconds));

	if (attrSelectorNewSessionMode != 'enabled')
		$j('.typeSelectorMenu li.item div.controls input.btn').hide();


	$j(window).unload( function () {
		if (hbStatus() == 'On')
			xHeartBeat();
	});

	if (timelessMode) {
		$j('.wComponent.sessionTimer').hide();
		$j('.wComponent.totalTimer').hide();
		$j('.btn.stopButton').val('Stop Session')
		$j('.btn.startButton').val('Start Session')
	}

});

var uniTabFrameLoaded = false;

function uniTabFrameLoad() {
	if (!uniTabFrameLoaded) {
		uniTabFrameLoaded = true;
	}
	else {
		$j('.hiddenStartBtn').click();
	}
}


function setSelectedSessionType(id, name) {
	$j('.sessionTypeId').val(id);
	$j('.sessionType').val(name);
	$j('.typeSelector .value').text(name);
	selectorEvalSelected(id);
}

function switchSessionType(id, name) {
	hbPause();
	setSelectedSessionType(id, name);
	xUpdateSessionType();
}

function newSession(id, name) {
	hbStop();
	crClearInterval();
	controlsStopIssued();
	$j('.sessionTimer .value').text(FormatTime(0));
	$j('.newSessionTypeId').val(id);
	setSelectedSessionType(id, name);
	xRestartTimer();
}

function setSessionComment(c) {
	if ((c == '') || (!c)) {
		$j('.comments .value').text('click to add a comment');
		$j('.sessionComment').val('');
	}
	else {
		$j('.comments .value').text(c);
		$j('.sessionComment').val(c);
	}
}

function updateSessionComment(c) {
	setSessionComment(c);
	hbPause();
	xUpdateComment();
}


function Color(t, c) {
	var e;
	if (t == 'session')
		e = $j('.sessionTimer .colorBar');
	else
		e = $j('.totalTimer .colorBar');

	cc = '#83e09d';

	switch(c) {
		case 'Grey':
			cc = '#e8eaea';
			break;

		case 'Green':
			cc = '#83e09d';
			break;

		case 'Yellow':
			cc = '#ffdd53';
			break;

		case 'Red':
			cc = '#d48888';
			break;

		case 'Orange':
			cc = '#eeb009';
			break;

		case 'Blue':
			cc = '#428df3';
			break;

		case 'Violet':
			cc = '#c6a4d6';
			break;
	}

	e.css('background', cc);
}

function crInterval() {
	if (crInt == null) {
		crIncrement();
		crInt = setInterval("crIncrement()", 1000);
	}
}

function crClearInterval() {
	clearInterval(crInt);
	crInt = null;
}

function crIncrement() {
	$j('.sessionTimer .value').text(FormatTime(sessionSeconds));
	$j('.totalTimer .value').text(FormatTime(sessionSeconds + prevSeconds));
	sessionSeconds++;
}

function hbStart() {
	clearTimeout(hbTO);
	hbTO = setTimeout("hbTimedOut();", 45000);

	if (hbInt == null)
		hbInt = setInterval("xHeartBeat();", pollInterval * 1000);
}

function hbStop() {
	clearTimeout(hbTO);
	hbTO = null;
	clearInterval(hbInt);
	hbInt = null;
}

function hbPause() {
	clearInterval(hbInt);
	hbInt = null;
}

function hbStatus() {
	if ((hbInt == null) && (hbTO == null))
		return 'Off';
	else if (hbInt == null)
		return 'Paused';
	else
		return 'On';
}

function hbTimedOut() {
	hbStop();
	crClearInterval();
	controlsStopSuccessful();
}

function hbCallback(en, on, sSecs, tSecs, eSecs, sColor, tColor, stId, stName, cmt) {

	clearInterval(hbInt);
	hbInt = setInterval("xHeartBeat();", pollInterval * 1000);

	if (hbStatus() == 'On') {
		if ((!(en)) || (!(on)) || timerSoftStopped) {
			hbStop();
			crClearInterval();
			controlsStopSuccessful();
			return;
		}

		if ((Math.abs(sSecs - sessionSeconds) > 5) || (sessionSeconds == 0))
			sessionSeconds = sSecs;

		if ((Math.abs(tSecs - prevSeconds) > 5) || (prevSeconds == 0))
			prevSeconds = tSecs;

		setSelectedSessionType(stId,stName);
		setSessionComment(cmt);
		Color('session', sColor);
		Color('total', tColor);

		snExpEval(eSecs);
	}

	if (hbStatus() != 'Off')
		hbStart();
}

function snStartCallback(en, on, sSecs, tSecs, eSecs, sColor, tColor, stId, stName, cmt) {
	if ((!(en)) || timerSoftStopped)
		return;

	if (!(on)) {
		if ((autoStartDelay > 0) && (!delayedStartFired))
			delayedStartTimeout(autoStartDelay);
		else
			snEndCallback();

		crClearInterval();
		return;
	}

	sessionSeconds = sSecs;
	prevSeconds = tSecs;

	setSelectedSessionType(stId,stName);
	setSessionComment(cmt);
	Color('session', sColor);
	Color('total', tColor);

	hbStart();
	crInterval();
	snExpEval(eSecs);

	controlsStartSuccessful();
}

function snEndCallback() {
	controlsStopSuccessful();
}

function snExpTimeout(secs) {
	clearTimeout(exTimeout);

	if (secs < 1) {
		$j('.expirationDialog').hide();
		stopTimer(false);
		return;
	}

	if (secs < 60) {
		$j('.expirationDialog').show();
		$j('.expirationDialog .value').text('Your session will end in ' + secs + ' seconds');
	}
	else
		$j('.expirationDialog').hide();

	exTimeout = setTimeout("snExpTimeout(" + --secs + ");", 1000);
}

function snExpReset() {
	snExpTimeout(timeoutSeconds);
}

function snExpEval(secs) {
	if (secs == 0) {
		clearTimeout(exTimeout);
		$j('.expirationDialog').hide();
	}
	else if ((secs > 0) && (secs != timeoutSeconds)) {
		clearTimeout(exTimeout);
		timeoutSeconds = secs;
		snExpTimeout(secs);
	}
}

function startTimer(v) {
	// console.log('startTimer v',v);
	// console.log('autoStartDelay',autoStartDelay);
	uniTabClearActivateTimeout();
	delayedStartClearTimeout();
	hbStop();
	controlsStartIssued();
	timeoutSeconds = 0;

	// console.log('startTimer',timerEnabled);
	if (!(timerEnabled))
		return;

	if (timerSoftStopped)
		sessionSeconds = 0;

	timerSoftStopped = false;

	switch(v) {
		 case 1:
			xStartTimer1();
			break;
		 case 2:
			if (autoStartDelay != 0)
				xStartTimer2();
			else
				xStartTimer1();
			break;
		case 3:
			xStartTimer3();
			break;
	}
}

function stopTimer(v) {
	hbStop();
	crClearInterval();
	uniTabClearActivateTimeout();
	controlsStopIssued();

	if (v)
		timerSoftStopped = true;

	xStopTimer();
}

function controlsStartIssued() {
	$j('.delayButtons').fadeOut('fast', function() {$j('.stopStartButtons').show()});
	$j('.startButton').attr("disabled", "disabled");
}

function controlsStartSuccessful() {
	controlsToggleStopStart(false);
	selectorBind();
	commentsBind();
}

function controlsStopIssued() {
	$j('.stopButton').attr("disabled", "disabled");
}

function controlsStopSuccessful() {
	Color('session', 'Grey');
	Color('total', 'Grey');
	controlsToggleStopStart(true);
	selectorUnBind();
	commentsUnBind();
}

function controlsDealyStarted() {
	$j('.stopStartButtons').hide();
	$j('.startButton').hide();
	$j('.delayButtons').fadeIn('fast');
}

function controlsDealyCanceled() {
	$j('.delayButtons').fadeOut('fast', function() {$j('.stopStartButtons').show()});
	setTimeout("controlsToggleStopStart(true);", 500);
}

function controlsToggleStopStart(v) {
	if (v) {
		$j('.startButton').removeAttr("disabled");
		//$j('.stopButton').fadeOut('fast', function() {$j('.startButton').fadeIn('slow')});
		$j('.stopButton').hide();
		$j('.startButton').fadeIn('slow')

	}
	else {
		$j('.stopButton').removeAttr("disabled");
		$j('.startButton').fadeOut('fast', function() {$j('.stopButton').fadeIn('slow')});
	}
}

function selectorExpandGroup(g) {
	g.removeClass('collapsed');
}

function selectorCollapseGroup(g) {
	g.addClass('collapsed');
}

function selectorSetSelected(id) {
	$j('.typeSelectorMenu li.item').removeClass('selected');
	i = $j('.typeSelectorMenu li.item#' + id);
	i.addClass('selected');
}

function selectorEvalSelected(id) {
	i = $j('.typeSelectorMenu li.item#' + id);
	if (!(i.hasClass('selected')))
		selectorScrollToSelected(id);
}

function selectorScrollToSelected(id) {
	selectorSetSelected(id);

	g = i.parents('.typeSelectorMenu li.group');
	selectorExpandGroup(g);

	m = $j('.typeSelectorMenu .options');
	m.scrollTop(m.scrollTop() + i.position().top);
}

function selectorBind() {
	if ($j('.typeSelector').hasClass('en'))
		return;

	selectorUnBind();

	$j('.typeSelector').addClass('en');

	$j('.typeSelector').click(function() {
		h = 0;
		t = $j('.typeSelector');
		m = $j('.typeSelectorMenu');
		m.height($j(window).height());
		m.offset({top: 0, left: 0});
		m.fadeIn();
		selectorScrollToSelected($j('.sessionTypeId').val());
	});

	$j('.typeSelectorMenu li.item').click(function(event) {
		id = $j(this).attr('id');
		name = $j(this).children('div.caption').text();

		selectorSetSelected(id);
		switchSessionType(id, name);

		if (attrSelectorLayout != 'expanded')
			$j('.typeSelectorMenu').fadeOut();
	});

	$j('.typeSelectorMenu li.item div.controls input.btn').click(function(event) {
		id = $j(this).parents('li.item').attr('id');
		name = $j(this).parents('li.item').children('div.caption').text();

		selectorSetSelected(id);
		newSession(id, name);

		event.stopPropagation();

		if (attrSelectorLayout != 'expanded')
			$j('.typeSelectorMenu').fadeOut();
	});

	$j('.typeSelectorMenu li.item div.controls input.btn').mouseover(function(event) {
		$j(this).parents('li.item').addClass('newSession');
	});

	$j('.typeSelectorMenu li.item div.controls input.btn').mouseout(function(event) {
		$j(this).parents('li.item').removeClass('newSession');
	});


	$j('.typeSelectorMenu li.group div.caption').click(function(event) {
		g = $j(this).parent();

		if (g.hasClass('collapsed'))
			selectorExpandGroup(g);
		else
			selectorCollapseGroup(g);
	});


	$j('.typeSelectorMenu').mousewheel(function(event,delta){
	   o = $j('.typeSelectorMenu .options');

		if (delta > 0)
	        o.scrollTop(o.scrollTop() - 40);
	    else
	    	o.scrollTop(o.scrollTop() + 40);
		event.preventDefault();
	});
}

function selectorUnBind() {
	$j('.typeSelectorMenu').hide();
	$j('.typeSelector').removeClass('en');
	$j('.typeSelector').unbind();
	$j('.typeSelectorMenu').unbind();
	$j('.typeSelectorMenu').unmousewheel();
	$j('.typeSelectorMenu li.item').unbind();
	$j('.typeSelectorMenu li.item div.controls input.btn').unbind();
	$j('.typeSelectorMenu li.group  div.caption').unbind();
}

function commentsBind() {
	if ($j('.comments').hasClass('en'))
		return;

	var c = $j('.commentsEditor');
	var t = $j('.commentsEditor textarea');

	$j('.comments').addClass('en');

	$j('.comments').click(function() {
		z = $j('.workitTimer');
		//c.height(z.outerHeight());
		c.height($j(window).height() - 40);
		c.offset({top: 0, left: 0});

		t.val('');
		t.val($j('.sessionComment').val());

		c.fadeIn();
		t.focus();
	});

	t.keydown(function(event) {
		if (event.which == 13)
			commentsSave();
		else if (event.which == 27)
			commentsCancel();
		else if ((t.val().length > 249) && (event.which != 8) && (event.which != 46))
			return false;

		event.stopImmediatePropagation();
	});
}

function commentsUnBind() {
	$j('.commentsEditor').hide();

	$j('.comments').removeClass('en');

	if ($j('.sessionComment').val() == '')
		$j('.comments .value').text('');

	$j('.comments').unbind();
	$j('.commentsEditor textarea').unbind();
}

function commentsSave() {
	updateSessionComment($j('.commentsEditor textarea').val());
	$j('.commentsEditor').fadeOut();
}

function commentsCancel() {
	$j('.commentsEditor').fadeOut();
}

function uniTabSetActivateTimeout() {
	if (uniTabActivateTO == null)
		uniTabActivateTO = setTimeout("uniTabActivate();", 500);
}

function uniTabClearActivateTimeout() {
	clearTimeout(uniTabActivateTO);
	uniTabActivateTO = null;
}

function uniTabActivate() {
	//if ((timerSoftStopped) || (delayedStartTO != null))
	if ((delayedStartTO != null) && uniTabOn) {
		xPushDelay();
		return;
	}

	if (timerSoftStopped)
		return;

	delayedStartClearTimeout();
	delayedStartFired = false;

	startTimer(2);
}

function delayedStartTimeout(s) {
	if (s < 0) {
		delayedStartClearTimeout();
		return;
	}

	controlsDealyStarted();

	$j('.typeSelector .value').text('starting timer in ' + s + ' seconds');

	if (s == 0) {
		delayedStartClearTimeout();
		$j('.typeSelector .value').text('');
		delayedStartFired = true;
		startTimer(3);
	}
	else {
		delayedStartTO = setTimeout("delayedStartTimeout(" + --s + ");",1000);
	}
}

function delayedStartClearTimeout() {
	clearTimeout(delayedStartTO);
	delayedStartTO = null;
}

function delayedStartCancel() {
	$j('.typeSelector .value').text('');
	timerSoftStopped = true;
	delayedStartClearTimeout();
	controlsDealyCanceled();
}

function layoutSizeComponents() {
	if (attrSelectorLayout == 'expanded') {
		t = $j('.typeSelector');
		m = $j('.typeSelectorMenu');
		z = $j('.workitTimer');

		h = $j(window).height() - (z.outerHeight() - t.outerHeight()) - 15;
			t.outerHeight(h);
			m.width(t.outerWidth());
			m.outerHeight(t.outerHeight());
			m.offset(t.offset());
			m.show();
	}
}

function FormatTime(d) {
	hours = Math.floor(d / 3600);
	mins = Math.floor((d % 3600) / 60);
	secs = (d % 60);
	return Zero(hours) + "h " + Zero(mins) + "m " + Zero(secs) + "s";
}

function Zero(n) {
	if (n < 10)
		return "0" + n;
	else
		return n;
}