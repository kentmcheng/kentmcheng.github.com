function Phonewrap(sourceId, newContainerId) {
	
	var container = document.createElement("div"),
		containerId = "",
		containerClasses = "",
		contents = {};

	// Check for constructor errors
	if (typeof sourceId === "undefined") {
		console.warn("No sourceId was provided to the Phonewrap constructor");
		return false;
	}
	else if (typeof sourceId === "string" && sourceId.length > 0) {
		contents = document.getElementById(sourceId);
	}
	else {
		console.warn("The sourceId should be a 'string' when passed to the Phonewrap constructor");
		return false;
	}

	if (typeof newContainerId === "undefined") {
		containerId = "phone";
	}
	else if (typeof newContainerId === "string" && newContainerId.length > 0) {
		containerId = newContainerId;
	}
	else {
		console.warn("The newContainerId should be a 'string' when passed to the Phonewrap constructor.");
		return false;
	}

	/*
		To extend, create an array of phones with the same object structure and create a function to set the phone data to use.
		Each additional phone also needs its own styles added to the stylesheet file.
	*/
	
	var phone = {},
		phoneColor = "",
		phoneHeader = false,
		phoneMarkup = "",
		phoneModel = "",
		phoneName = "",
		phoneOrientation = "",
		viewport = {},
		viewportId = containerId + "_viewport";
		
	var phones = [
		{ 	// Apple iPhone 4 & 5
			name : "iphone",
			colors : ["black", "white"],
			models : ["four", "five"],
			orientations : ["portrait", "landscape"],
			markup : 
				'<div class="iphone-components">' +
					'<div class="iphone-frame"> ' +
						'<div class="iphone-frame-button power"></div>' +
						'<div class="iphone-frame-button mute"></div>' +
						'<div class="iphone-frame-button volume up"></div>' +
						'<div class="iphone-frame-button volume down"></div>' +
					'</div>' +
					'<div class="iphone-screen">' +
						'<div class="iphone-bezel top">' +
							'<div class="iphone-camera"></div>' +
							'<div class="iphone-speaker"></div>' +
						'</div>' +
						'<div class="iphone-display">' +
							'<div class="iphone-display-header">' +
								'<div class="signal">' +
									'<ul class="iphone-signal-strength">' +
										'<li></li><li></li><li></li><li></li><li></li>' +
									'</ul>' +
									'<div class="carrier">Fido LTE</div>' +
								'</div>' +
								'<div class="time"><p>' + time() + '</p></div>' +
								'<div class="battery"></div>' +
								// '<div class="signal"></div>' +
								// '<div class="time"><p>' + time() + '</p></div>' +
								// '<div class="battery"><div class="charge"></div></div>' +
							'</div>' +
							'<div id="' + viewportId + '" class="iphone-viewport"></div>' +
						'</div>' +
						'<div class="iphone-bezel bottom">' +
							'<div class="iphone-button-home">' +
								'<div class="iphone-home-icon"></div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="iphone-glare"></div>' +	
				'</div>',
			hasDisplayHeader : true,
			showHeader : false
		}
	];
	
	wrap(0);

	// Sets the phone to use
	function setPhone(i) {
		phone = phones[i];
		phoneColor = phone.colors[0];
		phoneHeader = phone.hasDisplayHeader;
		phoneMarkup = phone.markup;
		phoneModel = phone.models[0];
		phoneName = phone.name;
		phoneOrientation = phone.orientations[0];
	}

	// Performs the phone wrap of the source contents
	function wrap(i) {

	 	setPhone(i);

		// Set up the new phone container
		container.setAttribute("id", containerId);
		container.classList.add(phoneName, phoneModel, phoneColor, phoneOrientation);
		//container.setAttribute("class", phoneName + " " + phoneModel + " " + phoneColor + " " + phoneOrientation);
		container.innerHTML = phoneMarkup;

		// Insert the container into the parent node of contents
		contents.parentNode.appendChild(container); // error on bad sourceId

		// Move the contents into the phone's viewport
		viewport = document.getElementById(viewportId);
		viewport.appendChild(contents);

		// Set the phone's display header
		setHeader(false);
	}

	// Returns a string of the current time in 12h format
	function time() {

		var date = new Date(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			period = "AM",
			time = "";

		// Check the hour to see if it's the PM period
		if (hour >= 12) {
			period = "PM";
			hour = hour % 12;
		}
		
		// Check the hour for zero values (0 = 12)
		if (hour == 0) {
			hour = 12;
		}

		// Check the minute value to ensure double digits (0 = 00)
		if (minute < 10) {
			minute = "0" + minute;
		}

		time = hour + ":" + minute + " " + period;
		
		return time;
	}

	// Sets the phone color (if supported)
	function setColor(newColor) {

		if (phone.colors.indexOf(newColor) != -1) {
			container.className = container.className.replace(phoneColor, newColor);
			phoneColor = newColor;
		}
		else return false;
	}

	// Toggles the phone's display header (if supported)
	function setHeader(bool) {
		
		// Check if the phone has a display header to toggle
		if (phoneHeader == true) {

			// If false, hide the display header by applying the fullscreen class
			// and remove the class to show the display header
			if (bool == false) {
				
				// Only add the class if it doesn't already exist
				if (container.className.search("fullscreen") == -1) {
					container.className += " fullscreen";
				}
				else return false;
			}
			else {
				container.className = container.className.replace("fullscreen", "").trim();
			}
		}
		else return false;
	}

	// Sets the phone model (if supported)
	function setModel(newModel) {

		if (phone.models.indexOf(newModel) != -1) {
			container.className = container.className.replace(phoneModel, newModel);
			phoneModel = newModel;
		}
		else return false;
	}

	// Sets the phone orientation (if supported)
	function setOrientation(newOrientation) {
		
		if (phone.orientations.indexOf(newOrientation) != -1) {
			container.className = container.className.replace(phoneOrientation, newOrientation);
			phoneOrientation = newOrientation;
		}
		else return false;
	}

	// The Public Functions
	this.deviceColor = function(newColor) {

		if (typeof newColor !== "undefined" && typeof newColor === "string") {
			setColor(newColor.toLowerCase());
		}
		else if (typeof newColor !== "undefined" && typeof newColor !== "string") {
			console.warn("An invalid type was provided to deviceColor()");
		}
		else return phoneColor;
	}

	this.deviceHeader = function(bool) {

		if (typeof bool !== "undefined" && typeof bool === "boolean") {
			setHeader(bool);
		}
		else if (typeof bool !== "undefined" && typeof bool !== "boolean") {
			console.warn("An invalid type was provided to deviceHeader()");
		}
		else return false;
	}

	this.deviceModel = function(newModel) {

		if (typeof newModel !== "undefined" && typeof newModel === "string") {
			setModel(newModel.toLowerCase());
		}
		if (typeof newModel !== "undefined" && typeof newModel !== "string") {
			console.warn("An invalid type was provided to deviceModel()");
		}
		else return phoneModel;	
	}

	this.deviceOrientation = function(newOrientation) {

		if (typeof newOrientation !== "undefined" && typeof newOrientation === "string") {
			setOrientation(newOrientation.toLowerCase());
		}
		if (typeof newOrientation !== "undefined" && typeof newOrientation !== "string") {
			console.warn("An invalid type was provided to deviceOrientation()");
		}
		else return phoneOrientation;
	}	
}