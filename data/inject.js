(function() {
	self.port.on("blur", function() {
		blur.on();
	});

	self.port.on("unblur", function() {
		blur.off();
	});
})();
