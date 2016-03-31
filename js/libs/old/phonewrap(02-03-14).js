function Phonewrap(sourceId, newContainerId) {
	
	var container = document.createElement("div"),
		containerId = "",
		containerClasses = "",
		contents = "";

	// Check for constructor errors
	if (typeof sourceId === "undefined") {
		console.warn("No sourceId was provided to the Phonewrap constructor.");
		return false;
	}
	else if (typeof sourceId === "string") {
		contents = document.getElementById(sourceId);
	}
	else {
		console.warn("The sourceId must be of type 'string' when passed to the Phonewrap constructor.");
		return false;
	}

	if (typeof newContainerId === "undefined") {
		containerId = "phone";
	}
	else if (typeof newContainerId === "string") {
		containerId = newContainerId;
	}
	else {
		console.warn("The newContainerId must be of type 'string' when passed to the Phonewrap constructor.");
		return false;
	}

	var viewport = {}, 
		viewportId = containerId + "_viewport";

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
		phoneOrientation = "";
		
	var phones = [
		{ // Apple iPhone 4 & 5
			name : "iphone",
			colors : ["black", "white"],
			models : ["four", "five"],
			orientations : ["portrait", "landscape"],
			markup : 
				'<div class="phone_components">' +
					'<div class="phone_frame"> ' +
						'<button class="power" disabled></button>' +
						'<button class="mute" disabled></button>' +
						'<button class="volume up" disabled></button>' +
						'<button class="volume down" disabled></button>' +
					'</div>' +
					'<div class="phone_screen">' +
						'<header class="phone_bezel">' +
							'<div class="camera"></div>' +
							'<div class="speaker"></div>' +
						'</header>' +
						'<div class="phone_display">' +
							'<header class="phone_display_header">' +
								'<div class="signal"></div>' +
								'<div class="time"><p>' + time() + '</p></div>' +
								'<div class="battery"><div class="charge"></div></div>' +
							'</header>' +
							'<div id="' + viewportId + '"></div>' +
						'</div>' +
						'<footer class="phone_bezel">' +
							'<button class="home" disabled>' +
								'<div class="icon"></div>' +
							'</button>' +
						'</footer>' +
					'</div>' +
					'<div class="phone_glare"></div>' +	
				'</div>',
			hasDisplayHeader : true
		}
	];
	
	wrap();

	// Performs the phone wrap of the source contents
	function wrap() {

	 	setPhone(0);

		// Set up the new phone container
		container.setAttribute("id", containerId);
		container.setAttribute("class", phoneName + " " + phoneModel + " " + phoneColor + " " + phoneOrientation);
		container.innerHTML = phoneMarkup;

		// Insert the container into the parent node of contents
		contents.parentNode.appendChild(container);

		// Move the contents into the phone's viewport
		viewport = document.getElementById(viewportId);
		viewport.appendChild(contents);
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

	// Sets the Phone object to use
	function setPhone(newPhone) {
		phone = phones[newPhone];
		phoneColor = phone.colors[0];
		phoneHeader = phone.hasDisplayHeader;
		phoneMarkup = phone.markup;
		phoneModel = phone.models[0];
		phoneName = phone.name;
		phoneOrientation = phone.orientations[0];
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