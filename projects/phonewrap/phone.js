
var Phone = {

	wrappedItems : [],
	
	setColor : function(phoneId, color) {
		
		if (typeof color === 'string') {
			document.getElementById(phoneId).className +=  ' ' + color;
		}
	},

	setOrientation : function(phoneId, orientation) {

		if (typeof orientation === 'string') {
			document.getElementById(phoneId).className +=  ' ' + orientation;
		}
	},

	setVersion : function(phoneId, version) {

		if (typeof version === 'string') {

			for (var i = 0; i < this.wrappedItems.length; i++) {
				
				if (this.wrappedItems[i].output === phoneId) {
					
					var phone = document.getElementById(phoneId);
					
					if (typeof this.wrappedItems[i].version === 'undefined') {
						
						// Set the class name to the Phone's container
						phone.className +=  ' ' + version;

						// Store the version info
						this.wrappedItems[i].version = version;
					}
					else {
						
						var phoneClasses = phone.className.replace(this.wrappedItems[i].version, version);

						phone.className = phoneClasses.trim();

						if (version === "") {
							this.wrappedItems[i].version = undefined;
						}
						else {
							this.wrappedItems[i].version = version;
						}
					}

					return false;
				}
			}
		}
	},

	// source, output, orientation, fullscreen
	wrap : function(source, output, isFullscreen) {

		var container = document.createElement('div'),
			containerMarkup = '', 
			viewport = {}, 
			viewportId = output + '_viewport',
			viewportContents = document.getElementById(source),
			viewportHeaderId = output + '_header';

		container.setAttribute('id', output);
		container.setAttribute('class', 'iphone');

		containerMarkup = (
			'<div class="iphone_components">' +
				'<div class="iphone_frame"> ' +
					'<button class="power" disabled></button>' +
					'<button class="mute" disabled></button>' +
					'<button class="volume up" disabled></button>' +
					'<button class="volume down" disabled></button>' +
				'</div>' +
				'<div class="iphone_screen">' +
					'<header class="iphone_bezel">' +
						'<div class="camera"></div>' +
						'<div class="speaker"></div>' +
					'</header>' +
					'<div class="iphone_display">' +
						'<header id="' + viewportHeaderId + '"></header>' +
						'<div id="' + viewportId + '"></div>' +
					'</div>' +
					'<footer class="iphone_bezel">' +
						'<button class="home" disabled>' +
							'<div class="icon"></div>' +
						'</button>' +
					'</footer>' +
				'</div>' +
				'<div class="iphone_glare"></div>' +	
			'</div>'
		);

		container.innerHTML = containerMarkup;

		document.body.appendChild(container);

		if ((typeof isFullscreen === 'boolean') && (isFullscreen === false)) {
			
			var header = document.getElementById(viewportHeaderId),
				headerMarkup = '';

			header.setAttribute('class', 'iphone_display_header');

			headerMarkup = (
				'<div class="signal"></div>' +
				'<div class="time"><p>' + getTime() + '</p></div>' +
				'<div class="battery"><div class="charge"></div></div>'
			);

			header.innerHTML = headerMarkup;

			function getTime() {
				
				var date = new Date(),
					hours = date.getHours(),
					mins = date.getMinutes(),
					unit = 'AM';

				// Check the hours for PM
				if (hours >= 12) {
					unit = 'PM';
					hours = hours % 12;
				}
				
				if (hours === 0) {
					hours = 12;
				}

				// Check the minutes to ensure 2 digits (ie. presentation issue)
				if (mins < 10) {
					mins = '0' + mins;
				}

				var time = hours + ':' + mins + ' ' + unit;

				return time;
			}
		}

		viewport = document.getElementById(viewportId);
		viewport.appendChild(viewportContents);

		this.wrappedItems.push(
			{
				source : source,
				output : output,
				isFullscreen : isFullscreen
			}
		);
	}
}