function Slideshow(containerId, startIndex, autoPlay) {
	
	var slides = [], 
		activeSlideIndex = 0,
		autoChange = {},
		autoChangeInterval = 10000,	// switch interval (ms)
		changeBacklog = [],
		hasControls = false,
		changeBullets = [];

	var active = 'active',
		front = 'front',
		show = 'show';

	// Initialize the slideshow

	if (typeof containerId === 'string') {

		// Find the container holding the screenshots
		var container = document.getElementById(containerId);

		if (container) { // proceed if found

			//container.classList.add('screens');
			
			// Find the list of screenshots
			slides = container.getElementsByTagName('li');

			if (slides.length > 0) { // proceed if there's more than one

				container.classList.add('slideshow');

				// Adjust the starting active slide
				if (typeof startIndex === 'number') {
					
					if (startIndex < slides.length)
						activeSlideIndex = startIndex;
				}

				// Create a new container that contains one of the images to size the slideshow	
				var newContainer = document.createElement('div'),
					newImage = slides[activeSlideIndex].childNodes[0].cloneNode(true);

				newContainer.classList.add('hidden');	
				newContainer.appendChild(newImage);
				container.insertBefore(newContainer, container.childNodes[0]); // insert it as the first node

				// Set the active slide with the proper classes
				slides[activeSlideIndex].classList.add(active, front);

				// Should it automatically switch?
				if (typeof autoPlay === 'boolean') {
					if (autoPlay) startAutoChange();
				}
			}
			else console.warn('No slides found.');
		}
		else console.warn('The containerId does not exist.');
	}
	else console.warn('The containerId must be a string.');
	

	function startAutoChange() {

		stopAutoChange();
		
		autoChange = setInterval(function() {
			change(activeSlideIndex + 1);
		}, autoChangeInterval);
	}

	function stopAutoChange() {
		clearInterval(autoChange);
	}

	function onFadeOut() {
		
		// Reset all items in the backlog and then clear it

		changeBacklog.forEach(function(item) {
			item.removeEventListener('transitionend', onFadeOut);
			item.classList.remove(active, front, show);
		});

		changeBacklog = [];
		
		// Bring the new active slide to the front
		slides[activeSlideIndex].classList.add(active, front);
		slides[activeSlideIndex].classList.remove(show);
	}

	function change(newSlideIndex) {

		if (typeof newSlideIndex === 'number') {
			
			if (newSlideIndex !== activeSlideIndex) {

				// Add the prev slide to the backlog
				var prev = slides[activeSlideIndex];
				changeBacklog.push(prev);

				// Check if we need to wrap or not?
				if (newSlideIndex >= slides.length)
					activeSlideIndex = 0;
				else if (newSlideIndex < 0)
					activeSlideIndex = slides.length - 1;
				else 
					activeSlideIndex = newSlideIndex;

				// Show the new active slide and hide the prev slide

				slides[activeSlideIndex].classList.add(show);

				prev.addEventListener('transitionend', onFadeOut);
				prev.classList.remove('active');

				// Update the control bullets

				if (hasControls) {
					
					for (var i = 0; i < slides.length; i++) {
					
						if (i === activeSlideIndex)
							changeBullets[activeSlideIndex].classList.add(active);
						else
							changeBullets[i].classList.remove(active);
					}
				}
			}
		}		
	}

	function changeSlide(newSlideIndex) {
		
		stopAutoChange();
		change(newSlideIndex);
	}

	function changeInterval(newInterval) {
		
		autoChangeInterval = newInterval || 5000;
		startAutoChange();
	}

	function prevSlides() {
		changeSlide(activeSlideIndex - 1);
	}

	function nextSlide() {
		changeSlide(activeSlideIndex + 1);
	}

	function setControls(containerId) {

		if (typeof containerId === 'string') {
		
			var container = document.getElementById(containerId);

			if (container) {

				var bulletsContainerId = containerId + '-items',
					prevButtonId = containerId + '-prev',
					nextButtonId = containerId + '-next'; 

				var markup = 
					'<button id="' + prevButtonId + '" class="controls left"></button>' +
					'<ul id="' + bulletsContainerId + '"></ul>' +
					'<button id="' + nextButtonId + '" class="controls right"></button>';
				
				container.classList.add('slideshow-controls');
				container.innerHTML = markup;

				var bulletsContainer = document.getElementById(bulletsContainerId);
				
				for (var i = 0; i < slides.length; i++) {
					
					var bullet = document.createElement('li');
					bullet.innerHTML = '<button></button>';

					function onBulletClick(j) {
						return function() { changeSlide(j); }
					}

					bullet.onclick = onBulletClick(i);
					bulletsContainer.appendChild(bullet);
				}

				changeBullets = bulletsContainer.getElementsByTagName('li');
				changeBullets[activeSlideIndex].classList.add(active);	

				// Set the prev and next buttons
				document.getElementById(prevButtonId).onclick = function() { prevSlides(); }
				document.getElementById(nextButtonId).onclick = function() { nextSlide(); }

				hasControls = true;
			}
			else console.warn('The targetId (' + targetId + ') does not exist.');
		}
		else console.warn("The targetId must be a string.");
	}

	// The faders's public functions
	this.start = function() { 
		startAutoChange(); 
	}

	this.stop = function() { 
		stopAutoChange(); 
	}

	this.prev = function() { 
		prevSlides(); 
	}

	this.next = function() { 
		nextSlide(); 
	}
	
	this.change = function(newSlideIndex) { 
		changeSlide(newSlideIndex); 
	}

	this.controls = function(targetId) { 
		setControls(targetId); 
	}

	this.interval = function(newInterval) { 
		changeInterval(newInterval); 
	}
}

