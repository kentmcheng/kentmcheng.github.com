(function() {

	'use strict';

	var play = (function() {

		var items = [
			{
				title: 'Granville Island',
				desc: 'Exploring the Island',
				url: 'granville-island'
			},
			{
				title: 'Street Parking',
				desc: 'Using Your Phone to Pay the Meter',
				url: 'ezpark'
			},
			{
				title: 'League of Legends',
				desc: 'Refining the eSports experience',
				url: 'lol-esports'
			},
			{
				title: 'Digital Sudoku',
				desc: 'A Design Paradox',
				url: 'sudoku'
			},
			{
				title: 'Food Menus',
				desc: 'Refining the Online Menu',
				url: 'e-menus'
			},
			{
				title: 'Phone Wrapper',
				desc: 'A Visual Emulator',
				url: 'phonewrap'
			}
		];

		return {
			
			items: function() { return items; },

			thumbnails: function(targetId) {
				
				var container = document.getElementById(targetId),
					itemList = document.createDocumentFragment();

				items.forEach(function(item) {
					
					var itemNode = document.createElement('li');
					
					itemNode.innerHTML = (
						
						'<a href="play/' + item.url + '">' +
							'<img src="play/' + item.url + '/thumb.jpg" alt="' + item.title + '">' +
							'<footer>' +
								'<h5>' + item.title + '</h5>' +
								'<h6>' + item.desc + '</h6>' +
							'</footer>' +
						'</a>'
					);

					itemList.appendChild(itemNode);
				});

				container.classList.add('thumbnails');
				container.appendChild(itemList);
			}
		};
	})();

	this.play = function() { return play; }

}).call(this);