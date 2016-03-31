
function Fader(elementId, autoStart, hasNav) {
	
	var auto,
		autoTimer = 10000,
		container, 
		count, 
		current = 0, 
		slides,
		slideActive,
		slideNew;

	var canToggle = true,
		hasControls = false,
		slideBullets;

	init(elementId);

	// Initializes the object
	function init(elementId) {
		
		// Get the parent container
		if (typeof elementId === "string" && elementId.length !== 0) {
			
			// Check to ensure the element exists before setting it
			if (document.getElementById(elementId) !== null) {
				container = document.getElementById(elementId);
				
				// Now get the slides (should be > 0)
				if (container.getElementsByTagName("li").length !== 0) {

					slides = container.getElementsByTagName("li");
					count = slides.length;
					slideActive = slides[current];
				}
				else console.warn("No slides found within the parent container: " + container.id);

				// Now set up the fader
				container.classList.add("fader");

				for (var i = 0; i < count; i++) {
					
					var slide = slides[i];

					if (slide === slideActive) slide.classList.add("active");
				}

				if (typeof autoStart === "boolean" && autoStart === true) {
					startAutoPlay();
				}

			}
			else console.warn("Could not find the element with id: " + elementId);
		}
		else return false;
	}
	
	function change() {
		
		if (current >= count) current = 0;
		else if (current < 0) current = count - 1;

		//console.log("Swapping to slide: " + current);

		slideNew = slides[current];
		slideNew.classList.add("new");

		var listener = function(event) {
			slideActive.removeEventListener("webkitTransitionEnd", listener, false);
			slideActive.classList.remove("fade", "active");

			slideNew.addEventListener("webkitTransitionEnd", listener, false);
			slideNew.classList.add("active");
			slideNew.classList.remove("new");
			
			canToggle = true;
			slideActive = slideNew;
		}

		slideActive.addEventListener("webkitTransitionEnd", listener, false);
		slideActive.classList.add("fade");
		canToggle = false;

		// if there is a control widget update it
		if (hasControls) {

			// disable the previous bullet
			for (var i = 0; i < slideBullets.length; i++) {
				slideBullets[i].classList.remove("active");
			}
			slideBullets[current].classList.add("active");
		}
	}

	function startAutoPlay(delay) {
		
		clearInterval(auto);
		
		if (delay !== "number") delay = autoTimer;

		auto = setInterval( function() {
			change(current++);
		}, delay);
	}

	function stopAutoPlay() {
		clearInterval(auto);
	}

	function changeSlide(slide) {
		if (canToggle) {
			stopAutoPlay();
			if (current != slide) 
				change(current = slide);
		}
	}

	function prevSlide() {
		if (canToggle) {
			stopAutoPlay();
			change(current--);
		}
	}

	function nextSlide() {
		if (canToggle) {
			stopAutoPlay();
			change(current++);
		}
	}

	// The faders's public functions
	this.start = function(delay) { startAutoPlay(delay); }
	this.stop = function() { stopAutoPlay(); }
	this.prev = function() { prevSlide(); }
	this.next = function() { nextSlide(); }
	this.change = function(slide) { changeSlide(slide); }

	var controlsMarkup =
		'<div class="control"><button id="">prev</button></div>' +
		'<ul class="items">' +
			'<li><button class="active" onclick="kent.changeTo(0)"></button></li>' +
			'<li><button onclick="kent.changeTo(1)"></button></li>' +
			'<li><button onclick="kent.changeTo(2)"></button></li>' +
			'<li><button onclick="kent.changeTo(3)"></button></li>' +
		'</ul>' +
		'<div class="control"><button onclick="kent.next()">next</button></div>'

	// Adds a widget to control the slides
	this.controls = function(elementId) {

		var markup =
			'<div class="control"><button id="' + elementId + '_prev">prev</button></div>' +
			'<ul id="' + elementId + '_items" class="items"></ul>' +
			'<div class="control"><button id="' + elementId + '_next">next</button></div>'
		
		// Ensure the value is valid
		if (typeof elementId === "string" && elementId.length !== 0) {
			
			// Now ensure the element exists
			if (document.getElementById(elementId) !== null) {
				
				hasControls = true;

				// Set the core html				
				container = document.getElementById(elementId);
				container.innerHTML = markup; // set the core markup
					
				// Build the slide bullets
				var bullets = document.getElementById(elementId + "_items");
				
				for (var i = 0; i < slides.length; i++) {
					
					var bullet = document.createElement("li");
					bullet.innerHTML = "<button></button>";

					function onBulletClick(j) {
						return function() { changeSlide(j); }
					}

					bullet.onclick = onBulletClick(i);
					bullets.appendChild(bullet);
				}

				slideBullets = bullets.getElementsByTagName("li");
				slideBullets[current].classList.add("active");	

				// Set the prev and next buttons
				document.getElementById(elementId + "_prev").onclick = function() { prevSlide(); }
				document.getElementById(elementId + "_next").onclick = function() { nextSlide(); }
			}
		}
	} 
}

