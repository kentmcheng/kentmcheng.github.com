var nextbus = (function() {
	
	"use strict";

	var TYPE_ARRAY = 0,
		TYPE_OBJECT = 1,
		TYPE_MOUSE_EVENT = 2,
		TYPE_TOUCH_EVENT = 3;
	
	var version = "2.0",
		date = "2015.04.03",
		baseURL = 'https://nextbus.webscript.io/',
		isFetching = false;
		
	var busesPanel = {},
		infoPanel = {},
		stopsPanel = {},
		searchPanel = {},
		searchField = {},
		splashPanel = {};

	function init() {

		// Check for standalone mode (ie. web app fullscreen mode)
		if (window.navigator.standalone) 
			$("html").addClass("standalone");

		// Check for touch support
		if (!("ontouchstart" in window)) 
			$("html").addClass("no-touch");

		// Initialize the panels
		busesPanel = new Panel("nb-buses");
		initBusesPanel();

		infoPanel = new Panel("nb-info");
		initInfoPanel();

		searchPanel = new Panel("nb-search");
		initSearchPanel();

		stopsPanel = new Panel("nb-stops");
		initStopsPanel();

		splashPanel = getElement("nb-splash");

		// Grab the user's location to load their nearest stops
		navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {enableHighAccuracy : true, timeout : 5000});

		// Update the keypad size after a resize event
		var runKeypadSizer = debounce(setKeypadSize, 250); // throttled 
		$(window).resize(runKeypadSizer);

		function initBusesPanel() {

			// Set the secondary button to be a back action
			busesPanel.secondaryButton("back");
			busesPanel.onSecondaryClick(view.back);
		}

		function initInfoPanel() {

			var reload = function() { location.reload(); };

			infoPanel.heading("Help & Info"); // set the static title

			// Set the primary button to be a reload app action
			infoPanel.primaryButton("reload");
			infoPanel.onPrimaryClick(reload);
			
			// Set the secondary button to be a close panel action
			infoPanel.secondaryButton("close");
			infoPanel.onSecondaryClick(view.back);

			// Move the info contents into its respective panel
			infoPanel.content(getElement("info"));

			// Add a version info property and set it
			infoPanel.versionInfo = getElement("info-version");
			infoPanel.versionInfo.textContent = "Version " + version + " – " + date;
		}

		function initSearchPanel() {

			// Set the static title
			searchPanel.heading("Find a Stop");
			
			// Set the secondary button to be a back action
			searchPanel.secondaryButton("back");
			searchPanel.onSecondaryClick(view.back);

			// Move the search contents into its respective panel
			searchPanel.content(getElement("search"));

			// Add the search components as new properties
			searchPanel.inputField = getElement("search-input-field");
			searchPanel.keypad = getElement("search-keypad");

			setKeypadSize(); // size the buttons

			// Prevent any touch moves for quick input
			$(searchPanel.content()).on("touchmove", function(e) { e.preventDefault(); });

			// Bind the action for the keypad buttons
			$(searchPanel.keypad).on("click touchend", "button", function(e) {

				e.preventDefault();
				
				var currTarget = e.currentTarget, 
					ogEvent = e.originalEvent,
					x = 0, y = 0;
					
				// Determine the type of event to get the proper x,y coords
				if (getType(ogEvent) === TYPE_MOUSE_EVENT) {
					x = ogEvent.clientX;
					y = ogEvent.clientY;
				}
				else if (getType(ogEvent) === TYPE_TOUCH_EVENT) {
					x = ogEvent.changedTouches[0].clientX;
					y = ogEvent.changedTouches[0].clientY;
				}
				
				// Check if the x,y coords fall within the bounds of the original button
				if ( x >= currTarget.offsetLeft && x <= currTarget.offsetLeft + currTarget.offsetWidth ) {
					if ( y >= currTarget.offsetTop && y <= currTarget.offsetTop + currTarget.offsetHeight ) {

						// Get the button's value and update the search
						var value = this.getAttribute("data-keypad-value");
						updateSearch(searchPanel.inputField, parseInt(value));
					}
				}
			});
		}

		function initStopsPanel() {

			// Set the primary button to be the search action
			stopsPanel.primaryButton("search");
			stopsPanel.onPrimaryClick(showSearch);
			
			// Set the secondary button to be the help & info action
			stopsPanel.secondaryButton("help");
			stopsPanel.onSecondaryClick(showInfo);
		}
	}

	function setKeypadSize() {

		// Only perform the sizing if the panel's node has a width
		if (searchPanel.content().offsetWidth > 0) {

			// Determine the size of the buttons
			var maxButtonWidth = Math.floor(searchPanel.content().offsetWidth / 3), // 3 buttons per row
				maxButtonHeight = Math.floor(searchPanel.content().offsetHeight / 4), // at 4 rows of buttons
				maxButtonSize = Math.min(maxButtonWidth, maxButtonHeight),
				newButtonSize = Math.floor(maxButtonSize * 0.75); // use a percentage of the max

			//console.log("New keypad button size = " + newButtonSize + "/" + maxButtonSize);

			$(searchPanel.keypad).find("button").css({"width" : newButtonSize});
		}
	}

	// If there's no geolocation
	function onGeoError(positionError) {

		// console.log(positionError);

		var contents = createElement("div"),
			message = "",
			searchLink = {},
			searchLinkId = stopsPanel.id() + "-search";

		switch(positionError.code) {

			case 1: // PERMISSION_DENIED
				
				message = "Access to your Geolocation was denied.";
				break;

			case 2: // POSITION_UNAVAILABLE
				
				message = "There was a problem retrieving your Geolocation.";
				break;

			case 3: // TIMEOUT
				
				message = "Couldn't get your Geolocation in a timely manner.";
				break;

			default:
				message = "There was an unknown problem retrieving your Geolocation.";
		}

		message += " " + "You can still <em id='" + searchLinkId + "'>search</em> for upcoming buses if you know the stop number."

		contents.classList.add("error");
		contents.innerHTML = (
			"<div class='es es-no'></div>" +
			"<p>" + message + "</p>"
		);

		stopsPanel.heading("No Geolocation");
		stopsPanel.content(contents);

		searchLink = getElement(searchLinkId);
		$(searchLink).on("click", showSearch);

		view.isReady(splashPanel, stopsPanel);
	}

	// If we get their geolocation
	function onGeoSuccess(position) {

		isFetching = true; // block new requests

		var latitude = position.coords.latitude.toFixed(6),
			longitude = position.coords.longitude.toFixed(6),
			url = baseURL + "stops?lat=" + latitude + "&long=" + longitude;

		$.getJSON(url, function(results) { 
			onGetStops(results); 
		})
		.fail(function(jqxhr, textStatus, error) {
			//console.log(textStatus);
			//console.log(error);
			alert("Request failed: " + textStatus + ", " + error);
		});
	}

	// When we get stop results from the server
	function onGetStops(results) {

		isFetching = false;
		//console.log(results);

		if (results.Stops) { // we have stop data to work with

			var stops = results.Stops,
				stopsList = createElement("ul"),
				routes = "",
				onStreet = "",
				atStreet = "";

			// Build the list of stops
			stops.forEach(function(item) {

				if (item.Routes) {  // only use stops that have bus routes

					// Split the routes string into individual routes
					var arr = item.Routes.split(",");

					// Trim the white space and remove the leading zeros
					for (var i = 0; i < arr.length; i++) 
						arr[i] = arr[i].trim().replace(/^0+/, "");

					routes = arr.join(", "); // rebuild the routes string

					// Format the street strings to be capitalized instead of all caps
					atStreet = item.AtStreet.toLowerCase().replace(/\b[a-z]/g, function(letter) {
						return letter.toUpperCase();
					});

					onStreet = item.OnStreet.toLowerCase().replace(/\b[a-z]/g, function(letter) {
						return letter.toUpperCase();
					});

					// Insert the markup for each stop
					$(stopsList).append(
						"<li id='" + item.StopNo + "' class=''>" +
							"<div class='sign'><h1>" + item.StopNo + "</h1></div>" +
							"<div class='desc'><h1>" + onStreet + " &amp; " + atStreet + "</h1><h2>" + routes + "</h2></div>" +
							"<div class='fa fa-angle-right'></div>" +
						"</li>"
					);
				}
			});
			
			stopsList.classList.add("item-list");

			stopsPanel.heading("Nearby Stops");
			stopsPanel.content(stopsList);

			// Bind the action when a stop is selected
			$(stopsList).on("click", "li", function() {
				
				if (!isFetching) {

					isFetching = true; // block new requests

					var stopNo = this.id,
						url = baseURL + "stop?stopNo=" + stopNo;
					
					$.getJSON(url, function(results) { 
						showBuses(stopNo, results, "right"); 
					})
					.fail(function(jqxhr, textStatus, error) {
						isFetching = false;
						alert("Request failed: " + textStatus + ", " + error);
					});
				}
			});
		} 
		else if (results.Error) { // there was an error getting the stops

			var error = results.Error,
				contents = createElement("div"),
				message = "";

			console.log("Error code: " + error.Code + ", " + error.Message);

			switch(error.Code) {

				case "1012": // No stops found
					
					message = (
						"Sorry, there are no nearby stops. " +
						"It's time to call a cab or start walking." 
					);
					
					break;

				default: 
					
					message = (
						"Sorry, there was a problem finding your nearby stops. " +
						"Please <em>reload the app</em> and if the problem persists, let me know."
					);
			}

			contents.classList.add("error");
			contents.innerHTML = (
				"<div class='es es-sad'></div>" +
				"<p>" + message + "</p>"
			);

			stopsPanel.heading("Oh-noes");
			stopsPanel.content(contents);
		} 
		else throw new Error("Unknown stop results returned.");

		view.isReady(splashPanel, stopsPanel);
	}

	function showBuses(stopNo, results, direction) {

		isFetching = false;
		//console.log(results);

		if (results.Buses) { // we have bus results to work with
			
			onGetBusesSuccess(stopNo, results.Buses);
		}
		else if (results.Error) { // there was an error retrieving the buses

			onGetBusesError(results.Error);
		}
		else throw new Error("Unknown bus results returned.");

		view.advance(busesPanel, direction);
	}

	// When we get bus data from the server
	function onGetBusesSuccess(stopNo, buses) {

		var _buses = []; // stores the upcoming buses

		//console.log("There are " + buses.length + " different bus routes for this stop.");
		
		buses.forEach(function(item) { nextBuses(item); });

		// Get the upcoming buses arriving for the route
		function nextBuses(busRoute) {

			var busNumber = busRoute.RouteNo.replace(/^0+/, ""), // and remove any leading zeros
				busSchedule = busRoute.Schedules;

			busSchedule.forEach(function(item) { addBus(item); });

			// Add the upcoming buses to the new list
			function addBus(info) {
				
				// Only add if the bus if it isn't cancelled
				if (info.CancelledTrip === false) { 
					
					var nextBus = {};

					nextBus.busNumber = busNumber;
					nextBus.busName = info.Destination;
					nextBus.eta = parseInt(info.ExpectedCountdown);

					_buses.push(nextBus);
				}
			}
		}

		// Sort the new list by arrival times (soonest first)
		_buses.sort(function(a, b) { 
		    return a.eta - b.eta; 
		})

		// Build the markup for the bus list
		var busesList = createElement("ul");
		busesList.classList.add("item-list");

		_buses.forEach(function(item) {

			var mins = parseInt(item.eta),
				eta = "";

			if (mins < 0)
				eta = "is leaving";
			else if ( mins === 0 || mins === 1)
				eta = "now";
			else if (mins === 2) 
				eta = "< 2 mins";
			else 
				eta = mins + " minutes";

			$(busesList).append(
				"<li>" +
					"<div class='bus'>" +
						"<div class='bus-icon'><h1>" + item.busNumber + "</h1></div>" +
					"</div>" +
					"<div class='details'><h2>" + item.busName + "</h2><h1>" + eta + "</h1></div>" +
				"</li>"
			);
		});

		// Set the heading
		busesPanel.heading("Stop " + stopNo);
		busesPanel.content(busesList);

		// Center the items in the list
		var scaleFactor = parseInt($("html").css("font-size")) / 10,
			detailsMaxWidth1 = busesList.children[0].children[1].children[1].offsetWidth,
			detailsMaxWidth2 = busesList.children[busesList.children.length-1].children[1].children[1].offsetWidth,
			detailsWidth = (Math.max(detailsMaxWidth1, detailsMaxWidth2) + 5) / scaleFactor / 10;
		
		$(busesList).find(".details").css({ "width" : detailsWidth.toFixed(1) + "rem" });
	}

	// When we get an error retrieving the bus data
	function onGetBusesError(error) {

		console.log(error.Code + ", " + error.Message);

		var contents = createElement("div"),
			title = "Uh-oh",
			icon = "es-sad",
			message = "";

		switch(error.Code) {
			
			case "10002": // db connection error
				
				message = "There was a problem connecting to the database.";
				break;
			
			case "3001": // Invalid stop number
			case "3002": // Stop not found 
				
				title = "Whoopsies!";
				icon = "es-no";
				message = "The stop number you entered does not exist. Please try again.";
				break;

			case "3005": // No stop estimates found (no buses?)
				
				message = "There are no buses arriving in the next 2 hours. Better start walking or call that cab.";
				break;

			case "3003": // Unknown get estimates error
			case "3004": // Invalid route
			case "3006": // Invalid time frame
			case "3007": // Invalid count
				
				message = error.Message;
				break;
			
			default:
				message = "There was a problem retrieving the information.";
		}

		contents.classList.add("error");
		contents.innerHTML = (
			"<div class='es " + icon + "'></div>" +
			"<p>" + message + "</p>"
		);

		busesPanel.heading(title);
		busesPanel.content(contents);
	}

	function showInfo() {
		
		view.advance(infoPanel, "up"); // shift upwards
	}

	function showSearch() {

		searchPanel.inputField.value = ""; // clear the input field
		view.advance(searchPanel, "right"); // shift right
	}

	function updateSearch(inputField, value) {

		var stopNo = "";

		if (!isFetching) {

			if (value >= 0) { // append the value (0-9) to the field
			
				if (inputField.value.length < 5) { // ignore if the value is already filled (max 5 digits)

					stopNo = inputField.value.concat(value);
					inputField.value = stopNo;

					// Perform a search if the field is completed
					if (stopNo.length === 5) {

						isFetching = true; // block new requests

						var url = baseURL + "stop?stopNo=" + stopNo;

						$.getJSON(url, function(results) { 
							showBuses(stopNo, results, "right-2x"); 
						})
						.fail(function(jqxhr, textStatus, error) {
							isFetching = false;
							alert("Request failed: " + textStatus + ", " + error);
						});
					}
				}
			}
			else { // remove a digit from the field
				
				if (inputField.value.length !== 0) { // if there's something to remove
					
					stopNo = inputField.value.substring(0, inputField.value.length - 1);
					inputField.value = stopNo;
				}
			}
		}
	}

	return {
		init : function() { init(); }
	};

}).call(this);

var view = (function() {

	"use strict";

	var panelTransforms = []; // store panels with a active transform

	return {

		isReady : function(currentPanel, nextPanel) {

			setTimeout(function() {

				$(currentPanel).on("transitionend", function() {
					$(this).off("transitionend");
					$(this).hide();
					panelTransforms.push(nextPanel.node());
				});

				$(currentPanel).addClass("ready");

			}, 500);
		},

		advance : function(nextPanel, direction) {

			// Add the new panel to the end of the transform list
			// and add the new direction class to each panel in the list
			
			panelTransforms.push(nextPanel.node());

			panelTransforms.forEach(function(panel) {
				panel.classList.add(direction);
			});
		},

		back : function() {

			// Only back track if there are at least 2 panel transforms
			// and remove the most recently added direction class from each panel
			// and remove the most recently added panel from the transform list

			if (panelTransforms.length > 1) {

				var c = [];

				panelTransforms.forEach(function(panel) {
					c = panel.classList;
					panel.classList.remove(c[c.length-1]);
				});

				panelTransforms.pop();
			}
		},

		activePanels : function() { return panelTransforms; }
	}

}).call(this);

function Panel(id) {

	var node = document.getElementById(id),
		header = document.createElement("header"),
		heading = document.createElement("h1"),
		primaryBtn = document.createElement("button"),
		secondaryBtn = document.createElement("button"),
		content = document.createElement("div");
		
	heading.id = node.id + "-heading";
	primaryBtn.id = node.id + "-primary";
	secondaryBtn.id = node.id + "-secondary";
	content.id = node.id + "-content";
	
	primaryBtn.classList.add("hidden");
	secondaryBtn.classList.add("hidden");
	content.classList.add("contents");

	header.appendChild(secondaryBtn);
	header.appendChild(heading);
	header.appendChild(primaryBtn);

	node.appendChild(header);
	node.appendChild(content);

	function updateScroll() {

		//console.log("Updating scroll for panel: " + node.id);

		if (content.childNodes.length === 0) return; // stop if content has no children

		if (content.firstChild.offsetHeight > content.offsetHeight)
			content.classList.add("scrollable");
		else 
			content.classList.remove("scrollable");
	}

	function setButtonType(button, buttonType) {
		
		button.classList.remove("hidden");

		switch(buttonType) {
			
			case "back":
				button.classList.add("fa", "fa-chevron-left");
				break;
			case "close":
				button.classList.add("fa", "fa-close");
				break;
			case "favorite":
				button.classList.add("fa", "fa-heart-o");
				break;
			case "help":
				button.classList.add("fa", "fa-question-circle");
				break;
			case "reload":
				button.classList.add("fa", "fa-repeat");
				break;
			case "search":
				button.classList.add("fa", "fa-search");
				break;
		}
	}

	this.id = function() {
		return node.id;
	}

	this.heading = function(title) {
		heading.textContent = title;
	}

	this.primaryButton = function(type) {
		setButtonType(primaryBtn, type);
	}

	this.onPrimaryClick = function(action) {
		$(primaryBtn).on("click", action);
	}

	this.secondaryButton = function(type) {
		setButtonType(secondaryBtn, type);
	}

	this.onSecondaryClick = function(action) {
		$(secondaryBtn).on("click", action);
	}

	this.content = function(contents) {

		// Check if there's contents to set, otherwise just return the content
		if (typeof contents !== "undefined") {

			if (content.hasChildNodes()) {

				var children = content.childNodes;

				for (var i = 0; i < children.length; i++) {
					children[i].remove();
				}
			}
			content.appendChild(contents);
			updateScroll();
		}
		else return content;
	}

	this.node = function() {
		return node;
	}	
}

// HELPER FUNCTIONS

function createElement(tag) {
	return document.createElement(tag);
}

function getElement(id) {
	return document.getElementById(id);
}

function getType(item) {

	//console.log(Object.prototype.toString.call(item));
		
	switch(Object.prototype.toString.call(item)) {
		
		case "[object Array]":
			return 0;
		
		case "[object Object]":
			return 1;
		
		case "[object MouseEvent]":
			return 2;
		
		case "[object TouchEvent]":
			return 3;
		
		default: return -1;
	}
}

/*	Returns a function, that, as long as it continues to be invoked, will not
	be triggered. The function will be called after it stops being called for
	N milliseconds. If `immediate` is passed, trigger the function on the
	leading edge, instead of the trailing. */
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

