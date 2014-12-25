(function() {

	var FileManager_Settings, app, fs, ipc, debug;

	app = require('app');
	fs = require('fs-plus');
	ipc = require('ipc');
	debug = require('./debug');

	EventEmitter = require('events').EventEmitter;
	_ = require('underscore-plus');

	module.exports = FileManager_Settings = (function() {
		_.extend(FileManager_Settings.prototype, EventEmitter.prototype);

		function FileManager_Settings() {
			global.FMSettings = this;
			this.handleEvents();
			debug.checkIfLogExists();
			debug.log("We're about to load settings.");
			this.defaultSettings = this.getDefaultSettings();
			this.settings = this.loadSettings();
		}

		FileManager_Settings.prototype.settings = null;
		FileManager_Settings.prototype.defaultSettings = null;
		FileManager_Settings.prototype.settingsGot = 0;
		FileManager_Settings.prototype.unsavedChanges = 0;
		FileManager_Settings.prototype.unsavedChangesLimit = 10;

		FileManager_Settings.prototype.loadSettings = function() {
			if (fs.existsSync(FMSettings.getSettingsDirectory())) {
				debug.log("We have a settings file, yay!"); // @TODO Can we check for an error in parsing the JSON?
				return JSON.parse(fs.readFileSync(FMSettings.getSettingsDirectory(), 'utf8'));
			} 
			debug.trace("We have no settings file, so we'll generate one.");
			return FMSettings.getDefaultSettings();
		}

		FileManager_Settings.prototype.getSettingsDirectory = function() { return FMApplication.dataPath + "/settings.cicset"; }

		FileManager_Settings.prototype.getSetting = function(setting) {
			if (this.settings[setting] === undefined) {
				if (this.defaultSettings[setting] === undefined) {
					debug.error("We messed up, setting " + setting + " doesn't exist.");
					return null;
				} else {
					debug.trace("Setting " + setting + " doesn't exist, using default: " + this.defaultSettings[setting]);
					this.setSetting([setting, this.defaultSettings[setting]]);
					this.saveSettings();
					return this.defaultSettings[setting];
				}
			} else {
				this.settingsGot++;
				debug.log("Got: " + setting + " = " + this.settings[setting] + "    (" + this.settingsGot + ")");
				return this.settings[setting];
			}
		}

		FileManager_Settings.prototype.setSetting = function(setting) {
			this.settings[setting[0]] = setting[1];
			FMSettings.unsavedChanges ++;
			debug.log("Set: " + setting[0] + " = " + setting[1] + "    (" + this.unsavedChanges + "/" + this.unsavedChangesLimit + ")");
			if (FMSettings.unsavedChanges >= FMSettings.unsavedChangesLimit) { this.saveSettings();	}
		}

		FileManager_Settings.prototype.saveSettings = function() {
			if (FMApplication.debugMode) { var compactMode = 4; } // 4 for pretty json (debug mode), null for one line
			debug.log("Saving Settings: " + JSON.stringify(this.settings));
			fs.writeFile(FMSettings.getSettingsDirectory(), JSON.stringify(sortObject(this.settings), null, compactMode) , function(err) {
				if(err) {
					debug.error(err);
				} else {
					debug.log("The file was saved: " + FMSettings.getSettingsDirectory());
					FMSettings.unsavedChanges = 0;
				}
			}); 
		}

		FileManager_Settings.prototype.handleEvents = function() {
			ipc.on('setting:get', function(event, arg) { event.returnValue = FMSettings.getSetting(arg); });
			ipc.on('setting:set', function(event, arg) { FMSettings.setSetting(arg); });
			ipc.on('settings:isDebugMode', function(event) { event.returnValue = FMApplication.debugMode; });
			ipc.on('settings:set', function(event, arg) { for (var i in arg) { setSetting(arg[i]); } }); // @TODO Does this work and is it worth it?
		}

		FileManager_Settings.prototype.getDefaultSettings = function() {
			if (FMApplication.debugMode) {
				debug.log("We're in debug mode, so we're using hardcoded default settings.");
				// @TODO This can be cleaned up later
				return {
					"ciceroTimesOpened": 0,
					"iconChapter": "book",
					"iconDefault": "error",
					"iconScene": "create",
					"iconCharacter": "accessibility",
					"iconLocation": "account-balance",
					"iconStatistics": "assessment",
					"iconTodos": "check",
					"iconFolder": "folder",
					"iconTimeline": "query-builder",
					"iconMap": "loyalty",
					"iconIdeas": "drive-keep",
					"knownWikis": [],
					"recentProjects": [],
					"winDimensions": [800,600],
					"winEntityPaneMax": false,
					"winEntityPaneWidth": "250px",
					"winEntityView": 0,
					"winFullscreen": false,
					"winLeftPaneWidth": "20em",
					"winScreen": "undefined",
					"winQuickInfoVisible": false,
					"winXY": [50,50]
				}
			}
			return JSON.parse(fs.readFileSync(app.getDataPath() + "/defaultsettings.cicset", 'utf8'));
		}

		FileManager_Settings.escapePath = function(path) { // @TODO Is this needed?
			var p = path.replace(' ', '\ ');
			debug.log(p);
			return p;
		}

		function sortObject(o) {
			var sorted = {}, key, a = [];
			for (key in o) { if (o.hasOwnProperty(key)) { a.push(key); } }
			a.sort();
			for (key = 0; key < a.length; key++) { sorted[a[key]] = o[a[key]]; }
			return sorted;
		}

		return FileManager_Settings;

	})();

}).call(this);