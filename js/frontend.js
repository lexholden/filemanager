/**
 * Contains the library of generic frontend functions.
 */
var ipc = require('ipc');
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var $ = jQuery = require('jquery');
var BrowserWindow = remote.require('browser-window');

$(document).ready(function() {

	$(".nav-tabs").on("click", "a", function(e){
		  e.preventDefault();
		  console.log(this);
		  $(this).tab('show');
		})
		.on("click", "span", function () {
			var anchor = $(this).siblings('a');
			$(anchor.attr('href')).remove();
			$(this).parent().remove();
			$(".nav-tabs li").children('a').first().click();
		});

		$('.add-tab').click(function(e) {
			e.preventDefault();
			tabAdd('#tabs', 'untitled *', '<content-pane name="Welcome to the music"></content-pane>', true);
			//addTab("untitled *", "Hello");
			$(this).tab('show');
	});

	window.addEventListener("resize", handleWindowResize);
	setSlideWidth(getSetting('winEntityPaneWidth'));
	if (isDebugMode()) {setDebugMode(); }
	document.addEventListener('contextmenu', function(e) {
		elementx = e.pageX;
		elementy = e.pageY;
		e.preventDefault();
		contextmenu.popup(remote.getCurrentWindow());
	})

	ipc.on('ping', function(message) { console.log(message)	})

});

var elementx = 0;
var elementy = 0;
var contextmenu = new Menu();

contextmenu.append(new MenuItem({ label: 'Toggle DevTools', click: function() { ipc.send('window:devtools'); }, visible: false }));
contextmenu.append(new MenuItem({ label: 'Inspect Element', click: function() { ipc.send('window:devtools', [elementx,elementy]); }, visible: false }));
contextmenu.append(new MenuItem({ label: 'Log Platform Properties', click: logPlatformProperties, visible: false }));
contextmenu.append(new MenuItem({ type: 'separator', visible: false }));
contextmenu.append(new MenuItem({ label: 'Edit', sublabel: "String"}));
contextmenu.append(new MenuItem({ label: 'Delete'}));
contextmenu.append(new MenuItem({ label: 'Favourite'}));
contextmenu.append(new MenuItem({ type: 'separator' }));
contextmenu.append(new MenuItem({ label: 'Mind Map View'}));
contextmenu.append(new MenuItem({ type: 'separator' }));

var icons = ["accessibility", "account-balance", "query-builder", "explore", "loyalty", "drive-keep", "android", "keep", "extension", "account-child"]
var words = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
var word = words.split(' ');

window.$$ = function (that, selector) {  /*console.log(that); console.log(selector);*/ return $(that.shadowRoot.querySelectorAll(selector)); }

function isDebugMode() { return ipc.sendSync('settings:isDebugMode'); }
function debug(text, display) { ipc.send('log', text); if (display) {console.log(text)}; } // Send a log message to the backend logger
function getSetting(setting) { return ipc.sendSync('setting:get', setting); } // gets a setting from our backend
function handleWindowResize() {setSetting('winDimensions', [window.innerWidth, window.innerHeight + 30]); } // Save our new window settings when we resize
function setSetting(setting, value) { ipc.send('setting:set', [setting, value]); } // sets a setting in our backend
function setSettings(settings) {ipc.send('settings:set', settings); } // sets an object filled with settings and saves them all
function setSlideWidth(width) {	$('#pane-left').css('width', width); } // Sets the width of the left pane
window.onblur = function() {document.body.className = 'blurred';} // Triggered when the window loses focus.
window.onfocus = function() {document.body.className = 'focused';} // Triggered when the window gains focus.
function generateResourceID() { return ipc.sendSync('wiki:generateID'); }
function getProjectName() { return ipc.sendSync('project:getName'); }
function getProjectDesc() { return ipc.sendSync('project:getDesc'); }
function getScene(id) { return ipc.sendSync('chapter:getScene', id); }

function generateRandomWord() { return word[Math.floor(Math.random() * word.length)]; }
function generateRandomWords(number) { 
	var words = ""; 
	for (var i = 0; i < number; i++) { 
		words += " " + generateRandomWord(); 
		if (Math.random() > 0.95) {
			words += "";
		}; 
	}; 
	return words + "." 
}
function getRandomIcon() { return icons[Math.floor(Math.random() * icons.length)]; }
function getIcon(thing) { var icon = getSetting("icon" + thing); return (icon === undefined || icon == null || icon.length <= 0) ? getSetting("iconDefault") : icon; }

/**
 * Sets the view type for our entity region
 * @param  {[int]} value [0, 1 or 2 - determines which view to display]
 */
function toggleEntityView(value) {
	switch (value) {
		case 0: $('#entity-region').html("<entity-list show='all' id='entity-list' unresolved></entity-list>"); break;
		case 1: $('#entity-region').html("<cicero-entitytree show='all' id='entity-tree' content'{{entityList}}' unresolved></entity-tree>"); break;
		case 2: $('#entity-region').html(""); break;
		default: toggleEntityView(0);
	}
}

/**
 * toggles or sets whether the entity pane is max width.
 * @param  {[boolean]} setMax [optional: true sets fullscreen, false resumes normal width, otherwise, toggles existing setting]
 */
function toggleFullWidth(setMax) {
	if (typeof setMax != 'boolean') {toggleFullWidth(!getSetting('winEntityPaneMax'))}
	else {
		$('#pane-left').css('width', setMax ? '100%' : getSetting('winEntityPaneWidth'));
		$('#pane-right').toggleClass('hidden', setMax);
		$('#main-splitter').toggleClass('hidden', setMax);
		setSetting('winEntityPaneMax', setMax);
	}
}

/**
 * Enable various frontend features relating to debugMode
 */
function setDebugMode() {
	contextmenu.items[0].visible = true;
	contextmenu.items[1].visible = true;
	contextmenu.items[2].visible = true;
	contextmenu.items[3].visible = true;
}

/**
 * Opens or closes the quick info pane.
 * @param  {[boolean]} val [optional: whether we want to open or close. Toggles if not specified.]
 * @return {[boolean]}     [Whether the panel ends open or closed]
 */
function toggleQuickInfoPane(val) {
	if (val === undefined) {
		toggleQuickInfoPane(!getSetting('winQuickInfoVisible'));
	} else {
		setSetting('winQuickInfoVisible', val);
		$('#quick-info').css('opacity', val ? "1" : "0");
		$('#quick-info').css('width', val ? "300px" : "0px");
		$('#content-pane').css('width', val ? "calc(100% - 300px)" : "100%");
		return val;
	}
}

function logPlatformProperties() {
	console.log(navigator.appCodeName)
	console.log(navigator.appName)
	console.log(navigator.appVersion)
	console.log(navigator.cookieEnabled)
	console.log(navigator.geolocation)
	console.log(navigator.location)
	console.log(navigator.language)
	console.log(navigator.onLine)
	console.log(navigator.platform)
	console.log(navigator.product)
	console.log(navigator.userAgent)
	console.log(navigator.javaEnabled())
	console.log(navigator.userAgent())

	console.log(process.type)
	console.log(process.versions)
	console.log(process.resourcesPath)
}

/*--------------      UNUSED       ------------*/

function addTab(name, content) {
	debug("We're adding a tab: " + name);
	var id = $(".nav-tabs").children().length; //think about it ;)
	$("#btnNewTab").before('<li><a href="#contact_'+id+'">' + name + '</a><span>x</span></li>');         
	$('.tab-content').append('<div class="tab-pane" id="contact_'+id+'">'+ content +'</div>');
}

function tabAdd(sel, label, content, show){
	var id = $(".nav-tabs").children().length; //think about it ;)
	var tabs = $(sel);
	$('div.active', tabs).removeClass('in').add($('li.active', tabs)).removeClass('active');
	$('.tab-content', tabs).append('<div class="tab-pane in active" id="'+id+'">'+ content +'</div>');
	$("#btnNewTab").before('<li><a href="#'+id+'" data-toggle="tab">'+label+'</a><span>x</span></li>');
	if(show==true) $('.nav-tabs a:last').tab('show');
}

var colours = ["F7977A","F9AD81","FDC68A","FFF79A","C4DF9B","A2D39C","82CA9D","7BCDC8","6ECFF6","7EA7D8","8493CA","8882BE","A187BE","BC8DBF","F49AC2","F6989D", "b3e5fc", "FFF", "FFF", "FFF", "FFF", "FFF", "FFF", "FFF", "FFF", "FFF"];

function getRandomColour() {
	return "#" + colours[Math.floor(Math.random() * colours.length)];
}
