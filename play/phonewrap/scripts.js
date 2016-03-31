function initOptions() {

	var button;

	// Bind the change color buttons

	button = getElement("button-option-black");
	$(button).click(function() { 
		changeColor(this, "black"); 
	});

	button = getElement("button-option-white");
	$(button).click(function() { 
		changeColor(this, "white"); 
	}).trigger("click");

	// Bind the change model buttons

	button = getElement("button-option-four");
	$(button).click(function() {
		changeModel(this, "four");
	});

	button = getElement("button-option-five");
	$(button).click(function() {
		changeModel(this, "five");
	}).trigger("click");

	// Bind the change orientation buttons

	button = getElement("button-option-portrait");
	$(button).click(function() {
		changeOrientation(this, "portrait");
	}).trigger("click");

	button = getElement("button-option-landscape");
	$(button).click(function() {
		changeOrientation(this, "landscape");
	});
}

function switchProperty(property, newActiveElement) {
	
	var category, propertyId;

	switch(property) {
		
		case "color":
			propertyId = "phone-options-color";
			break;
		
		case "model":
			propertyId = "phone-options-model";
			break;
		
		case "orientation":
			propertyId = "phone-options-orientation";
			break;
	}

	// Remove the active style from the old item and apply it to the new item
	category = getElement(propertyId);
	$(category).find("button").removeClass("active");
	
	$(newActiveElement).addClass("active");
}

function changeColor(element, newColor) {
	
	switchProperty("color", element);
	phone.color(newColor);
}

function changeModel(element, newModel) {
	
	switchProperty("model", element);
	phone.model(newModel);
}

function changeOrientation(element, newOrientation) {
	
	switchProperty("orientation", element);
	phone.orientation(newOrientation);
}

function getElement(elementId) {
	return document.getElementById(elementId);
}