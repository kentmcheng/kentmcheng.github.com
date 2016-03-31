(function() {

	var root = '',
		
	nav = { // Navigation Object
		
		menuItems : [
			{
				label : 'Blog',
				href : 'blog.html',
				desc : 'My Thoughts'
			},
			{
				label : 'Play',
				href : 'play.html',
				desc : 'A playground for my ideas.'
			},
			{
				label : 'Work',
				href : 'work.html',
				desc : 'A collection of my previous projects.'
			},
			{
				label : 'About',
				href : 'about.html',
				desc : 'Want to know more about me?'
			}
		],
		
		// Initializes the links into the nav menus
		init : function(activeMenuItem) {

			var href = '',
				menuItem = {},
				menuItemMarkup = '',
				mobileNavMenu = $('#mobile_nav_menu'),
				pageNavMenu = $('#page_nav_menu');

			for (var i = 0; i < this.menuItems.length; i++) {

				menuItem = this.menuItems[i];
				href = ' href="' + root + menuItem.href + '" title="' + menuItem.desc + '">';

				// Check if the current item is suppose to be the active item
				//  and if it is, style the active item accordingly
				if (activeMenuItem.toLowerCase() === menuItem.label.toLowerCase())
					menuItemMarkup = '<li><a class="active"' + href + menuItem.label + '</a></li>';
				else
					menuItemMarkup = '<li><a' + href + menuItem.label + '</a></li>';

				// Append the item to the respective menus
				mobileNavMenu.append(menuItemMarkup);
				pageNavMenu.append(menuItemMarkup);
			}
		}
	};

	this.getRoot = function() { return root; }

	this.initPage = function(activeMenuItem, newRoot) {
		
		var mobileNav = $('#mobile_nav'),
			pageHeader = $('#page_header'),
			pageFooter = $('#page_footer');

		// Set the core markup for each container

		mobileNav.html('<ul id="mobile_nav_menu"></ul>');

		pageHeader.html(
			'<button id="mobile_nav_btn"></button>' +
			'<h1>Kent Cheng</h1>' +
			'<nav><ul id="page_nav_menu"></ul></nav>'
		);

		pageFooter.html('<p>Copyright &copy; 2014 Kent Cheng</p>');

		// Set the mobile nav menu button and its behavior

		var mobileNavBtn = $('#mobile_nav_btn');

		mobileNavBtn.click(function() {
			
			var page = $('#page'),
				pageOffset = mobileNav.height(),
				mobileNavMenu = $('#mobile_nav_menu');
				translateY = '';

			// Check the visual state of the mobile nav menu
			// and toggle the visual styles accordingly
			if (mobileNavMenu.css('opacity') === '0') {
				
				translateY = 'translateY(' + pageOffset + 'px)';

				// Fade in and slide down the page to reveal the menu
				mobileNavMenu.css({ 'opacity' : '1' });
				
				page.css({
					'-webkit-transform' : translateY,
					'transform' : translateY
				});
			}
			else {

				// Fade out and slide up the page to hide the menu
				mobileNavMenu.css({ 'opacity' : '0' });
				
				page.css({
					'-webkit-transform' : translateY,
					'transform' : translateY
				});
			}
		});

		// Check if a new root path was provided and ensure it's valid
		if (typeof newRoot !== 'undefined') {
			if (typeof newRoot === 'string' && newRoot.length > 0) {
				root = newRoot;
			} else console.warn('newRoot should be a string.');	
		}

		// Now initialize the nav elements
		if (typeof activeMenuItem === 'string' && activeMenuItem.length > 0) {
			nav.init(activeMenuItem);
		} else console.warn('activeMenuItem should be a string.')
	}
	
}).call(this);

var Core = {

	nav : { // Navigation Object
		
		menuItems : [
			{
				label : 'Blog',
				href : 'blog.html',
				desc : 'My Thoughts'
			},
			{
				label : 'Play',
				href : 'play.html',
				desc : 'A playground for my ideas.'
			},
			{
				label : 'Work',
				href : 'work.html',
				desc : 'A collection of my previous projects.'
			},
			{
				label : 'About',
				href : 'about.html',
				desc : 'Want to know more about me?'
			}
		],
		
		// Initializes the links into the nav menus
		init : function(activeMenuItem) {

			var href = '',
				menuItem = {},
				menuItemMarkup = '',
				mobileNavMenu = $('#mobile_nav_menu'),
				pageNavMenu = $('#page_nav_menu');

			for (var i = 0; i < this.menuItems.length; i++) {

				menuItem = this.menuItems[i];
				href = ' href="' + Core.rootPath + menuItem.href + '" title="' + menuItem.desc + '">';

				// Check if the current item is suppose to be the active item
				//  and if it is, style the active item accordingly
				if (activeMenuItem.toLowerCase() === menuItem.label.toLowerCase())
					menuItemMarkup = '<li><a class="active"' + href + menuItem.label + '</a></li>';
				else
					menuItemMarkup = '<li><a' + href + menuItem.label + '</a></li>';

				// Append the item to the respective menus
				mobileNavMenu.append(menuItemMarkup);
				pageNavMenu.append(menuItemMarkup);
			}
		}
	},

	rootPath : '',

	// Initializes the page's core elements and components
	initPage : function(activeMenuItem, newRootPath) {
		
		var mobileNav = $('#mobile_nav'),
			pageHeader = $('#page_header'),
			pageFooter = $('#page_footer');

		// Set the core markup for each container

		mobileNav.html('<ul id="mobile_nav_menu"></ul>');

		pageHeader.html(
			'<button id="mobile_nav_btn"></button>' +
			'<h1>Kent Cheng</h1>' +
			'<nav><ul id="page_nav_menu"></ul></nav>'
		);

		pageFooter.html('<p>Copyright &copy; 2014 Kent Cheng</p>');

		// Set the mobile nav menu button and its behavior

		var mobileNavBtn = $('#mobile_nav_btn');

		mobileNavBtn.click(function() {
			
			var page = $('#page'),
				pageOffset = mobileNav.height(),
				mobileNavMenu = $('#mobile_nav_menu');
				translateY = '';

			// Check the visual state of the mobile nav menu
			// and toggle the visual styles accordingly
			if (mobileNavMenu.css('opacity') === '0') {
				
				translateY = 'translateY(' + pageOffset + 'px)'; 

				// Fade in and slide down the page to reveal the menu
				mobileNavMenu.css({ 'opacity' : '1' });
				
				page.css({
					'-webkit-transform' : translateY,
					'transform' : translateY
				});
			}
			else {

				// Fade out and slide up the page to hide the menu
				mobileNavMenu.css({ 'opacity' : '0' });
				
				page.css({
					'-webkit-transform' : translateY,
					'transform' : translateY
				});
			}
		});

		// Check if a new root path was provided and ensure it's valid
		if (typeof newRootPath !== 'undefined') {
			if (typeof newRootPath === 'string' && newRootPath.length > 0) {
				this.rootPath = newRootPath;
			} else console.warn('newRootPath should be a string.');	
		}

		// Now initialize the nav elements
		if (typeof activeMenuItem === 'string' && activeMenuItem.length > 0) {
			this.nav.init(activeMenuItem);
		} else console.warn('activeMenuItem should be a string.')
	}
}

function isStringValid(input) {
	
	if (typeof input === 'string' && input.length > 0) {
		return true;
	} 
	else console.warn(input + ' is not a string.');

	return false;
} 