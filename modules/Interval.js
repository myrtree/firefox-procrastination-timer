let { setInterval, clearInterval } = require("sdk/timers");

function Interval(callback, delay, callsLimit, paused) {
	'use strict';

	let self = this;

	this._callback = callback;
	this._delay = delay;
	this._intervalId = null;
	this.callsLimit = callsLimit || 0;
	this.numberOfCalls = 0;
	this.callsRemain = this.callsLimit;

	this._call = function() {
		self.numberOfCalls++;
		self.callsRemain--;

		let lastTime = self.callsLimit
			&& self.numberOfCalls >= self.callsLimit;

		self._callback(lastTime);
		if (lastTime) {
			self.pause();
			return;
		}
	};

	this._clearInterval = function() {
		clearInterval(this._intervalId);
		this._intervalId = null;
	};

	this.isWaiting = function() {
		return this._intervalId !== null;
	};

	this.addCalls = function(calls) {
		this.callsLimit += calls;
		this.callsRemain += calls;

		return this;
	};

	this.pause = function() {
		this._clearInterval();

		return this;
	};

	this.stop = function() {
		this._clearInterval();
		this.numberOfCalls = 0;
		this.callsRemain = 0;
		this.callsLimit = 0;

		return this;
	};

	this.resume = function() {
		if (this.isWaiting()) {
			return;
		}
		this._intervalId = setInterval(this._call, this._delay);

		return this;
	};

	!paused && this.resume();
}

module.exports = Interval;
