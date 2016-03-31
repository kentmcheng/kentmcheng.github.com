(function() {
	
	'use strict';

	var TYPE_ARRAY = 0,
		TYPE_OBJECT = 1;

	var apiKey = 'gZnhSeFYTiDjRCyeX3Rb',
		apiURL = 'http://api.translink.ca/rttiapi/v1/',
		apiReturnSize = 3,		// the number of times to return for a given bus
		apiSearchRadius = 300,	// the search radius for stops (in meters)
		apiTimeFrame = 120; 	// the search window for upcoming buses (in minutes)
	
	var date = '2015.06.10',
		version = '1.0';
		
	var busesPanel = {},
		infoPanel = {},
		stopsPanel = {},
		searchPanel = {},
		searchField = {},
		splashPanel = {};

	var	isFetching = false;


	// BASIC HELPER FUNCTIONS	
	function createElement(tag) {
		return document.createElement(tag);
	}

	function getElement(id) {
		return document.getElementById(id);
	}

	function getType(item) {
		
		switch(Object.prototype.toString.call(item)) {
			case '[object Array]':
				return TYPE_ARRAY;
			case '[object Object]':
				return TYPE_OBJECT;
			default:
				return -1;
		}
	}

	function setKeypadSize() {

		var wasHidden = false;

		// Ensure the search panel isn't hidden
		if (searchPanel.style.display === 'none') {
			searchPanel.style.display = '';
			wasHidden = true;
		}

		// Calculate the button sizing
		var panelContents = panel.content(searchPanel),
			maxButtonWidth = Math.floor(panelContents.offsetWidth/3), 	// 3 buttons per row
			maxButtonHeight = Math.floor(panelContents.offsetHeight/4),	// 4 rows of buttons
			maxButtonSize = Math.min(maxButtonWidth, maxButtonHeight),
			buttonSize = Math.floor(maxButtonSize * 0.75);

		console.log("New keypad button size = " + buttonSize + ' (' + maxButtonSize + ')');

		$(panelContents).find('button').css({'width' : buttonSize});

		// Rehide the search panel if it was hidden
		if (wasHidden) searchPanel.style.display = 'none';
	}



	function init() {

		// Check for touch support
		if (!('ontouchstart' in window)) 
			$('html').addClass('no-touch');

		// Check if standalone
		if (window.navigator.standalone) 
			$('html').addClass('standalone');

		// Grab the content panels
		busesPanel = getElement('nb-buses');
		// errorPanel = getElement('nb-error');
		infoPanel = getElement('nb-info');
		stopsPanel = getElement('nb-stops');
		searchPanel = getElement('nb-search');
		splashPanel = getElement('nb-splash');
		
		// Initialize the panels
		initBusesPanel();
		initInfoPanel();
		initSearchPanel();
		initStopsPanel();

		view.init(); // initialize the view controller
		
		// Grab the user's location to load their nearest stops
		navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {enableHighAccuracy : true, timeout : 5000});
		
		// Temp for testing
		//setTimeout(test.geoSuccess, 1000);

		var runKeypadSizing = debounce(function() {
			setKeypadSize();
		}, 250);

		window.addEventListener('resize', runKeypadSizing);
	}

	function initBusesPanel() {

		panel.init(busesPanel);

		// Set the secondary to be a back button
		var secondaryButton = panel.secondary(busesPanel);
		secondaryButton.classList.add('fa', 'fa-chevron-left');

		$(secondaryButton).on('click', view.back);
	}

	function initInfoPanel() {

		panel.init(infoPanel);
		
		// Set the heading
		var heading = panel.heading(infoPanel);
		heading.textContent = 'Help & Info';
		
		// Set the primary to be a reload button
		var primaryButton = panel.primary(infoPanel);
		primaryButton.classList.add('fa', 'fa-repeat');

		$(primaryButton).on('click', function() {
			location.reload();
		});
		
		// Set the secondary to be close button
		var secondaryButton = panel.secondary(infoPanel);
		secondaryButton.classList.add('fa', 'fa-close');

		$(secondaryButton).on('click', view.back);

		// Set the contents
		var content = panel.content(infoPanel);
		content.classList.add('scrollable');

		$(content).html(
			'<div>' +
				'<h1>Favorites</h1>' +
				'<p><em>Coming soon! Save your favorite stops to see your next upcoming buses even faster.</em></p>' +
				'<h1>Next Bus Info</h1>' +
				'<p>Version ' + version + ' - ' + date + '</p>' +
				'<p>This service is powered by the TransLink Open API. The data used in this product and service is provided by permission of TransLink. TransLink assumes no responsibility for the accuracy or currency of the data used in this product and service.</p>' +
				'<p>If you need more complete transit info, you can visit the <a href="http://www.translink.ca">TransLink website</a> for their complete suite of info, links and services.</p>' +
				'<p>For bugs and feedback you can contact me <a href="mailto:kentmcheng@gmail.com">here</a>.</p>' +
				'<h1>Special Thanks</h1>' +
				'<p>A special thanks to <a href="http://fontawesome.io">Font Awesome</a> by Dave Gandy and <a href="http://emojisymbols.com/">EmojiSymbols Font</a> by Kenichi Kaneko. The interface was designed using these awesome icon font packs.</p>' +
			'</div>'
		);
	}

	function initStopsPanel() {

		panel.init(stopsPanel);

		// Set the primary to be a search button
		var primaryButton = panel.primary(stopsPanel);
		primaryButton.classList.add('fa', 'fa-search');

		$(primaryButton).on('click', showSearch);

		// Set the secondary to be a help button
		var secondaryButton = panel.secondary(stopsPanel);
		secondaryButton.classList.add('fa', 'fa-question-circle');

		$(secondaryButton).on('click', showInfo);
	}

	function initSearchPanel() {

		panel.init(searchPanel);

		// Set the heading
		var heading = panel.heading(searchPanel);
		heading.textContent = 'Find a Stop'; 

		// Set the secondary to be a back button
		var secondaryButton = panel.secondary(searchPanel);
		secondaryButton.classList.add('fa', 'fa-chevron-left');
		
		$(secondaryButton).on('click', view.back);
		
		// Set the contents
		var content = panel.content(searchPanel),
			searchContents = createElement('div'),
			display = createElement('div'),
			keypad = createElement('ul');

		// Build the search's display

		display.id = searchPanel.id + '-display';
		display.innerHTML = '<input id="' + searchPanel.id +'-field" type="text" placeholder="Stop Number" maxlength="5" disabled>';

		// Calculate the button sizing
		var maxButtonWidth = Math.floor(content.offsetWidth/3),
			maxButtonHeight = Math.floor(content.offsetHeight/4),
			maxButtonSize = Math.min(maxButtonWidth, maxButtonHeight),
			buttonSize = Math.floor(maxButtonSize * 0.75),
			buttonIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'empty', '0', 'delete'],
			buttonValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0, -1];

		console.log("Button size: " + buttonSize + ' (' + maxButtonSize + ')');

		// Build the search's keypad
		
		keypad.id = searchPanel.id + '-keypad';
		
		var x = 0;
		
		for (var i = 0; i < buttonIds.length/3; i++) { // 3 buttons per row
			
			var row = createElement('li');

			for (var j = 0; j < buttonIds.length/4; j++) { // 4 rows of buttons
				
				var button = createElement('button');

				button.id = searchPanel.id + '-button-' + buttonIds[x];
				button.setAttribute('data-keypad-value', buttonValues[x]);
				button.style.width = buttonSize + 'px';

				$(button).html(
					'<img src="images/sprite.png">' +
					'<span>' + buttonIds[x] + '</span>' 
				);

				row.appendChild(button);
				x++;
			}

			keypad.appendChild(row);
		}
		
		searchContents.appendChild(display);
		searchContents.appendChild(keypad);

		// Add the search to the panel's content 
		content.appendChild(searchContents);

		// Set the behaviors for the display and keypad

		// Prevent any drag or scrolls (touch only)
		$(content).on('touchmove', function(e) {
			e.preventDefault();
		});

		// Set the feedback if a button is pressed
		// $('#search-keypad').on('mousedown touchstart', 'button', function() {
		// 	this.classList.add('active');
		// });

		// $(content).on('mouseup', function() {
			
		// 	$(this).find('.active').removeClass('active');
		// });

		// 

		searchField = getElement(searchPanel.id + '-field');

		$(keypad).on('click touchend', 'button', function(e) {

			e.preventDefault();

			//this.classList.remove('active');

			//console.log(e);

			var currTarget = e.currentTarget,
				ogEvent = e.originalEvent; // Check for objectType? MouseEvent/TouchEvent

			// Check if the release is still within the button bounds
			var x1 = currTarget.offsetLeft,
				x2 = currTarget.offsetLeft + currTarget.offsetWidth,
				y1 = currTarget.offsetTop,
				y2 = currTarget.offsetTop + currTarget.offsetHeight,
				x = 0,
				y = 0;

			// Check the event type (Mouse/Touch)
			//console.log(ogEvent);
			//console.log(Object.prototype.toString.call(ogEvent));
			var ogEventType = Object.prototype.toString.call(ogEvent);

			if (ogEventType === '[object MouseEvent]') {
				x = ogEvent.clientX;
				y = ogEvent.clientY;
			}
			else if (ogEventType === '[object TouchEvent]') {

				//console.log("HI");
				//console.log(ogEvent.changedTouches.);
				//clientXY, pageXY, screenXY
				x = ogEvent.changedTouches[0].clientX;
				y = ogEvent.changedTouches[0].clientY;

				//console.log("x, y: " + x + ", " + y);
			}
			
			
			var value = parseInt(this.getAttribute('data-keypad-value'));
			//console.log(value + ", " + Object.prototype.toString.call(value));
			if ( x >= x1 && x <= x2 ) {
				if ( y >= y1 && y <= y2 ) {
					
					updateSearch(searchField, value);
				}
			}
		});
	}
	

	function onGetBusesError(error) {

		console.log(error.Code + ', ' + error.Message);

		var title = 'Uh-oh',
			icon = 'es-sad',
			message = '';

		switch(error.Code) {
			
			case '10002': // db connection error
				
				message = 'There was a problem connecting to the database.';
				break;
			
			case '3001': // Invalid stop number
			case '3002': // Stop not found 
				
				title = 'Whoopsies!';
				icon = 'es-no';
				message = 'The stop number you entered does not exist. Please try again.';
				break;

			case '3005': // No stop estimates found (no buses?)
				message = 'There are no buses arriving in the next 2 hours. Better start walking or call that cab.';
				break;

			case '3003': // Unknown get estimates error
			case '3004': // Invalid route
			case '3006': // Invalid time frame
			case '3007': // Invalid count
				
				message = error.Message;
				break;
			
			default:
				
				message = 'There was a problem retrieving the information.';
		}

		// Set the heading
		var heading = panel.heading(busesPanel);
		heading.textContent = title;

		// Set the content
		var content = panel.content(busesPanel);
		
		$(content).html(
			'<div class="error">' +
				'<div class="es ' + icon + '"></div>' +
				'<p>' + message + '</p>' +
			'</div>'
		);
	}

	function onGetBusesSuccess(stopNo, buses) {

		var _buses = []; // stores the upcoming buses

		// Determine if the buses is an array or object
		if (getType(buses) === TYPE_OBJECT) { // stop has only 1 bus route arriving
			
			console.log('There is only 1 bus route for this stop.');
			
			nextBuses(buses);
		}
		else if (getType(buses) === TYPE_ARRAY) { // stop has multiple bus routes arriving
			
			console.log('There are ' + buses.length + ' different bus routes for this stop.');
			
			buses.forEach(function(item) {
				nextBuses(item);
			});
		}

		// Get the upcoming buses arriving for the route
		function nextBuses(busRoute) {

			var busNumber = busRoute.RouteNo.replace(/^0+/, ''), // and remove any leading zeros
				busSchedule = busRoute.Schedules.Schedule;

			// Determine if the schedule is an array or object
			if ( getType(busSchedule) === TYPE_OBJECT) { // only 1 bus arriving
				
				addBus(busSchedule);
			}
			else if ( getType(busSchedule) === TYPE_ARRAY ) { // multiple buses arriving
				
				busSchedule.forEach(function(item) {
					addBus(item);
				});
			}

			// Add the upcoming buses to the new list
			function addBus(info) {
				
				// Only add if the bus if it isn't cancelled
				if (info.CancelledTrip === 'false' ) { 
					
					var nextBus = {};

					nextBus.busNumber = busNumber;
					nextBus.busName = info.Destination;
					nextBus.eta = parseInt(info.ExpectedCountdown);

					_buses.push(nextBus);
				}
			}

		}

		// Sort the new bus list by their arrival times (soonest first)
		_buses.sort(function(a, b) { 
		    return a.eta - b.eta; 
		})

		// Build the markup for the bus list
		var busesList = createElement('ul');
		busesList.classList.add('item-list');

		_buses.forEach(function(item) {

			var mins = parseInt(item.eta),
				eta = '';

			if (mins < 0)
				eta = 'is leaving';
			else if ( mins === 0 || mins === 1)
				eta = 'now';
			else if (mins === 2) 
				eta = '< 2 mins';
			else 
				eta = mins + ' minutes';

			$(busesList).append(
				'<li>' +
					'<div class="bus">' +
						'<div class="bus-icon"><h1>' + item.busNumber + '</h1></div>' +
					'</div>' +
					'<div class="details"><h2>' + item.busName + '</h2><h1>' + eta + '</h1></div>' +
				'</li>'
			);

		});

		// Set the heading
		var heading = panel.heading(busesPanel);
		heading.textContent = 'Stop ' + stopNo;

		// Set the content
		var content = panel.content(busesPanel);
		content.innerHTML = '';
		content.appendChild(busesList);

		// Center the items in the list
		var scaleFactor = parseInt($('html').css('font-size')) / 10;
		var detailsMaxWidth1 = busesList.children[0].children[1].children[1].offsetWidth;
		var detailsMaxWidth2 = busesList.children[busesList.children.length-1].children[1].children[1].offsetWidth;
		var detailsWidth = (Math.max(detailsMaxWidth1, detailsMaxWidth2) + 5) / scaleFactor / 10;
		
		$(busesList).find('.details').css({ 'width' : detailsWidth.toFixed(1) + 'rem' });
	}
	
	function showBuses(stopNo, results, direction) {

		isFetching = false;

		if (results.NextBuses) { // we have bus data to work with
			
			onGetBusesSuccess(stopNo, results.NextBuses.NextBus);
		}
		else if (results.Error) { // there was an error retrieving the buses

			onGetBusesError(results.Error);
		}
		else throw new Error("Unknown results returned");

		panel.scrollCheck(busesPanel); // perform a scroll check

		view.advance(busesPanel, direction);
	}

	function showInfo() {

		// Its contents are static and set at initialization

		view.advance(infoPanel, 'up'); // shift upwards
	}

	function showSearch() {

		// Its contents are static, set at initialization

		// Clear the search input
		searchField.value = '';

		// Move the panel to the right panel
		view.advance(searchPanel, 'right');
	}

	function showFavoriteStop() {

		var stopNo = '60980',
			apiParameters = 'stops/' + stopNo + '/estimates?count=' + apiReturnSize + '&timeframe=' + apiTimeFrame;

		// Fetch the bus info for the stop
		getTranslinkData(apiParameters, function(results) {
			onGetBuses(stopNo, results);
		});

		var ready = function() {
			view.ready();
		}

		function onGetBuses(stopNo, results) {

			if (results.NextBuses) {

				var transitionIn = (function() {
					
					view.setRight(busesPanel);
					view.shiftRight(ready);

				})();

				showBuses(stopNo, results.NextBuses.NextBus, transitionIn);
			}
			else if (results.Error) {

				var transitionIn = (function() {
					
					view.setRight(errorPanel);
					view.shiftRight(ready);

				})();

				showError(results.Error, transitionIn);
			}
			else throw new Error("Unknown results returned");

		}
	}

	

	function getTranslinkData(apiParameters, callback) {

		// Escape if there is no parameters
		if (!apiParameters) return;

		// Use Yahoo YQL to handle the cross domain request

		var translinkURL = apiURL + apiParameters + '&apiKey=' + apiKey,
			yahooApiURL = 'https://query.yahooapis.com/v1/public/yql?',
			yahooApiQuery = 'q=' + encodeURIComponent('select * from xml where url="' + translinkURL + '"') + '&format=json&callback=?',
			url = yahooApiURL + yahooApiQuery;

		$.getJSON(url, cbFunc); // make the request

		// Use a defined function to prevent cache-busting
		function cbFunc(data) {

			var results = data.query.results;
			
			if (results) { // ensure we have results to work it

				console.log(results);
				
				// Run the results through the callback if provided
				if (typeof callback === 'function') {
					callback(results);
				}
			}
			else throw new Error('No results returned from Translink or Yahoo YQL.');
		}
	}

	// IF NO GEOLOCATION
	function onGeoError(positionError) {

		// console.log(positionError);

		var heading = panel.heading(stopsPanel),
			content = panel.content(stopsPanel),
			message = '',
			errorSearchLink = {},
			errorSearchLinkId = 'error-search-link';

		switch(positionError.code) {

			case 1: // PERMISSION_DENIED
				message = 'Access to your Geolocation was denied. ';
				break;

			case 2: // POSITION_UNAVAILABLE
				message = 'There was a problem retrieving your Geolocation. ';
				break;

			case 3: // TIMEOUT
				message = "Couldn't get your Geolocation in a timely manner. ";
				break;

			default:
				message = 'There was an unknown problem retrieving your Geolocation. ';
		}

		message += 'You can still <em id="' + errorSearchLinkId + '">search</em> for upcoming buses if you know the stop number.'

		heading.textContent = 'No Geolocation';

		$(content).html(
			'<div class="error">' +
				'<div class="es es-no"></div>' +
				'<p>' + message + '</p>' +
			'</div>'
		);

		errorSearchLink = getElement(errorSearchLinkId);
		$(errorSearchLink).on('click', showSearch);

		setTimeout(view.isReady, 500);
	}

	// WE HAVE THEIR POSITION
	function onGeoSuccess(position) {

		//console.log(position);

		var latitude = position.coords.latitude.toFixed(6),
			longitude = position.coords.longitude.toFixed(6),
			apiParameters = 'stops?lat=' + latitude + '&long=' + longitude + '&radius=' + apiSearchRadius;

		isFetching = true;
		getTranslinkData(apiParameters, onGetStops); // fetch the nearby stops
	}

	function onGetStops(results) {

		isFetching = false;

		var title = 'Nearby Stops',
			heading = panel.heading(stopsPanel),
			content = panel.content(stopsPanel);

		if (results.Stops) { // we have stop data to work with

			var stops = results.Stops.Stop;
			
			// Check if it's a single stop object (ie. there's only 1 stop)
			// and switch it to an array of stop objects
			if (getType(stops) === TYPE_OBJECT) {
				stops = [results.Stops.Stop];
			}

			// Build the list of stops

			var stopsList = createElement('ul'),
				routes = '',	// my formatted value
				onStreet = '',	// my formatted value
				atStreet = '';	// my formatted value

			stopsList.classList.add('item-list');
				
			stops.forEach(function(item) {

				// Filter out stops that don't have any bus routes
				if (item.Routes !== null) { 

					// Split the routes string into individual routes
					var arr = item.Routes.split(',');

					// Trim the extra white space and remove the leading zeros
					for (var i = 0; i < arr.length; i++) 
						arr[i] = arr[i].trim().replace(/^0+/, '');

					routes = arr.join(', '); // rebuild the routes string

					// Format the street strings to be capitalized instead of all caps
					atStreet = item.AtStreet.toLowerCase().replace(/\b[a-z]/g, function(letter) {
						return letter.toUpperCase();
					});

					onStreet = item.OnStreet.toLowerCase().replace(/\b[a-z]/g, function(letter) {
						return letter.toUpperCase();
					});

					// Insert the stop's markup
					$(stopsList).append(
						'<li id="' + item.StopNo + '" class="">' +
							'<div class="sign"><h1>' + item.StopNo + '</h1></div>' +
							'<div class="desc"><h1>' + onStreet + ' &amp; ' + atStreet + '</h1><h2>' + routes + '</h2></div>' +
							'<div class="fa fa-angle-right"></div>' +
						'</li>'
					);
				}

			});

			// Set the contents to be the stops list
			content.appendChild(stopsList);

			// Set the behavior when a stop is selected
			$(stopsList).on('click', 'li', function() {
				
				if (!isFetching) {

					var stopNo = this.id,
						apiParameters = 'stops/' + stopNo + '/estimates?count=' + apiReturnSize + '&timeframe=' + apiTimeFrame;

					// Fetch the bus info for the stop
					isFetching = true;
					getTranslinkData(apiParameters, function(results) {
						showBuses(stopNo, results, 'right');
					});
				}

			});
		} 
		else if (results.Error) { // there was an error getting the stops

			console.log('Error code: ' + results.Error.Code + ', ' + results.Error.Message);

			title = 'Oh-noes!'; // set the title
			
			var message = '';

			switch(results.Error.Code) {

				case '1012': // No stops found
					
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

			$(content).html(
				'<div class="error">' +
					'<div class="es es-sad"></div>' +
					'<p>' + message + '</p>' +
				'</div>'
			);
		} 
		else throw new Error('Unknown results returned');

		// Set the heading
		heading.textContent = title;

		panel.scrollCheck(stopsPanel);

		setTimeout(view.isReady, 500);
	}

	function updateSearch(searchField, keypadButtonValue) {

		var stopNo = '';

		if (!isFetching) {

			if (keypadButtonValue >= 0) { // append the value (0-9) to the field
			
				if (searchField.value.length < 5) { // ignore if the value is already filled (max 5 digits)

					stopNo = searchField.value.concat(keypadButtonValue);
					searchField.value = stopNo;

					// Perform the search if the field is completed
					if (stopNo.length === 5) { // get the bus info for that stop

						var apiParameters = 'stops/' + stopNo + '/estimates?count=' + apiReturnSize + '&timeframe=' + apiTimeFrame;

						isFetching = true; // block multiple searches
						getTranslinkData(apiParameters, function(results) {
							showBuses(stopNo, results, 'right-2x');
						});
					}
				}
			}
			else { // remove a digit from the field
				
				if (searchField.value.length !== 0) { 
					
					stopNo = searchField.value.substring(0, searchField.value.length - 1);
					searchField.value = stopNo;
				}
			}
		}
	}



	this.init = function() { init(); }
	this.vt = function() { return view; }


	var panel = (function() {

		var contentAffix = '-content',
			headingAffix = '-heading',
			primaryButtonAffix = '-primary',
			secondaryButtonAffix = '-secondary';

		return {
			
			init : function(panel) {

				var header = createElement('header'),
					content = createElement('div'),
					components = document.createDocumentFragment();

				$(header).html(
					'<button id="' + panel.id + secondaryButtonAffix + '"></button>' +
					'<h1 id="' + panel.id + headingAffix + '"></h1>' +
					'<button id="' + panel.id + primaryButtonAffix + '"></button>'
				);

				// Prevent any drag or scrolls (touch only)
				// $(header).on('touchmove', function(e) {
				// 	e.preventDefault();
				// });

				content.id = panel.id + contentAffix;
				content.classList.add('contents');

				components.appendChild(header);
				components.appendChild(content);

				panel.appendChild(components);
			},

			heading : function(panel) {
				return getElement( panel.id + headingAffix );
			},

			primary : function(panel) {
				return getElement( panel.id + primaryButtonAffix );
			},

			secondary : function(panel) {
				return getElement( panel.id + secondaryButtonAffix );
			},

			content : function(panel) {
				return getElement( panel.id + contentAffix );
			},

			scrollCheck : function(panel) {
				
				var content = getElement( panel.id + contentAffix );

				//console.log("Scroll check for panel: " + panel.id);
				//console.log(content);

				if (content.childNodes.length === 0) return; // stop if content has no children

				if (content.firstChild.offsetHeight > content.offsetHeight)
					content.classList.add('scrollable');
				else 
					content.classList.remove('scrollable');
			}
		};

	})();

	var test = (function() {

		var position = {};

		return {

			geoError : function() {

				position.coords = {
					latitude : 47.6097,
					longitude : 122.3331
				}
				onGeoSuccess(position);
			},

			geoSuccess : function() {
				
				// position.coords = { // W King Ed & Cartier
				// 	latitude : 49.2495229,
				// 	longitude : -123.1370462
				// }

				// position.coords = { // W Cloverleaf & Granville
				// 	latitude : 49.2665576,
				// 	longitude : -123.1393703
				// }

				position.coords = { // Granville & Georgia
					latitude : 49.282576,
					longitude : -123.118099
				}

				onGeoSuccess(position);
			}
		};

	})();

	var view = (function() {

		var panelTransforms = []; // to store panels with active transforms

		return {

			init : function() {

			},

			isReady : function() {
				
				$(splashPanel).on('transitionend', function() {
					$(this).off('transitionend');
					$(this).hide();
					panelTransforms.push(stopsPanel);
				});

				$(splashPanel).addClass('ready');
			},

			advance : function(nextPanel, direction) {

				// Add the new panel to the end of the transform list
				// and add the new direction class to each panel in the list

				panelTransforms.push(nextPanel);

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
			}
		}

	})();

}).call(this);


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
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
};

/*

var myEfficientFn = debounce(function() {
	// All the taxing stuff you do
}, 250);

window.addEventListener('resize', myEfficientFn);

*/




/*
	http://api.translink.ca/rttiapi/v1/stops/50537/estimates?apikey=gZnhSeFYTiDjRCyeX3Rb
*/