(function (root) {
	function Blur() {
		var styleEl, styleSheet, className;

		className = "blur-" + Math.random().toString(36).substring(2);

		styleEl = document.createElement('style');
		document.head.appendChild(styleEl);

		styleSheet = styleEl.sheet;
		styleSheet.insertRule("." + className + " {filter: blur(5px);}", 0);
		styleSheet.disabled = true;

		document.body.classList.add(className);

		this.on = function() {
			styleSheet.disabled = false;
		};

		this.off = function() {
			styleSheet.disabled = true;
		};
	}

	root.blur = new Blur();
})(this);
