(function() {

	"use strict";

	var work = (function() {

		var items = [];

		function init(onDone) {

			if (items.length === 0) {

				$.getJSON("work/data.json", function(data) {
					
					items = data.items;
					runOnDone();
				});
			}
			else runOnDone();

			function runOnDone() {
				if (typeof onDone === "function") onDone();	
			}
		}

		function findItem(itemId) {

			for (var i = 0; i < items.length; i++) {
				if (itemId === items[i].id)
					return i;
			}

			return -1;
		}

		function prevItem(currentItemId) {

			var prevItem = findItem(currentItemId) - 1; 

			if (prevItem < 0)
				prevItem = items.length - 1;

			return items[prevItem];
		}

		function nextItem(currentItemId) {

			var nextItem = findItem(currentItemId) + 1; 

			if (nextItem >= items.length)
				nextItem = 0;

			return items[nextItem];
		}

		function setControls(targetId, currentItemId) {

			var container = document.getElementById(targetId),
				prev = prevItem(currentItemId),
				next = nextItem(currentItemId);

			container.classList.add("work-controls");
			
			container.innerHTML = (
				'<li class="all"><a href="work">See all</a></li>' +
				'<li class="jump">' +
					'<a href="work/' + prev.url + '" title="' + prev.title + '">Prev</a>' + '/' +
					'<a href="work/' + next.url + '" title="' + next.title + '">Next</a>' +
				'</li>'
			);
		}

		function setThumbnails(targetId, maxItems) {

			var container = document.getElementById(targetId),
				markup = "",
				max = items.length;
				
			container.classList.add("work-thumbnails");

			if (typeof maxItems === "number" && maxItems > 0) {
				
				max = maxItems;
				container.classList.add("limit");
			}

			for (var i = 0; i < max; i++) {

				markup += (
					'<li>' +
						'<a href="work/' + items[i].url + '" title="' + items[i].desc + '">' +
							'<img src="graphics/' + items[i].image + '" alt="' + items[i].title  + '">' +
						'</a>' +
					'</li>'
				);	
			}

			container.innerHTML = markup;
		}

		function setQuickNav(targetId, currentItemId) {

			var container = document.getElementById(targetId),
				controlsId = "work-controls",
				thumbnailsId = "work-thumbs",
				maxItems = 6;

			container.classList.add("wrap");

			container.innerHTML = (
				'<ul id="' + controlsId + '"></ul>' +
				'<ul id="' + thumbnailsId + '"></ul>'
			);

			setControls(controlsId, currentItemId);
			setThumbnails(thumbnailsId, maxItems);
		}

		return {

			quickNav : function(targetId, currentItemId) {

				init(function() {
					setQuickNav(targetId, currentItemId);
				});
			},

			thumbnails : function(targetId, maxItems) {
				
				init(function() {
					setThumbnails(targetId, maxItems);
				});
			}
		};

	})();
	
	this.work = function() { return work; }

}).call(this);