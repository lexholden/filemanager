(function() {

	var debug, app, fs, ipc;

	app = require('app');
	fs = require('fs-plus');
	ipc = require('ipc');

	EventEmitter = require('events').EventEmitter;
	_ = require('underscore-plus');

	module.exports = debug = (function() {
		_.extend(debug.prototype, EventEmitter.prototype);

		function debug() {

		}

		var traceMode = true;
		var logger = fs.createWriteStream(app.getDataPath() + "/log.txt", {'flags': 'a'});

		debug.nl = function() {
			logger.write(" \n");
		}

		debug.log = function(text) {
			debug.write(text, "LOG  ");
			if (FMApplication.logDetailed) {
				console.log(text);
			}
		}

		debug.trace = function(text) {
			debug.write(text, "TRACE");
			if (traceMode) {
				console.log(text);
			}
		}

		debug.flag = function(text) {
			debug.write(text, "FLAG ");
			console.log(text);
		}

		debug.error = function(text) {
			debug.write(text, "ERROR");
			console.log("Error: " + text);
		}

		debug.proj = function(text, type) {
			// We want to log to a project specific log somehow.
			console.log(type + ": " + text)
		}

		ipc.on('print', function(event, arg) {
			debug.write(arg, "PRINT");
			console.log(arg);
		});

		ipc.on('log', function(event, arg) {
			debug.write(arg, "FRONT");
			if (FMApplication.logDetailed) {
				console.log("FE: " + arg);
			}
		});

		// Compiles an entry and writes to file
		debug.write = function(text, level) {
			var Log = Error;
			Log.prototype.write = function (args) {		
				var suffix = (this.lineNumber ? this.fileName + ':' + this.lineNumber + ":1" : extractLineNumberFromStack(this.stack));
				suffix = suffix.split('/');
				suffix = suffix[suffix.length - 1];
				var pos = suffix.substring(0, suffix.length - 1);
				while (pos.length < 32) {
					pos = pos + " ";
				}
				if (FMApplication.globalflag) {
					text = FMApplication.globalflag + ": " + text;
				}
				logger.write(new Date().toLocaleString() + "  " + pos + level + "   " + text + "\n");
			};
			var extractLineNumberFromStack = function (stack) {
				var line = stack.split('\n')[4];
				line = ( line.indexOf(' (') >= 0 ? line.split(' (')[1].substring(0, line.length - 1) : line.split('at ')[1]	);
				return line;
			};

			Log().write(text);
		}

		debug.checkIfLogExists = function() { // @TODO Do we want more robust checks each time we log...?
			if (fs.existsSync(app.getDataPath() + "/log.txt")) {
				//debug.log("STARTUP: We have a log file, yay!");
			} else {
				debug.trace("We have no log file, so we'll generate one.");
				debug.createLogFile();
			}
		}

		debug.createLogFile = function() {
			fs.writeFile(app.getDataPath() + "/log.txt", "" , function(err) {
				if(err) {
					debug.error(err);
				} else {
					debug.log("The file was saved: " + app.getDataPath() + "/log.txt");
				}
			}); 
		}

		return debug;

	})();

}).call(this);