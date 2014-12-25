/**
 *  The central point for our application.
 */
(function() {

	var FileManager_Application, FileManager_Window, FileManager_Settings, ApplicationMenu, ProtocolHandler, AutoUpdateManager, app, os, fs, ipc, url, net, path, debug;

	ApplicationMenu = require('./application-menu');
	FileManager_Settings = require('./filemanager-settings');
	FileManager_Window = require('./filemanager-window');
	//ProtocolHandler = require('./protocol-handler'); // @TODO Implement Protocol Handler
	//AutoUpdateManager = require('./update-manager'); // @TODO Implement Auto Update
	Menu = require('menu');

	app = require('app');
	fs = require('fs');
	ipc = require('ipc');
	path = require('path');
	os = require('os');
	net = require('net');
	url = require('url');
	debug = require('./debug');

	EventEmitter = require('events').EventEmitter;
	_ = require('underscore-plus');

	module.exports = FileManager_Application = (function() {
		_.extend(FileManager_Application.prototype, EventEmitter.prototype);

		FileManager_Application.open = function(options) {
			debug.nl();
			new FileManager_Application(options);
		}

		function FileManager_Application(options) {
			global.FMApplication = this;
			this.globalflag = "STARTUP";
			new FileManager_Settings();
			new FileManager_Window();
			this.applicationMenu = new ApplicationMenu(this.version);
			this.version = app.getVersion();
			this.globalflag = null;

			debug.trace("Launched " + app.getName() + " v" + app.getVersion() + ". Thanks " + os.hostname() + ".");
			FMSettings.setSetting(['ciceroTimesOpened', FMSettings.getSetting('ciceroTimesOpened') + 1]);
			FMSettings.saveSettings();
		}

		FileManager_Application.prototype.debugMode = true; // Used in development to enable source view etc
		FileManager_Application.prototype.logDetailed = false; // When true, debug.log also prints to console. Otherwise, only debug.trace does
		FileManager_Application.prototype.globalflag = undefined; // prefix debug messages with this to keep track of where we are

		FileManager_Application.prototype.applicationMenu = null;
		FileManager_Application.prototype.dialogs = [];
		FileManager_Application.prototype.ciceroProtocolHandler = null;
		FileManager_Application.prototype.version = null;
		FileManager_Application.prototype.project = null;
		FileManager_Application.prototype.dataPath = app.getDataPath();
		FileManager_Application.prototype.exit = function(status) { return app.exit(status); }

		/**
		 * Quit when all windows are closed. For now we want this on Mac too.
		 */
		app.on('window-all-closed', function() {
			//if (process.platform != 'darwin')
			debug.log("Goodbye Cicero! We're closing now.")
			app.quit();
		});

		app.on('will-finish-launching', function() {
			// @TODO: We want to start the auto updater here.
			require('crash-reporter').start();
		});

		app.on('will-quit', function() {
			// Here we check for unsaved projects and check the user wants to quit
		});

		app.on('open-file', function() { debug.log("We opened a file!"); });
		app.on('open-url', function() {	debug.log("We opened a URL!") });

		app.on('activate-with-no-open-windows', function() {
			// All windows are closed, the app is still open.
			// Currently inactive on Mac, which closes app fully.
		});

		return FileManager_Application;

	})();

}).call(this);