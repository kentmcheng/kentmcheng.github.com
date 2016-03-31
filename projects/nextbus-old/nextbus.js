var Test = {
	position : {
		coords : { 
			accuracy : '50',
			latitude : '47.6097',
			longitude : '122.3331'
		}
	},
	error : function(code) {
		
		var url;

		switch(code) {

			case 1012 :
				
				url = Nextbus.apiURL + 'stops?lat=47.6097&long=122.3331&radius=300&apikey=' + Nextbus.apiKey;
				return url;
			
			case 100012 : 
		}
	}
}

var Nextbus = {
				
	apiKey : 'gZnhSeFYTiDjRCyeX3Rb',
	apiURL : 'http://api.translink.ca/rttiapi/v1/',
	apiRadius : 300, // the search radius for stops (meters)
	apiTimeframe : 120, // the search window for buses (minutes)
	apiCount : 3, // the max number of times to return for a bus
	version : "0.1.0",

	// INITIALIZES THE WEB APP //
	init : function() {

	    this.activePanel = {};
		this.busesPanel = {};
		this.errorPanel = {};
		this.infoPanel = {};
		this.infoButton = {};
		this.searchPanel = {};
		this.stopsPanel = {};
		this.buses = [];
		this.stops = [];

		// Set the target container and the core markup
		var target = $('#nextbus');
		
		target.html(
			'<header><button id="info_btn"></button></header>' +
			'<section id="contents">' +
				'<div id="error_panel" class="panel"></div>' +
				'<div id="info_panel" class="panel"></div>' +
				'<div id="buses_panel" class="panel"></div>' +
				'<div id="search_panel" class="panel"></div>' +
				'<div id="stops_panel" class="panel"></div>' +
			'</section>'
		);
		
		// Store the panels as jquery objects
		Nextbus.busesPanel = $('#buses_panel');
		Nextbus.errorPanel = $('#error_panel');
		Nextbus.infoPanel = $('#info_panel');
		Nextbus.searchPanel = $('#search_panel');
		Nextbus.stopsPanel = $('#stops_panel');

		// Initialize the panels
  		Nextbus.initBusesPanel();
  		Nextbus.initErrorPanel();
	    Nextbus.initInfoPanel();
	    Nextbus.initSearchPanel();
	    Nextbus.initStopsPanel();

	    Nextbus.infoButton = $('#info_btn');

	    // Grab the user's geolocation
	    console.log("Grabbing your geolocation...");
		navigator.geolocation.getCurrentPosition(Nextbus.initSuccess, Nextbus.initError, {enableHighAccuracy : true, timeout : 5000});
	},

	// ON A SUCCESSFUL APP INIT - USE THE POSITION RETURNED TO FIND THE CLOSEST STOPS //
	initSuccess : function(position) {

		var latitude = position.coords.latitude.toFixed(6),
			longitude = position.coords.longitude.toFixed(6),
			url = Nextbus.apiURL + 'stops?lat=' + latitude + '&long=' + longitude + '&radius=' + Nextbus.apiRadius + '&apikey=' + Nextbus.apiKey;

		// [UT POINT] //
		//url = Test.error(1012);

		// Fetch the info from Translink
		requestCrossDomain(url, function(results) {
			
	  		// Parse the results from XML to JSON
	  		var obj = $.xml2json(results);

	  		console.log('Stops resulting object...');
	  		console.log(obj);

	  		// Check the returned object for errors
		    if (obj.Code === undefined) { // it's all good
		    	
		    	// Take the list of stops and display them in the Stops panel
		    	Nextbus.stops = obj.Stop;
		    	Nextbus.showStops();
		    }
		    else { // doh an error, handle it!

		    	var	error = parseInt(obj.Code);

		    	Nextbus.initErrorPanel(false); // change the error panel to be non-hideable
		    	Nextbus.showError(error);
		    }
		});
		
		// Translinks doesn't support CORS
		// var req = $.ajax({

		// 	url: url,
		// 	method: "POST",
		// 	crossDomain: true,
			
		// 	dataType: "jsonp",
		// 	jsonp: false,
		// 	jsonpCallback: "onJSONPload",

		// 	beforeSend: function(xhr) {
		// 		xhr.setRequestHeader('Accept', '');
		// 		xhr.setRequestHeader("Accept", "application/JSON");
		// 	}

		// });

		// req.always(function(data){
		// 	console.log(data);
		// });

		
	},

	// ON A BAD APP INIT - HANDLE THE ERROR CASES //
	initError : function(error) {

	},

	// INITIALIZES THE APP'S BUSES PANEL //
	initBusesPanel : function(isHideable) {

		// Set the panel's core markup
		Nextbus.busesPanel.html(
			'<header>' +
				'<h1 id="bus_heading"></h1>' +
				'<button id="bus_heading_btn"></button>' +
			'</header>' +
			'<div id="bus_content" class="content">' +
				'<ul id="bus_list"></ul>' +
			'</div>'
		);

		// Set up the close button if the panel is hideable
		if (isHideable !== false) {
			
			var button = $('#bus_heading_btn');
			
			button.addClass('close'); // set the icon
		}
		
		Nextbus.busesPanel.hide();
	},

	// DISPLAYS THE UPCOMING BUSES FOR A STOP //
	showBuses : function(stopNo, returnPanel) {

		var buses = [],
			busHeading = $('#bus_heading'),
			busHeadingBtn = $('#bus_heading_btn'),
			busContent = $('#bus_content'),
			busList = $("#bus_list"),
			schedule = [],
			x = 0;

		// Set the panel's heading
		busHeading.html("Buses for Stop " + stopNo);

		// Set the return point for the panel's close button
		busHeadingBtn.click(function() {
			busHeadingBtn.off('click');
			Nextbus.switchPanel(returnPanel);
		});

		// Store the relevant bus info into a single array
		if (Nextbus.buses.length !== undefined) {
			
			for (var i = 0; i < Nextbus.buses.length; i++) {
			
				schedule = Nextbus.buses[i].Schedules.Schedule;
			
				for (var j = 0; j < schedule.length; j++) {

					buses[x] = {
						RouteNo : Nextbus.buses[i].RouteNo.replace(/^0+/, ''), // use regex to remove the leading zeros
						Destination : schedule[j].Destination,
						ExpectedCountdown : schedule[j].ExpectedCountdown
					}
					x++;
				}
			}
		}
		else { // single object

			schedule = Nextbus.buses.Schedules.Schedule;
			
			for (var i = 0; i < schedule.length; i++) {

				buses[x] = {
					RouteNo : Nextbus.buses.RouteNo.replace(/^0+/, ''), // use regex to remove the leading zeros
					Destination : schedule[i].Destination,
					ExpectedCountdown : schedule[i].ExpectedCountdown
				}
				x++;
			}
		}
					
		// Then sort the list by arrival time
		buses.sort(function(a, b) { 
		    return a.ExpectedCountdown - b.ExpectedCountdown;
		})

		// Build the list of upcoming buses
		busList.empty();

		for (var i = 0; i < buses.length; i++) {
			busList.append(
				"<li>" +
					"<div class='bus'><p>" + buses[i].RouteNo + "</p></div>" +
					"<div class='details'><h2>" + buses[i].Destination + "</h2><h1>" + buses[i].ExpectedCountdown + "</h1></div>" +
				"</li>"
			);
		}

		// Now switch and show the panel
		Nextbus.switchPanel(Nextbus.busesPanel, function(){

			// Check if the panel's contents needs to be scrollable
			if (busList.height() > busContent.height()) {
				
				busContent.addClass("scrollable").on("touchmove", function() {
					event.stopPropagation();
				});
			}
		});
	},

	// INITIALIZES THE APP'S ERROR PANEL //
	initErrorPanel : function(isHideable) {

		// Set the panel's core markup
		Nextbus.errorPanel.html(
			'<header>' +
				'<h1 id="error_heading">Whoopsies</h1>' +
				'<button id="error_heading_btn"></button>' +
			'</header>' +
			'<div id="error_content" class="content"></div>'
		);

		// Set up the close button if the panel is hideable
		if (isHideable !== false) {
			
			var button = $('#error_heading_btn');

			button.addClass('close'); // set the icon
		}

		Nextbus.errorPanel.hide();
	},

	// DISPLAYS THE ERROR PANEL WITH DETAILS AND OPTIONS // !!!INCOMPLETE!!!
	showError : function(error, returnPanel) {
		
		var errorHeadingBtn = $('#error_heading_btn'),
			errorContent = $('#error_content');

		// Set the return point for the panel's close button
		if (typeof returnPanel === 'object') {
			errorHeadingBtn.click(function() {
				errorHeadingBtn.off('click');
				Nextbus.switchPanel(returnPanel);
			});
		}
		
		switch(error) {
			
			case 1012 : // no stops found

				errorContent.html('<p>Sorry, there are no stops near your current location.</p>');

				break;

			case 3001 : // invalid stop number
			case 3002 : // stop number not found

				errorContent.html(
					'<p>' +
						'The stop number could not be found. ' +
						'Please try again and enter the exact 5 digit stop number.' +
					'</p>'
				);

				break;

			case 3005 : // no buses

				errorContent.html(
					'<p>' +
						'Sorry, there are no buses arriving within the next ' + Nextbus.apiTimeframe + ' minutes.' +
					'</p>'
				);

				break;

			case 10002 : // database connection error
				
				errorContent.html(
					'<p>' +
						'Sorry, there was a problem retrieving the info from Translink. ' +
					'</p>'
				);

				break;

			default : // unknown errors

				errorContent.html(
					'<p>' +
						'Sorry, an unknown error occurred with the app. ' +
						'Did you want to restart the app?' +
					'</p>' +
					'<button id="error_btn_restart">Restart</button>' +
					'<button id="error_btn_cancel">Cancel</button>'
				);

				var buttonRestart = $('#error_btn_restart'),
					buttonCancel = $('#error_btn_cancel');

				buttonRestart.click(function() {
					buttonRestart.off('click');
					Nextbus.init();
				});

				buttonCancel.click(function() {
					buttonCancel.off('click');
					Nextbus.switchPanel(returnPanel);
				});
		}

		// Now switch and show the panel
		Nextbus.switchPanel(Nextbus.errorPanel);
	},

	// INITIALIZES THE APP'S INFO PANEL //
	initInfoPanel : function(isHideable) {
		
		// Set the panel's core markup
		Nextbus.infoPanel.html(
			'<header>' +
				'<h1>Next Bus Info</h1>' +
				'<button id="info_heading_btn"></button>' +
			'</header>' +
			'<div id="info_content" class="content">' +
				'<p>Route and arrival data used in this product or service is provided by permission of TransLink. TransLink assumes no responsibility for the accuracy or currency of the Data used in this product or service.</p>' +
				'<p>Version ' + Nextbus.version + '</p>' + 
			'</div>'
		);

		// Set up the close button if the panel is hideable
		if (isHideable !== false) {
			
			var button = $('#info_heading_btn');

			button.addClass('close'); // set the icon
		}

		Nextbus.infoPanel.hide();
	},

	showInfo : function(returnPanel) {
		
		var infoHeadingBtn = $('#info_heading_btn');

		// Set the return point for the panel's close button 
		infoHeadingBtn.click(function() {
			
			infoHeadingBtn.off('click');
			
			Nextbus.switchPanel(returnPanel, function() {
				Nextbus.infoButton.show();
			});
		});

		Nextbus.switchPanel(Nextbus.infoPanel, function() {
			Nextbus.infoButton.hide();
		});
	},

	// INITIALIZES THE APP'S SEARCH PANEL //
	initSearchPanel : function(isHideable) {

		// Set the panel's core markup
		Nextbus.searchPanel.html(
			'<header>' +
				'<h1>Search for Stop <span id="search_value"></h1>' +
				'<button id="search_heading_btn"></button>' +
			'</header>' +
			'<div class="content">' +
				'<ul id="search_numpad">' +
					'<li><button id="numpad_btn_1">1</button><button id="numpad_btn_2">2</button><button id="numpad_btn_3">3</button></li>' +
					'<li><button id="numpad_btn_4">4</button><button id="numpad_btn_5">5</button><button id="numpad_btn_3">6</button></li>' +
					'<li><button id="numpad_btn_7">7</button><button id="numpad_btn_8">8</button><button id="numpad_btn_3">9</button></li>' +
					'<li><button id="numpad_btn_0">0</button></li>' +
				'</ul>' +
				'<footer><button id="search_value_del">Delete</button></footer>' +
			'</div>'
		);

		// Set up the close button if the panel is hideable
		if (isHideable !== false) {
			
			var button = $('#search_heading_btn');

			button.addClass('close'); // set the icon
		}

		// Set up the number pad
		var numpad = $('#search_numpad'),
			buttons = numpad.find('button'),
			buttonDel = $('#search_value_del'),
			buttonSize = Math.floor(numpad.width()/3),
			maxButtonSize = Math.floor(numpad.height()/4);
		
		// Determine the size of the buttons	
		if (buttonSize < maxButtonSize) {
			numpad.find('li').css({'height' : buttonSize});
		}
		else {
			numpad.find('li').css({'height' : maxButtonSize});
		}
		
		buttons.css({'width' : buttons.outerHeight()});

		// Set up the buttons
		buttons.click(function() {

			var x = parseInt($(this).html()); // get the button value as an int
			
			Nextbus.search(x);
		});

		// Remove the touch delays for the number pad
		new NoClickDelay(document.getElementById('search_numpad'));

		// Set up the delete button
		buttonDel.click(function() {
			Nextbus.search(false);
		});

		Nextbus.searchPanel.hide();
	},

	showSearch : function(returnPanel) {
		
		var searchValue = $('#search_value'),
			searchHeadingBtn = $('#search_heading_btn');

		// Clear the search value
		searchValue.empty();

		// Set the return point for the panel's close button
		searchHeadingBtn.click(function() {
			searchHeadingBtn.off('click');
			Nextbus.switchPanel(returnPanel);
		});

		// Now switch and show the panel
		Nextbus.switchPanel(Nextbus.searchPanel);
	},

	// SEARCHES FOR A STOP NUMBER //
	search : function(value) {
		
		var searchValue = $('#search_value'),
			stopNo;

		// Check if the value is numeric, otherwise other value types will be treated as delete actions
		if (typeof value === 'number') {
			
			//console.log("Adding search value: " + value);

			// First strip the quotations from the search value before appending the new value
			stopNo = searchValue.html().replace(/"/g, "").concat(value);

			// Now rebuild and display the new search value with quotations
			searchValue.html('\"' + stopNo + '\"');

			// Finally check if the search value is valid to perform a stop search
			if (stopNo.length === 5) {
				
				var url = Nextbus.apiURL + 'stops/' + stopNo + '/estimates?count=' + Nextbus.apiCount + '&timeframe=' + Nextbus.apiTimeframe + '&apikey=' + Nextbus.apiKey;

				// Fetch the Translink info and display the results
				requestCrossDomain(url, function(results) {
			  		
			  		// Parse the results from XML to JSON
				    var obj = $.xml2json(results);

				    console.log("Buses resulting object...");
				    console.log(obj);

				    // Check the returned object for errors
				    if (obj.Code === undefined) { // it's all good
				    	
				    	// Take the list of buses and display them in the Buses panel
				    	Nextbus.buses = obj.NextBus;
				    	Nextbus.showBuses(stopNo, Nextbus.searchPanel);
				    }
				    else { // doh an error, handle it!
				    	
				    	var	error = parseInt(obj.Code);

				    	Nextbus.showError(error, Nextbus.searchPanel);
				    }

				    // Clear the search value
			    	searchValue.empty();
				});
			}
		}
		else {

			stopNo = searchValue.html().replace(/"/g, "").slice(0, -1);

			if (stopNo.length > 0) {
				searchValue.html('\"' + stopNo + '\"');
			}
			else {
				searchValue.empty();
			}
		}
	},

	// INITIALIZES THE CLOSEST STOPS PANEL //
	initStopsPanel : function(callback) {

		// Set the core markup
		Nextbus.stopsPanel.html(
			'<header>' +
				'<h1>Stops Near You</h1>' +
				'<button id="stops_heading_btn" class="search"></button>' +
			'</header>' +
			'<div id="stops_content" class="content">' +
				'<ul id="stops_list"></ul>' +
			'</div>'
		);

		// Set up the search button
		var button = $('#stops_heading_btn');

		button.click(function() {
			Nextbus.showSearch(Nextbus.stopsPanel);
		});

		Nextbus.stopsPanel.hide();

		// Perform a callback function if one is passed
		if (typeof callback === 'function') {
			callback();
		}
	},

	// DISPLAYS THE CLOSEST STOPS //
	showStops : function() {

		var routes,
			stopsContent = $('#stops_content'),
			stopsList = $('#stops_list');

		// Build the list of stops
		for (var i = 0; i < Nextbus.stops.length; i++) {
			
			// Remove any leading zeros from the Translink routes data and then rebuild it
			routes =  Nextbus.stops[i].Routes.split(', '); 
			
			for (var j = 0; j < routes.length; j++) {
				routes[j] = routes[j].replace(/^0+/, '');
			}

			Nextbus.stops[i].Routes = routes.join(' ');

			// Add the markup for the each stop
			stopsList.append(
				'<li id="' + Nextbus.stops[i].StopNo + '" class="needsclick">' +
					'<div class="sign"><h1>' + Nextbus.stops[i].StopNo + '</h1><h2>' + Nextbus.stops[i].Routes + '</h2></div>' +
					'<div class="desc"><h1>' + Nextbus.stops[i].OnStreet + '</h1><h2>' + Nextbus.stops[i].AtStreet + '</h2></div>' +
				'</li>'
			);
		}

		// Set up the actions when a stop is selected
		stopsList.find('li').click(function() {

			// Get the stop number and form the url for the API request
			var stopNo = $(this).attr('id'),
				url = Nextbus.apiURL + 'stops/' + stopNo + '/estimates?count=' + Nextbus.apiCount + '&timeframe=' + Nextbus.apiTimeframe + '&apikey=' + Nextbus.apiKey;
			
			// Fetch the Translink info and display the results
			requestCrossDomain(url, function(results) {
		  		
		  		// Parse the results from XML to JSON
			    var obj = $.xml2json(results);

			    console.log("Buses resulting object...");
			    console.log(obj);

			    // Check the returned object for errors
			    if (obj.Code === undefined) { // it's all good
			    	
			    	// Take the list of buses and display them in the Buses panel
			    	Nextbus.buses = obj.NextBus;
			    	Nextbus.showBuses(stopNo, Nextbus.stopsPanel);
			    }
			    else { // doh an error, handle it!
			    	
			    	var	error = parseInt(obj.Code);

			    	Nextbus.showError(error, Nextbus.stopsPanel);
			    }
			});
		});

		// Now switch and show the panel
		Nextbus.switchPanel(Nextbus.stopsPanel, function() {

			// Set the info button
			Nextbus.infoButton.click(function() {
				Nextbus.showInfo(Nextbus.stopsPanel);
			});

			// Check if the panel's contents needs to be scrollable
			if (stopsList.height() > stopsContent.height()) {
				
				stopsContent.addClass("scrollable").on("touchmove", function() {
					event.stopPropagation();
				});
			}
		});
	},

	// DISPLAYS A PANEL //
	showPanel : function(panel) {
		
		panel.addClass('slideIn').on('webkitTransitionEnd', function() {
			panel.off('webkitTransitionEnd');
			Nextbus.activePanel = panel;
		});		
	},

	// SWAPS OUT THE CURRENT PANEL FOR A NEW PANEL //
	switchPanel : function(panel, callback) {

		panel.show();

		// Check if there is an active panel to swap with
		if (typeof Nextbus.activePanel.length === 'number') {
			
			// Ensure the panels are different
			if (Nextbus.activePanel !== panel) {
				
				Nextbus.activePanel.removeClass('slideIn').on('webkitTransitionEnd', function() {
					Nextbus.activePanel.off('webkitTransitionEnd').hide();
					Nextbus.showPanel(panel);
				});
			}
		}
		else {

			setTimeout(function() { // a slight delay is required to allow the transition to work
				Nextbus.showPanel(panel);
			}, 100);
		}

		if (typeof callback === 'function') {
			callback();
		}
	}
}

// PERFORMS A CROSS DOMAIN REQUEST //
function requestCrossDomain(site, callback) {
	
	// Exit if no url was passed
	if (!site) {
		return false;
	}
	
	// Take the provided url, and add it to a YQL query (encoded)
	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';
	
	// Request that YSQL string, and run a callback function
	$.getJSON(yql, cbFunc); // pass in a defined function to prevent cache-busting
	
	function cbFunc(data) {
	
		// Check if we have something to work with
		if (data.results[0]) {
		
			// Strip out all script tags, for security reasons.
			data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ''); // this helps, but we should do more
			
			// Check if a callback function was passed and send through the data
			if (typeof callback === 'function') {
				callback(data);
			}
		}
		// Otherwise we might have requested a site that doesn't exist, and nothing returned.
		else throw new Error('Nothing returned from getJSON.');
	}
}

// REMOVES THE TOUCH DELAY FROM ELEMENTS
function NoClickDelay(el) {
	this.element = typeof el == 'object' ? el : document.getElementById(el);
	if( window.Touch ) this.element.addEventListener('touchstart', this, false);
}

NoClickDelay.prototype = {
	
	handleEvent: function(e) {
		switch(e.type) {
			case 'touchstart': this.onTouchStart(e); break;
			case 'touchmove': this.onTouchMove(e); break;
			case 'touchend': this.onTouchEnd(e); break;
		}
	},

	onTouchStart: function(e) {
		e.preventDefault();
		this.moved = false;

		this.theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
		if(this.theTarget.nodeType == 3) this.theTarget = theTarget.parentNode;
		this.theTarget.className+= ' pressed';

		this.element.addEventListener('touchmove', this, false);
		this.element.addEventListener('touchend', this, false);
	},

	onTouchMove: function(e) {
		this.moved = true;
		this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
	},

	onTouchEnd: function(e) {
		this.element.removeEventListener('touchmove', this, false);
		this.element.removeEventListener('touchend', this, false);

		if( !this.moved && this.theTarget ) {
			this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
			var theEvent = document.createEvent('MouseEvents');
			theEvent.initEvent('click', true, true);
			this.theTarget.dispatchEvent(theEvent);
		}

		this.theTarget = undefined;
	}
};