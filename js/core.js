(function() {
	
	var menu = { // navigation menu
		
		items : [
			{
				label : "Play",
				desc : "Where I explore different ideas and designs."
			},
			{
				label : "Work",
				desc : "A collection of my recent projects."
			},
			{
				label : "About",
				desc : "Want to know more about me?"
			}
		],
		
		// Initializes and returns a nav menu
		init : function(menuId, activeMenuItem) {

			var menu = document.createElement("ul");

			menu.setAttribute("id", menuId);
			menu.classList.add("site-nav");

			for (var i = 0; i < this.items.length; i++) {

				var item = this.items[i],
					menuItem = document.createElement("li"),
					menuItemLink = document.createElement("a"),
					url = item.label.toLowerCase();

				menuItemLink.setAttribute("href", url);
				menuItemLink.setAttribute("title", item.desc);
				menuItemLink.innerHTML = item.label;

				// Check if the current item is the active item
				if (activeMenuItem.toLowerCase() === item.label.toLowerCase())
					menuItemLink.classList.add("active");

				menuItem.appendChild(menuItemLink);
				menu.appendChild(menuItem);
			}

			return menu;
		}
	};

	var page = { // core page

		init : function(activeMenuItem) {

			// Check for touch support

			var isTouchSupported = ("ontouchstart" in window);
			
			if (!isTouchSupported) $("html").addClass("no-touch");

			// Get the main page elements

			var page = document.getElementById("page"),
				pageHeader = document.getElementById("page-header"),
				pageBody = document.getElementById("page-body"),
				pageFooter = document.getElementById("page-footer");

			// Set up the main and mobile site navs

			var mainSiteNav = document.createElement("nav"),
				mobileSiteNav = document.createElement("nav");

			mainSiteNav.setAttribute("id", "main-nav")	
			mainSiteNav.appendChild(menu.init("main-nav-items", activeMenuItem));

			mobileSiteNav.setAttribute("id", "mobile-nav");
			mobileSiteNav.appendChild(menu.init("mobile-nav-items", activeMenuItem));
			
			// Set up the mobile nav trigger
			
			var mobileNavTrigger = document.createElement("button");
			
			mobileNavTrigger.setAttribute("id", "mobile-nav-trigger");

			$(mobileNavTrigger).click(function() {
				
				var page = document.getElementById("page"),
					mobileNav = document.getElementById("mobile-nav"),
					mobileNavMenu = document.getElementById("mobile-nav-items"),
					pageOffset = $(mobileNav).height(),
					translateY = "";

				// Check the visual state of the mobile nav and toggle accordingly
				if ($(mobileNavMenu).css("opacity") == 0) { // hidden
					
					translateY = "translateY(" + pageOffset + "px)";

					// Fade in the items and slide down to reveal the menu

					$(mobileNavMenu).css({ "opacity" : 1 });
					
					$(page).css({
						"-webkit-transform" : translateY,
						"transform" : translateY
					});
				}
				else { // visible

					// Fade out the items and slide up to hide the menu

					$(mobileNavMenu).css({ "opacity" : 0 });
					
					$(page).css({
						"-webkit-transform" : translateY,
						"transform" : translateY
					});
				}
			});

			// Insert the mobile site nav to the page
			$(page).before(mobileSiteNav);

			// Set up the page header

			var pageHeaderContents = document.createElement("div"),
				pageHeading = document.createElement("h1"),
				wrap = "wrap";

			pageHeaderContents.classList.add(wrap);

			pageHeaderContents.appendChild(mobileNavTrigger);
			pageHeading.innerHTML = "<a href='/'>Kent Cheng</a>";
			pageHeaderContents.appendChild(pageHeading);
			pageHeaderContents.appendChild(mainSiteNav);
			pageHeader.appendChild(pageHeaderContents);

			// Set up the page body
			// pageBody.classList.add(wrap);

			// Set up the page footer
			// pageFooter.classList.add(wrap);
			pageFooter.innerHTML = "<p class='wrap'>&copy; 2017 Kent Cheng</p>";	
		}
	};

	this.page = function() { return page; }

}).call(this);


function isStringValid(value) {
	
	if (typeof value === "string" && value.length > 0)
		return true;
	
	console.warn(value + " is not a string.");

	return false;
} 