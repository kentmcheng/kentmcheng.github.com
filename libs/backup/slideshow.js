function Slideshow(containerId, startIndex, autoPlay) {
	
	var autoChange = {},
		autoChangeInterval = 10000,	// switch interval (ms)
		slides = {}, 				// slide list
		activeSlide = 0,			// active slide index
		activeClass = "active",		// active slide class name
		bringToFrontClass = "front",
		hasControls = false,
		slideBullets = {};

	// Initialize the slideshow
	if (typeof containerId === "string") {

		var container = document.getElementById(containerId);

		if (container) {

			container.classList.add("screens");
			
			slides = container.getElementsByTagName("li");

			if (slides.length > 0) {

				container.classList.add("slideshow");

				if (typeof startIndex === "number") {
					
					if (startIndex < slides.length)
						activeSlide = startIndex;
				}

				// Create a new container that contains an image to size the screenshots	
				var newElem = document.createElement("div"),
					newImage = slides[activeSlide].childNodes[0].cloneNode(true);

				newElem.appendChild(newImage);
				container.insertBefore(newElem, container.childNodes[0]); // insert it as the first node

				// Set the active slide with the proper classes
				slides[activeSlide].classList.add(activeClass, bringToFrontClass);

				// if (typeof autoPlay === "boolean") {
				// 	if (autoPlay) startAutoChange();
				// }
				// else startAutoChange();
			}
			else console.warn("No slides found.");
		}
		else console.warn("The containerId doesn't exist.");
	}
	else console.warn("The containerId must be a string.");
	

	function startAutoChange() {

		stopAutoChange();
		
		autoChange = setInterval(function() {
			change(activeSlide + 1);
		}, autoChangeInterval);
	}

	function stopAutoChange() {
		clearInterval(autoChange);
	}

	function onFadeIn() {
		slides[activeSlide].removeEventListener("transitionend", onFadeIn);
		slides[activeSlide].classList.add(bringToFrontClass);
	}

	function change(newSlide) {

		if (typeof newSlide === 'number') {
			
			if (newSlide !== activeSlide) {

				// Do we need to wrap or not?
				if (newSlide >= slides.length)
					activeSlide = 0;
				else if (newSlide < 0)
					activeSlide = slides.length - 1;
				else 
					activeSlide = newSlide;

				// Update the markup
				for (var i = 0; i < slides.length; i++) {
					
					// Clear the transition end event (if present)
					slides[i].removeEventListener("transitionend", onFadeIn);
					
					if (i === activeSlide) {
						slides[i].addEventListener("transitionend", onFadeIn);
						slides[i].classList.add(activeClass);
						if (hasControls) slideBullets[activeSlide].classList.add(activeClass);
					}
					else {
						slides[i].classList.remove(activeClass, bringToFrontClass);
						if (hasControls) slideBullets[i].classList.remove(activeClass);
					}		
				}
			}
		}		
	}

	function changeSlide(newSlide) {
		stopAutoChange();
		change(newSlide);
	}

	function changeInterval(newInterval) {
		autoChangeInterval = newInterval || 5000;
		startAutoChange();
	}

	function prevSlide() {
		changeSlide(activeSlide - 1);
	}

	function nextSlide() {
		changeSlide(activeSlide + 1);
	}

	function setControls(containerId) {

		if (typeof containerId === "string") {
		
			var container = document.getElementById(containerId);

			if (container) {

				var bulletsContainerId = containerId + "-items",
					prevButtonId = containerId + "-prev",
					nextButtonId = containerId + "-next"; 

				var markup = 
					'<button id="' + prevButtonId + '" class="controls left"></button>' +
					'<ul id="' + bulletsContainerId + '"></ul>' +
					'<button id="' + nextButtonId + '" class="controls right"></button>';
				
				container.classList.add("slideshow-controls");
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
			else console.warn("The targetId (" + targetId + ") doesn't exist.");
		}
		else console.warn("The targetId must be a string.");
	}

	// The faders's public functions
	this.start = function() { startAutoChange(); }
	this.stop = function() { stopAutoChange(); }
	this.prev = function() { prevSlide(); }
	this.next = function() { nextSlide(); }
	this.change = function(newSlide) { changeSlide(newSlide); }
	this.controls = function(targetId) { setControls(targetId); }
	this.interval = function(newInterval) { changeInterval(newInterval); }
}

