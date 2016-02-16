"use strict";

let self = require("sdk/self");
let tabs = require("sdk/tabs");
let { Panel } = require("sdk/panel");
let { prefs } = require("sdk/simple-prefs");
let { ActionButton } = require("sdk/ui/button/action");
let Interval = require("./modules/Interval");

const msInMinute = 60000;

let button = ActionButton({
	id: "ptAddon-button",
	label: "Procrastination timer",
	icon: {
		"16": "./icons/icon-16.png",
		"32": "./icons/icon-32.png",
		"64": "./icons/icon-64.png"
	},
	badge: "",
	badgeColor: prefs.badgeDefaultColor,
	onClick: handleClick
});

let menu = Panel({
	"contentURL": self.data.url("menu/menu.html"),
	"contentScriptFile": self.data.url("menu/menu.js"),
	"position": button,
	"height": 150
});

function handleClick() {
	menu.show();
}

menu.port.on("startTimer", function() {
	let tab = tabs.activeTab;

	if (!tab._ptAddon) {
		tab._ptAddon = {
			"worker": tab.attach({
				"contentScriptFile": [
					self.data.url("libs/Blur/blur.js"),
					self.data.url("inject.js")
				]
			}),
			interval: new Interval(function tickCallback(finished) {
				if (tab === tabs.activeTab) {
					button.badge = tab._ptAddon.interval.callsRemain;

					if (finished) {
						button.badgeColor = prefs.badgeTimesUpColor;
						menu.port.emit("timerIsUp");
					}
				}

				if (finished) {
					tab._ptAddon.worker.port.emit("blur");
				}
			}, msInMinute, 0, !!"paused")
		};
	}

	tab._ptAddon.interval.addCalls(prefs.timerIncrement).resume();
	button.badge = tab._ptAddon.interval.callsRemain;
	button.badgeColor = prefs.badgeDefaultColor;
	tab._ptAddon.worker.port.emit("unblur");

	menu.port.emit("timerIsSet");

	menu.hide();
});

menu.port.on("stopTimer", function() {
	let tab = tabs.activeTab;

	if (tab._ptAddon) {
		button.badge = '';
		tab._ptAddon.worker.port.emit("unblur");

		tab._ptAddon.interval.stop();
	}

	menu.hide();
});

menu.port.on("closeTab", function() {
	tabs.activeTab.close();

	menu.hide();
});

// Something like
// button.state("tab", {"badgeColor": prefs.badgeDefaultColor})
// would be better.
tabs.on("activate", function(tab) {
	if (tab._ptAddon) {
		button.badge = tab._ptAddon.interval.callsRemain;

		if (tab._ptAddon.interval.callsRemain) {
			button.badgeColor = prefs.badgeDefaultColor;
			menu.port.emit("timerIsSet");
		} else {
			button.badgeColor = prefs.badgeTimesUpColor;
			menu.port.emit("timerIsUp");
		}
	} else {
		button.badge = "";
		menu.port.emit("timerIsStoppedOrNotSet");
	}
});

tabs.on("close", function(tab) {
	if (tab._ptAddon) {
		tab._ptAddon.interval.stop();
	}
});
