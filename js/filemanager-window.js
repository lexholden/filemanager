(function() {

	var FileManager_Window, BrowserWindow, Screen, app, debug, os, ipc;

	BrowserWindow = require('browser-window');
	Menu = require('menu');
	Tray = require('tray');
	Screen = require('screen');

	app = require('app');
	debug = require('./debug');
	os = require('os');
	ipc = require('ipc');

	EventEmitter = require('events').EventEmitter;
	_ = require('underscore-plus');

	module.exports = FileManager_Window = (function() {
		_.extend(FileManager_Window.prototype, EventEmitter.prototype);

		FileManager_Window.prototype.mainWindow = null;

		function FileManager_Window(args) {
			global.FMWindow = this;
			this.mainWindow = new BrowserWindow({
				"x": FMSettings.getSetting('winXY')[0],
				"y": FMSettings.getSetting('winXY')[1],
				"width": FMSettings.getSetting('winDimensions')[0], 
				"height": FMSettings.getSetting('winDimensions')[1], 
				"min-width": 800,
				"min-height": 1000,
				"kiosk": false,
				"fullscreen": FMSettings.getSetting('winFullscreen'),
				"title": "FileManager"
			});
			this.mainWindow.loadUrl('file://' + __dirname + '/../index.html');

			this.handleEvents();
			this.loadTrayButton();
			this.setDockBadge("v" + app.getVersion())
			//var size = Screen.getPrimaryDisplay().workAreaSize;
			if (FMApplication.debugMode) {this.mainWindow.toggleDevTools();; }
		}

		FileManager_Window.prototype.loadTrayButton = function() { // @TODO This is not used at all yet.
			var imageIcon = "./images/peach.png";

			var appIcon = new Tray(imageIcon);
			var contextMenu = Menu.buildFromTemplate([
				{ label: 'Cicero Button', type: 'radio' },
				{ label: 'Magical Rainbows', type: 'radio' },
				{ label: 'Robot Overlords', type: 'radio', clicked: true },
				{ label: 'Caramel Cookies', type: 'radio' },
			]);
			appIcon.setContextMenu(contextMenu);
			appIcon.setToolTip('Cicero is just Peachy!');
		}

		FileManager_Window.prototype.handleEvents = function() {
			this.mainWindow.on('closed', function() { this.mainWindow = null; });
			this.mainWindow.on('close', function() {
				FMSettings.setSetting(['winXY', FMWindow.mainWindow.getPosition()])
				FMSettings.saveSettings();
			});
		}

		FileManager_Window.prototype.setDockBadge = function(value) {
			if (process.platform == 'darwin')
				app.dock.setBadge(value);
		}

		FileManager_Window.prototype.websiteDialog = function() {
			var win = new BrowserWindow({width: 1200, height: 600, frame: false}); 
			win.loadUrl('http://ciceroforwriters.com');
		}

		FileManager_Window.prototype.setTitle = function(title) {
			debug.log("We're Setting the window title to 'Cicero - " + title + "'.");
			this.mainWindow.setTitle("Cicero - " + title);
		}

		ipc.on('window:devtools', function(event, arg) {
			if (arg) { FMWindow.mainWindow.inspectElement(arg[0], arg[1]); }
			else { FMWindow.mainWindow.toggleDevTools(); }
		});

		return FileManager_Window;

	})();

}).call(this);