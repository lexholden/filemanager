/**
 *  Controls the menu at the top of the application.
 */
(function() {

	var ApplicationMenu, Menu, MenuItem, debug;

	debug = require('./debug');

	Menu = require('menu');
	MenuItem = require('menu-item');

	EventEmitter = require('events').EventEmitter;
	_ = require('underscore-plus');

	module.exports = ApplicationMenu = (function() {
		_.extend(ApplicationMenu.prototype, EventEmitter.prototype);

		function ApplicationMenu(settings) {
			this.menu = Menu.buildFromTemplate(loadApplicationMenuItems());
			Menu.setApplicationMenu(this.menu);
		}

		function loadApplicationMenuItems() {
			var menuTemplate = [
				{ label: 'Cicero', submenu: [
					{ label: 'Cicero', selector: 'orderFrontStandardAboutPanel:' },
					{ label: 'Website', click: function() {	FMWindow.websiteDialog()} },
					{ label: 'Message', click: function() {	FMWindow.mainWindow.webContents.send('ping', 'whoooooooh!');} },
					{ type: 'separator' },
					{ label: 'Preferences', accelerator: 'Command+P', click: function() { FMApplication.createDialog('settings:preferences')} },
					{ label: 'Services', submenu: [] },
					{ type: 'separator' },
					{ label: 'Hide Atom Shell', accelerator: 'Command+H', selector: 'hide:' },
					{ label: 'Hide Others', accelerator: 'Command+Shift+H', selector: 'hideOtherApplications:' },
					{ label: 'Show All', selector: 'unhideAllApplications:' },
					{ type: 'separator' },
					{ label: 'Quit', accelerator: 'Command+Q', command: 'quit:' },
				]},
				{ label: 'Project', submenu: [
					{label: 'New Chapter', accelerator: 'Command+N', click: function(){ FMApplication.project.createChapter("untitled", FMApplication.project.chapters.length, true); }},
					{ type: 'separator' },
					{label: 'New Project', accelerator: 'Shift+Command+N', click: function() { FMApplication.createDialog('new:project'); }},
					{label: 'Save Project', accelerator: 'Command+S', click: function() { FMApplication.project.saveProject(); }},
					{label: 'Open Project', accelerator: 'Command+O', click: function(){ FMApplication.createDialog('open:project'); }},
					{label: 'Recent Projects', submenu: [] },
					{ type: 'separator' },
					{label: 'Project Info', accelerator: 'Command+I', click: function() { FMApplication.project.alertInfo(); }},
					{label: 'Project Statistics', accelerator: 'Command+P', click: function() { FMApplication.project.alertInfo(); }},
				]},
				{ label: 'Wiki', submenu: [
					{label: 'New Entry', accelerator: 'Shift+Command+E', click: function() { FMApplication.createDialog('new:project'); }},
					{label: 'Open Wiki', accelerator: 'Shift+Command+O', click: function(){ FMApplication.createDialog('open:project'); }},
					{label: 'New Wiki', accelerator: 'Shift+Command+W', click: function(){ FMApplication.createDialog('new:wiki'); } }
				]},
				{ label: 'Edit', submenu: [
					{ label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
					{ label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
					{ type: 'separator' },
					{ label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
					{ label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
					{ label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
					{ label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' },
				]},
				{ label: 'Views', submenu: [
					{ label: 'Reload', accelerator: 'Command+R', click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); } },
					{ label: 'Toggle DevTools', accelerator: 'Alt+Command+I', click: function() { FMApplication.window.toggleDevTools(); } },
				]},
				{ label: 'Window', submenu: [
					{ label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
					{ label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
					{ type: 'separator' },
					{ label: 'Bring All to Front', selector: 'arrangeInFront:' },
				]},
				{ label: 'Help', submenu: [] }
			];

			if (loadRecentProjects()) { // @TODO This doesn't work
				var projects = loadRecentProjects();
				for (var i in projects) {
					menuTemplate[1].submenu[5].submenu.push({
						label: projects[i], 
						click: function() {Cicero_Project.openProjectUrl(projects[i])}
					});
				}
				//debug.trace(JSON.stringify(menuTemplate));
			}

			return menuTemplate;
		}

		function loadRecentProjects() {
			return FMSettings.getSetting('recentProjects');
		}

		ApplicationMenu.prototype.translateTemplate = function(template, keystrokesByCommand) {
			template.forEach
		};

	return ApplicationMenu;

  	})();

}).call(this);