/* 
	Phone Wrapper
 	http://kentc.me/play/phonewrap/
 	Version 2.0 - 2013.08.24
*/

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
		
		if (contents === null) {
			console.warn("There is no element with the sourceId of: " + sourceId);
			return false;
		}
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
		To extend, insert a new phone into the phone array
		Each phone should use the same object structure/properties
		Each phone also needs its own styles in the stylesheet
	*/

	var phone = {},
		phoneColor = "",
		phoneMarkup = "",
		phoneModel = "",
		phoneName = "",
		phoneOrientation = "",
		viewport = {},
		viewportId = containerId + "-viewport",
		glare = {},
		glareId = containerId + "-glare";
		
	var phones = [
		{ // Apple iPhone 
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
							'<div id="' + viewportId + '" class="iphone-viewport"></div>' +
						'</div>' +
						'<div class="iphone-bezel bottom">' +
							'<div class="iphone-button-home">' +
								'<div class="iphone-home-icon"></div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div id="' + glareId + '" class="iphone-glare"></div>' +	
				'</div>'
		}
	];
	
	wrap(0);
	//setGlare(false);

	// Sets the phone to use
	function setPhone(i) {
		
		phone = phones[i];
		phoneColor = phone.colors[0];
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
		container.innerHTML = phoneMarkup;

		// Insert the container into the parent node of contents
		//contents.parentNode.appendChild(container);
		contents.parentNode.insertBefore(container, contents.parentNode.childNodes[0]);

		// Move the contents into the phone's viewport
		viewport = document.getElementById(viewportId);
		viewport.appendChild(contents);

		glare = document.getElementById(glareId);
	}

	// Sets the phone color (if supported)
	function setColor(newColor) {

		if (phone.colors.indexOf(newColor) != -1) {
			container.className = container.className.replace(phoneColor, newColor);
			phoneColor = newColor;
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

	// Toggles the phone glare class
	function setGlare(isVisible) {

		var c = "interactive";

		if (!isVisible)
			container.classList.add(c);
		else
			container.classList.remove(c);
	}

	function onMouseOver() { setGlare(false); }
	function onMouseOut() { setGlare(true); }

	function setInteraction(isInteractive) {
		
		if (isInteractive) {
			container.addEventListener("mouseover", onMouseOver, true);
			container.addEventListener("mouseout", onMouseOut, true);
		}
		else {
			container.removeEventListener("mouseover", onMouseOver, true);
			container.removeEventListener("mouseout", onMouseOut, true);
		}
	}

	// The Public Functions
	this.color = function(newColor) {

		if (typeof newColor !== "undefined" && typeof newColor === "string") {
			setColor(newColor.toLowerCase());
		}
		else if (typeof newColor !== "undefined" && typeof newColor !== "string") {
			console.warn("An invalid type was provided to setColor()");
		}
		else return phoneColor;
	}

	this.model = function(newModel) {

		if (typeof newModel !== "undefined" && typeof newModel === "string") {
			setModel(newModel.toLowerCase());
		}
		if (typeof newModel !== "undefined" && typeof newModel !== "string") {
			console.warn("An invalid type was provided to setModel()");
		}
		else return phoneModel;	
	}

	this.orientation = function(newOrientation) {

		if (typeof newOrientation !== "undefined" && typeof newOrientation === "string") {
			setOrientation(newOrientation.toLowerCase());
		}
		if (typeof newOrientation !== "undefined" && typeof newOrientation !== "string") {
			console.warn("An invalid type was provided to setOrientation()");
		}
		else return phoneOrientation;
	}

	this.glare = function(isVisible) {

		if (typeof isVisible !== "undefined" && typeof isVisible === "boolean") {
			setGlare(isVisible);
		}
	}

	this.interactive = function(isInteractive) {
		
		if (typeof isInteractive !== "undefined" && typeof isInteractive === "boolean") {
			setInteraction(isInteractive);
		}
	}	
}