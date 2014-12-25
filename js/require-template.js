(function() {

	var Cicero_Module, Cicero_Module2, fs, ipc, debug;

	Cicero_Module2 = require('./cicero-module2');

	fs = require('fs');
	ipc = require('ipc');
	debug = require('./debug');

	EventEmitter = require('events').EventEmitter;
	_ = require('underscore-plus');

	module.exports = Cicero_Module = (function() {
		_.extend(Cicero_Module.prototype, EventEmitter.prototype);

		function Cicero_Module(settings) {
			console.log("window woo!");
		}

		Cicero_Module.prototype.variable = null;

		Cicero_Module.prototype.doSomething = function() {
			console.log("Woo! We did something")
		}

		return Cicero_Module;

	})();

}).call(this);