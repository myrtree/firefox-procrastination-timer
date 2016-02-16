(function() {
	let startTrigger = document.getElementById("start-timer");
	let addTrigger = document.getElementById("add-time");
	let stopTrigger = document.getElementById("stop-timer");
	let closeTabTrigger = document.getElementById("close-tab");

	function timerIsSetView() {
		addTrigger.classList.remove("hidden");
		startTrigger.classList.add("hidden");
		stopTrigger.classList.remove("hidden");
		closeTabTrigger.classList.add("hidden");
	}

	function timerIsStoppedOrNotSetView() {
		addTrigger.classList.add("hidden");
		startTrigger.classList.remove("hidden");
		stopTrigger.classList.add("hidden");
		closeTabTrigger.classList.add("hidden");
	}

	function timerIsUpView() {
		addTrigger.classList.remove("hidden");
		startTrigger.classList.add("hidden");
		stopTrigger.classList.remove("hidden");
		closeTabTrigger.classList.remove("hidden");
	}

	startTrigger.addEventListener("click", function() {
		self.port.emit("startTimer");
	});
	addTrigger.addEventListener("click", function() {
		self.port.emit("startTimer");
	});
	stopTrigger.addEventListener("click", function() {
		self.port.emit("stopTimer");
		timerIsStoppedOrNotSetView();
	});
	closeTabTrigger.addEventListener("click", function() {
		self.port.emit("closeTab");
	});

	self.port.on("timerIsSet", function() {
		timerIsSetView();
	});
	self.port.on("timerIsUp", function() {
		timerIsUpView();
	});
	self.port.on("timerIsStoppedOrNotSet", function() {
		timerIsStoppedOrNotSetView();
	});
})();
