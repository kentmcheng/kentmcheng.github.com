
function Slideshow(elementId, autoStart) {
	
	var autoPlay = {},
		autoPlayInterval = 5000,	// autoplay switch interval
		slides = {}, 				// a list of the slides
		activeSlide = 0, 			// the index of the active slide
		activeClass = "active",		// the class name to apply to the active slide element 	
		hasControls = false,
		slideBullets = {};

	// Initialize the object
	if (typeof elementId === "string" && elementId.length > 0) {

		var container = document.getElementById(elementId);

		if (container) {

			slides = container.getElementsByTagName("li");

			if (slides.length === 0)
				console.warn("No slides found within the target.");

			container.classList.add("slideshow");
			slides[activeSlide].classList.add(activeClass);

			// Enable autoplay?
			if (typeof autoStart === 'boolean' && autoStart === true)
				startAutoPlay();
		}
		else console.warn("No element found with id: " + elementId);
	}
	else console.warn("The elementId should be a string.");
	

	function startAutoPlay() {

		stopAutoPlay();
		
		autoPlay = setInterval(function() {
			change(activeSlide + 1);
		}, autoPlayInterval);
	}

	function stopAutoPlay() {
		clearInterval(autoPlay);
	}

	function change(newSlide) {

		if (newSlide !== activeSlide) {

			activeSlide = newSlide;

			// Check if we need to wrap
			if (activeSlide >= slides.length) 
				activeSlide = 0;
			else if (activeSlide < 0) 
				activeSlide = slides.length - 1;

			// Update the slide elements
			for (var i = 0; i < slides.length; i++) {
				if (i === activeSlide) {
					slides[i].classList.add(activeClass);
					if (hasControls) slideBullets[activeSlide].classList.add(activeClass);
				}
				else {
					slides[i].classList.remove(activeClass);
					if (hasControls) slideBullets[i].classList.remove(activeClass);
				}		
			}
		}
	}

	function changeSlide(newSlide) {
		stopAutoPlay();
		change(newSlide);
	}

	function changeInterval(newInterval) {
		autoPlayInterval = newInterval;
		startAutoPlay();
	}

	function prevSlide() {
		changeSlide(activeSlide - 1);
	}

	function nextSlide() {
		changeSlide(activeSlide + 1);
	}

	// The faders's public functions
	this.start = function() { startAutoPlay(); }
	this.stop = function() { stopAutoPlay(); }
	this.prev = function() { prevSlide(); }
	this.next = function() { nextSlide(); }
	this.change = function(newSlide) { changeSlide(newSlide); }
	this.interval = function(newInterval) { changeInterval(newInterval); }

	// Set a container for the controls
	this.controls = function(elementId) {

		if (typeof elementId === "string" && elementId.length > 0) {
			
			var bulletsContainerId = elementId + '_items',
				prevButtonId = elementId + '_prev',
				nextButtonId = elementId + '_next'; 

			var markup = 
				'<button id="' + prevButtonId + '" class="controls">Prev</button>' +
				'<ul id="' + bulletsContainerId + '"></ul>' +
				'<button id="' + nextButtonId + '" class="controls">Next</button>';

			var container = document.getElementById(elementId);

			if (container) {
				
				container.classList.add("slideshow_controls");
				container.innerHTML = markup;

				var bulletsContainer = document.getElementById(bulletsContainerId);
				
				for (var i = 0; i < slides.length; i++) {
					
					var bullet = document.createElement("li");
					bullet.innerHTML = "<button></button>";

					function onBulletClick(j) {
						return function() { changeSlide(j); }
					}

					bullet.onclick = onBulletClick(i);
					bulletsContainer.appendChild(bullet);
				}

				slideBullets = bulletsContainer.getElementsByTagName("li");
				slideBullets[activeSlide].classList.add(activeClass);	

				// Set the prev and next buttons
				document.getElementById(prevButtonId).onclick = function() { prevSlide(); }
				document.getElementById(nextButtonId).onclick = function() { nextSlide(); }

				hasControls = true;
			}
			else console.warn("No element found with id: " + elementId);
		}
		else console.warn("The elementId should be a string.");
	}
}

