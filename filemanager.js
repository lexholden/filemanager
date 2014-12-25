/**
 * 	FileManager is the entry point for our application, and takes command line
 * 	arguments and pass them into the main application
 */
(function(){

	var FileManagerApplication, app, fs;

	app = require('app');
	fs = require('fs');

	global.shellStartTime = Date.now();

	app.on('ready', function() {
		var args;

		FileManagerApplication = require('./js/filemanager-application');
		FileManagerApplication.open(args);// @TODO Pass args?
	});

}).call(this);