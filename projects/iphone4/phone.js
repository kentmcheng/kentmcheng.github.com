var Phone = {
	
	init : function(wrapTargetId) {
		
		var contents = document.getElementById(wrapTargetId),
			phone = document.createElement('div'),
			phoneDisplay = '',
			phoneMarkup = 
				'<div class="front">' +
					'<div class="button power"></div>' +
					'<div class="button mute"></div>' +
					'<div class="button volume up"></div>' +
					'<div class="button volume down"></div>' +
					'<div class="bezel top"><div class="camera"></div><div class="speaker"></div></div>' +
					'<div class="display" id="phone_display"></div>' +
					'<div class="bezel bottom"><div class="home"><div class="icon"></div></div></div>' +	
				'</div>'

		phone.innerHTML = phoneMarkup;
		phone.setAttribute('id', 'phone');

		document.body.appendChild(phone);

		phoneDisplay = document.getElementById('phone_display');
		phoneDisplay.appendChild(contents);
	}
}
/*
function Phone(newWidth, newHeight, newUrl) {
	
	// Phone Variables
	var width = newWidth;
	var height = newHeight;
	var url = newUrl;
	var title;
	
	// Display Variables
	var landscapeState = false;
	var landscapeToggle = landscapeState;
	
	var systemBarState = true;
	var systemBarToggle = systemBarState;
	
	var browserBarState = true;
	var browserBarToggle = browserBarState;
	
	var browserControlsState = true;
	var browserControlsToggle = browserControlsState;
	
	var self = this;
	
	this.setWidth = function(x) {
		width = x;
		
		$("#phone_display").css({
			"width" : width
		});
		
		return width;
	}
	
	this.setHeight = function(x) {
		height = x;
		
		$("#phone_display").css({
			"height" : height
		});
		
		return height;
	}
	
	this.setURL = function(x) {
		url = x;
		
		$("#phone_display_browserbar input.url").attr("value", url);
		$("#phone_display_browserview iframe").attr("src", url);
		
		return url;
	}
	
	this.setTitle = function() {
		setTimeout(function() {
			title = $("#phone_display_browserview iframe").contents().find("title").html();
			$("#phone_display_browserbar h1").html(title);
		}, 1000);
	}
	
	this.init = function() {
		
		$("body").html(
			"<section id='phone'>" +	
				"<div class='components'>" +
					"<section class='bezel'><div class='speaker'></div></section>" +
					"<section id='phone_display'>" +
						"<div class='components'>" +
							"<section id='phone_display_systembar'></section>" +
							"<section id='phone_display_browserbar'>" +
								"<div class='components'>" +
									"<header><h1></h1></header>" +
									"<section>" +
										"<input class='url' type='text' value='' disabled='disabled'>" +
										"<input class='search' type='text' value='Google' disabled='disabled'>" +
									"</section>" +
								"</div>" +
							"</section>" +
							"<section id='phone_display_browserview'><iframe src='' scrolling='no'></iframe></section>" +
							"<section id='phone_display_browsercontrols'>" +
								"<ul>" +
									"<li></li>" +
									"<li></li>" +
									"<li></li>" +
									"<li></li>" +
									"<li></li>" +
								"</ul>" +
							"</section>" +
							"<section id='phone_display_controls'></section>" +
						"</div>" +
					"</section>" +
					"<section class='bezel'>" +
						"<button id='phone_home' class='home'></button>" +
					"</section>" +
				"</div>" +
			"</section>"				
		);
		
		$("#phone_display_controls").html(
			"<div class='components'>" +
				"<header>" +
					"<h1>Settings</h1>" +
					"<nav><button id='phone_display_controls_close'>Done</button></nav>" +
				"</header>" +
				"<section>" +
					"<ul>" +
						"<li>" +
							"<div class='label'>Display URL</div>" +
							"<div class='control'>" +
								"<input id='phone_display_controls_url' type='url' value=''>" +
							"</div>" +
						"</li>" +
						"<li>" +
							"<div class='label'>Display Width</div>" +
							"<div class='control'>" +
								"<input id='phone_display_controls_width' type='number' value='' min='320' max='480' step='10'>" +
							"</div>" +
						"</li>" +
						"<li>" +
							"<div class='label'>Display Height</div>" +
							"<div class='control'>" +
								"<input id='phone_display_controls_height' type='number' value='' min='480' max='640' step='10'>" +
							"</div>" +
						"</li>" +
					"</ul>" +
					"<ul>" +
						"<li>" +
							"<div class='label'>Lanscape Mode</div>" +
							"<div class='control'>" +
								"<button id='phone_display_controls_landscape'>" +
									"<div class='components'><section class='toggle'></section></div>" +
								"</button></div>" +
						"</li>" +	
						"<li>" +
							"<div class='label'>System Bar</div>" +
							"<div class='control'>" +
								"<button id='phone_display_controls_systembar'>" +
									"<div class='components'><section class='toggle'></section></div>" +
								"</button></div>" +
						"</li>" +
						"<li>" +
							"<div class='label'>Browser Bar</div>" +
							"<div class='control'>" +
								"<button id='phone_display_controls_browserbar'>" +
									"<div class='components'><section class='toggle'></section></div>" +
								"</button></div>" +
						"</li>" +
						"<li>" +
							"<div class='label'>Browser Controls</div>" +
							"<div class='control'>" +
								"<button id='phone_display_controls_browsercontrols'>" +
									"<div class='components'><section class='toggle'></section></div>" +
								"</button></div>" +
						"</li>" +
					"</ul>" +
				"</section>" +
			"</div>"
		);
		
		this.setWidth(width);
		this.setHeight(height);
		this.setURL(url);
		this.setTitle();
		
		// Bind Button Behaviors
		
		$("#phone_home").bind("click", function() {
			$("#phone_display_controls").addClass("slideIn");
		});
		
		$("#phone_display_controls_close").bind("click", function() {
			self.update();
			$("#phone_display_controls").removeClass("slideIn");
		});
		
		$("#phone_display_controls_landscape").bind("click", function() {
			self.switchLandscapeToggle();
		});
		
		$("#phone_display_controls_systembar").bind("click", function() {
			self.switchSystemBarToggle();
		});
		
		$("#phone_display_controls_browserbar").bind("click", function() {
			self.switchBrowserBarToggle();
		});
		
		$("#phone_display_controls_browsercontrols").bind("click", function() {
			self.switchBrowserControlsToggle();
		});
		
		this.initSettings();
	}
	
	this.initSettings = function() {
		
		$("#phone_display_controls_url").attr("value", url);
		$("#phone_display_controls_width").attr("value", width);
		$("#phone_display_controls_height").attr("value", height);
		
		$("#phone_display_controls_systembar .toggle").addClass("on");
		$("#phone_display_controls_browserbar .toggle").addClass("on");
		$("#phone_display_controls_browsercontrols .toggle").addClass("on");
	}
		
	this.switchLandscapeToggle = function() {
		if (landscapeToggle === false) {
			$("#phone_display_controls_landscape .toggle").addClass("on");
			landscapeToggle = true;
		}
		else {
			$("#phone_display_controls_landscape .toggle").removeClass("on");
			landscapeToggle = false;
		}
	}
	
	this.setLandscapeState = function(bool) {
		if (bool === true) {
			$("#phone").addClass("rotate");
			landscapeState = bool;
		}
		else {
			$("#phone").removeClass("rotate");
			landscapeState = bool;
		}
	}
	
	this.switchSystemBarToggle = function() {
		if (systemBarToggle === false) {
			$("#phone_display_controls_systembar .toggle").addClass("on");
			systemBarToggle = true;
		}
		else {
			$("#phone_display_controls_systembar .toggle").removeClass("on");
			systemBarToggle = false;
		}
	}
	
	this.setSystemBarState = function(bool) {
		if (bool === true) {
			$("#phone_display_systembar").show();
			systemBarState = bool;
		}
		else {
			$("#phone_display_systembar").hide();
			systemBarState = bool;
		}
	}
	
	this.switchBrowserBarToggle = function() {
		if (browserBarToggle === false) {
			$("#phone_display_controls_browserbar .toggle").addClass("on");
			browserBarToggle = true;
		}
		else {
			$("#phone_display_controls_browserbar .toggle").removeClass("on");
			browserBarToggle = false;
		}
	}
	
	this.setBrowserBarState = function(bool) {
		if (bool === true) {
			$("#phone_display_browserbar").show();
			browserBarState = bool;
		}
		else {
			$("#phone_display_browserbar").hide();
			browserBarState = bool;
		}
	}
	
	this.switchBrowserControlsToggle = function() {
		if (browserControlsToggle === false) {
			$("#phone_display_controls_browsercontrols .toggle").addClass("on");
			browserControlsToggle = true;
		}
		else {
			$("#phone_display_controls_browsercontrols .toggle").removeClass("on");
			browserControlsToggle = false;
		}
	}
	
	this.setBrowserControlsState = function(bool) {
		if (bool === true) {
			$("#phone_display_browsercontrols").show();
			browserControlsState = bool;
		}
		else {
			$("#phone_display_browsercontrols").hide();
			browserControlsState = bool;
		}
	}
	
	this.update = function() {
		var inputURL, inputWidth, inputHeight;
		
		// Capture and Compare
		inputURL = $("#phone_display_controls_url").attr("value");
		inputWidth = $("#phone_display_controls_width").attr("value");
		inputHeight = $("#phone_display_controls_height").attr("value");
		
		// If changed, refresh the display
		if ((inputURL != url) || (inputWidth != width) || (inputHeight != height) || 
			(landscapeToggle != landscapeState) || (systemBarToggle != systemBarState) || 
			(browserBarToggle != browserBarState) || (browserControlsToggle != browserControlsState)) {
			
			console.log("URL: " + inputURL + ", " + url);
			console.log("Width: " + inputWidth + ", " + width);
			console.log("Height: " + inputHeight + ", " + height);
			console.log("Landscape: " + landscapeToggle + ", " + landscapeState);
			console.log("System Bar: " + systemBarToggle + ", " + systemBarState);
			console.log("Browser Bar: " + browserBarToggle + ", " + browserBarState);
			console.log("Browser Controls: " + browserControlsToggle + ", " + browserControlsState);
			
			this.setWidth(inputWidth);
			this.setHeight(inputHeight);
			this.setURL(inputURL);
			this.setTitle();
			
			this.setLandscapeState(landscapeToggle);
			this.setSystemBarState(systemBarToggle);
			this.setBrowserBarState(browserBarToggle);
			this.setBrowserControlsState(browserControlsToggle);
		}
	}
		
}
*/