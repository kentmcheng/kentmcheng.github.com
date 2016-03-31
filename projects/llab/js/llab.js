var preventMove;
var resizeTimer;
var scroll;

var playerData = {
	self : {
		name: "Kenter",
		photo: "male_5",
		wins : 5,
		losses : 11,
		onboarded : true
	},
	games : {
		count : 5,
		yours : [
			{
				opponent: {
					name: "StinkyFooties",
					photo : "female_1"
				},
				word : "smelly",
				score : [12, 31] 
			},
			{
				opponent: {
					name: "ohsoKnightley",
					photo : "female_2"
				},
				word : "honor",
				score : [45, 27]
			}
		],
		theirs : [
			{
				opponent: {
					name : "peppermintPat",
					photo : "male_1"
				},
				word : "chocolate",
				score : [19, 14]
			},
			{
				opponent: {
					name : "GotBent",
					photo : "male_2"
				},
				word : "silver",
				score : [23, 56]
			},
			{
				opponent: {
					name : "CutiePotPie",
					photo : "female_3"
				},
				word : "chicken",
				score : [38, 29]
			}
		],
		completed : [
			{
				opponent: "scratchNwin",
				photo: "male_3",
				result: 0,
			},
			{
				opponent: "snuffles",
				photo: "female_4",
				result: 1,
			},
			{
				opponent: "princessWin",
				photo: "female_5",
				result: 1,
			}
		]
	},
	friends : [
		{
			name: "CutiePotPie",
			photo : "female_3"
		},
		{
			name: "GotBent",
			photo : "male_2",
		},
		{
			name: "ohsoKnightley",
			photo : "female_2"
		},
		{
			name: "peppermintPat",
			photo : "male_1"
		},
		{
			name: "princessWin",
			photo: "female_5"
		},
		{
			name: "scratchNwin",
			photo: "male_3"
		},
		{
			name: "snuffles",
			photo: "female_4"
		},
		{
			name: "StinkyFooties",
			photo : "female_1",
		},
		{
			name: "The Grumpster",
			photo: "male_4"
		}	
	]
}

var gameData = {
	player1 : "",
	player2 : "",
	turn : "",
	score : []
}

var View = new function() {
	
	var SMALL = "small";
	var MEDIUM = "medium";
	
	var self = this;
	var currentView = "LOAD";
	
	// Sets the current view
	this.setView = function(newView) {
		
		if ( currentView != newView ) {
			
			console.log("Setting view to: " + newView);
			
			switch(newView) {
				
				case "SPLASH" :
					
					view(newView, MEDIUM);
					break;
					
				case "GAMELIST" : 
					
					view(newView, SMALL);
					break;
					
				case "NEWGAME" : 
					
					view(newView, SMALL);
					break;
					
				case "GAMEPLAY" : 
					
					view(newView, SMALL);
					break;
					
				default :
					console.log("Unsupported setView value of: " + newView);
			}				
		}
		
		function view(caseView, topPanelSize) {
			
			// Hide the other panels
			$("#panel_earl").hide();
			$("#panel_modal").hide();
			
			// Transition to the new view
			$("#panel_top_contents").addClass("fadeOut").bind("webkitAnimationEnd", function() {
				
				$("#panel_top_contents").unbind().html("");
				$("#panel_bot_contents").html("");
				
				if ( $("#panel_top").hasClass(topPanelSize) != true ) {
				
					$("#panel_top").removeClass().addClass(topPanelSize).bind("webkitTransitionEnd", function() {
						$(this).unbind();
						self.buildViewContents(caseView);
					});
				}
				else {
					self.buildViewContents(caseView);
				}
				
				currentView = caseView;
			});
			
			$("#panel_bot_contents").addClass("fadeOut");	
		}
	}
	
	// Builds the contents for a view
	this.buildViewContents = function(view) {
		
		console.log("Building the contents for view: " + view);
		
		var contentClass = view.toLowerCase();
		
		switch(view) {
		
			case "SPLASH" :
				
				// Build the top panel contents
				$("#panel_top_contents").removeClass().addClass(contentClass + " fadeIn").html(
					"<div class='logo'></div>"
				).bind("webkitAnimationEnd", function() {
					$(this).unbind().removeClass("fadeIn");
				});
				
				// Build the bottom panel contents
				$("#panel_bot_contents").removeClass().addClass(contentClass + " fadeIn").html(
					"<ul>" +
						"<li><button class=\"core\" onclick=\"window.location.hash = 'GAMELIST'\">Play</button></li>" +
						"<li><button class=\"core\" onclick=\"playerData.games.count = 5, alert('games = 5')\">Forums</button></li>" +
						"<li><button class=\"core\" onclick=\"playerData.games.count = 0, alert('games = 0')\">Exit</button></li>" +
					"</ul>"
				).bind("webkitAnimationEnd", function() {
					$(this).unbind().removeClass("fadeIn");
				});
								
				break;
				
			case "GAMELIST" :
				
				// Build the top panel contents
				$("#panel_top_contents").removeClass().addClass(contentClass + " fadeIn").html(
					"<nav class='fe'>" +
						"<div class='components'>" +
							"<div class='left'><button class=\"core\" onclick=\"window.location.hash = 'SPLASH'\">Menu</button></div>" +
							"<div class='right'><button class=\"white\" onclick=\"window.location.hash = 'NEWGAME'\">New Game</button></div>" +
						"</div>" +
					"</nav>"
				).bind("webkitAnimationEnd", function() {
					$(this).unbind().removeClass("fadeIn");
				});
				
				// Build the bottom panel contents
				$("#panel_bot_contents").removeClass().addClass(contentClass + " fadeIn").html(
					"<div>" + 
						"<h1>Your Games</h1>" +
					"</div>"
				);
				
				// Build the game list 
				if ( playerData.games.count > 0 ) {
					
					console.log("Building the player's game list");
					
					// Add the games that are their move
					if ( playerData.games.yours.length > 0 ) {
						
						$("#panel_bot_contents > div").append(
							"<ul class='yours'>" +
								"<header><h1>Your Move</h1><div class='wave'></div><div class='icon'></div></header>" +
							"</ul>"
						);
						
						for ( var i = 0; i < playerData.games.yours.length; i++ ) {
							
							console.log("DEBUG LOOP");
							
							$("#panel_bot_contents ul.yours").append(
								"<li id=\"your_move_" + i + "\">" +
									"<div class='components'>" +
										"<div class='photo'><img class='photos " + playerData.games.yours[i].opponent.photo + " small' src='img/img_sprite.gif'></div>" +
										"<div class='details'>" +
											"<h1>" + playerData.games.yours[i].opponent.name + "</h1>" +
											"<p class='word'></p>" +
										"</div>" +
										"<div class='fadeout'></div>" +
									"</div>" +
								"</li>"
							);
							
							for ( var j = 0; j < playerData.games.yours[i].word.length; j++ ) {
								
								$("#your_move_" + i + " .word").append(
									"<span>" + playerData.games.yours[i].word.charAt(j) + "</span>"
								);
							}
							
							// Build and bind the action for each button 
							var setAction = function(n) {
								
								return function() {
									
									gameData.player1 = playerData.self;
									gameData.player2 = playerData.games.yours[n].opponent;
									gameData.turn = 1;
									gameData.score = playerData.games.yours[n].score;
									
									View.setModal("LOAD");
									
									console.log(gameData);
								}
							}
							
							$("#your_move_" + i).bind("click", setAction(i));
							
						}
						
						$("#panel_bot_contents ul.yours").append(
							"<footer></footer>"
						);
					}
					
					// Add the games that are opponent's move
					if ( playerData.games.theirs.length > 0 ) {
						
						$("#panel_bot_contents > div").append(
							"<ul class='theirs'>" +
								"<header><h1>Their Move</h1><div class='wave'></div></header>" +
							"</ul>"
						);
						
						for ( var i = 0; i < playerData.games.theirs.length; i++ ) {
							
							$("#panel_bot_contents ul.theirs").append(
								"<li id=\"their_move_" + i + "\">" +
									"<div class='components'>" +
										"<div class='photo'><img class='photos " + playerData.games.theirs[i].opponent.photo + " small' src='img/img_sprite.gif'></div>" +
										"<div class='details'>" +
											"<h1>" + playerData.games.theirs[i].opponent.name + "</h1>" +
											"<p class='word'></p>" +
										"</div>" +
										"<div class='fadeout'></div>" +
									"</div>" +
								"</li>"
							);
							
							for ( var j = 0; j < playerData.games.theirs[i].word.length; j++ ) {
								
								$("#their_move_" + i + " .word").append(
									"<span>" + playerData.games.theirs[i].word.charAt(j) + "</span>"
								);
							}
							
							// Build and bind the action for each button 
							var setAction = function(n) {
								
								return function() {
									
									gameData.player1 = playerData.self;
									gameData.player2 = playerData.games.theirs[n].opponent;
									gameData.turn = 2;
									gameData.score = playerData.games.theirs[n].score;
									
									View.setModal("LOAD");
									
									console.log(gameData);
								}
							}
							
							$("#their_move_" + i).bind("click", setAction(i));
						}
						
						$("#panel_bot_contents ul.theirs").append(
							"<footer></footer>"
						);
					}
					
					// Add the games that have recently completed
					if ( playerData.games.completed.length > 0 ) {
						
						$("#panel_bot_contents > div").append(
							"<ul class='completed'>" +
								"<header><h1>Completed</h1><div class='wave'></div></header>" +
							"</ul>"
						);
						
						for ( var i = 0; i < playerData.games.completed.length; i++ ) {
							
							$("#panel_bot_contents ul.completed").append(
								"<li id=completed_" + i + ">" +
									"<div class='components'>" +
										"<div class='photo'><img class='photos " + playerData.games.completed[i].photo + " small' src='img/img_sprite.gif'></div>" +
										"<div class='details'>" +
											"<h1>" + playerData.games.completed[i].opponent + "</h1>" +
											"<p class='result'></p>" +
										"</div>" +
										"<div class='fadeout'></div>" +
									"</div>" +
								"</li>"
							);
							
							if ( playerData.games.completed[i].result == 0 ) {
								
								$("#completed_" + i + " .result").addClass("win").append(
									"<span>W</span><span>O</span><span>N</span>"
								);
							}
							else if ( playerData.games.completed[i].result == 1 ) {
								
								$("#completed_" + i + " .result").addClass("win").append(
									"<span>L</span><span>O</span><span>S</span><span>S</span>"
								);
							}
							else {
								console.log("Unsupported game result: " + playerData.games.completed[i].result);
								
								$("#completed_" + i + " .result").addClass("draw").append(
									"<span>D</span><span>E</span><span>B</span><span>U</span><span>G</span>"
								);
							}
						}
						
						$("#panel_bot_contents ul.completed").append(
							"<footer></footer>"
						);
					}
					
					scroll = new iScroll("panel_bot_contents", { bounce: false, hScroll: false, hScrollbar: false, vScrollbar: true, fadeScrollbar: false});
					scroll.refresh();
					
				}
				// Else games list is empty, show the start new game tip
				else {
				
					setTimeout(function() {
						self.setModal("TIP");
					}, 500);
				}
								
				break;
				
			case "NEWGAME" :
				
				// Build the top panel contents
				$("#panel_top_contents").removeClass().addClass(contentClass + " fadeIn").html(
					"<nav class='fe'>" +
						"<div class='components'>" +
							"<div class='left'><button class=\"core\" onclick=\"window.location.hash = 'SPLASH'\">Menu</button></div>" +
							"<div class='right'><button class=\"white\" onclick=\"window.location.hash = 'GAMELIST'\">Your Games</button></div>" +
						"</div>" +
					"</nav>"
				).bind("webkitAnimationEnd", function() {
					$(this).unbind().removeClass("fadeIn");
				});
				
				// Build the bottom panel contents
				$("#panel_bot_contents").removeClass().addClass(contentClass + " fadeIn").html(
					"<div>" +
						"<h1>New Game</h1>" +
						"<h2>Pick your opponent</h2>" +
						"<button class=\"core\" onclick=\"View.setModal('LOAD')\"><p>Random</p><p>Game</p></button>" +
						"<hr>" +
						"<button class=\"core\" onclick=\"View.setModal('FRIENDS')\"><p>Friend</p><p>Game</p></button>" +
					"</div>"
				);
								
				break;
				
			case "GAMEPLAY" :
				
				var photo1 = gameData.player1.photo
				
				// Build the top panel contents
				$("#panel_top_contents").removeClass().addClass(contentClass + " fadeIn").html(
					"<nav class='gp'>" +
						"<div class='components'>" +
							"<div class='left'>" +
								"<div class='player one'>" +
									"<div class='components'>" +
										"<div class='photo'><img class='photos " + gameData.player1.photo + " xsmall' src='img\\img_sprite.gif'></div>" +
										"<div class='score'><p>0" + gameData.score[0] + "</p></div>" +
									"</div>" +
								"</div>" +
								"<div class='player two'>" +
									"<div class='components'>" +
										"<div class='photo'><img class='photos " + gameData.player2.photo + " xsmall' src='img\\img_sprite.gif'></div>" +
										"<div class='score'><p>0" + gameData.score[1] + "</p></div>" +
									"</div>" +
								"</div>" +
							"</div>" +
							"<div class='right'><button class=\"core\" onclick=\"View.setModal('MENU')\">Menu</button></div>" +
						"</div>" +
					"</nav>"
				).bind("webkitAnimationEnd", function() {
					$(this).unbind().removeClass("fadeIn");
				});
				
				if ( gameData.turn == 1 ) {
					$("#panel_top_contents .player.one").addClass("active");
				}
				if ( gameData.turn == 2 ) {
					$("#panel_top_contents .player.two").addClass("active");
				}
				
				// Build the bottom panel contents
				$("#panel_bot_contents").removeClass().addClass(contentClass + " fadeIn").html(
					"<div class='components'>" +
						"<div class='board existing'></div>" +
						"<div class='rack'>" +
							"<div class='components'>" +
								"<div class='tiles'>" +
									"<ul><li>A</li><li>R</li><li>Q</li><li>G</li><li>P</li><li>O</li><li>L</li></ul>" +
								"</div>" +
								"<div class='actions'>" +
									"<ul>" +
										"<li><button class='white'>Submit</button></li>" +
										"<li><button class='core'>Shuffle</button></li>" +
										"<li><button class='core'>Swap</button></li>" +
									"</ul>" +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>"
				);
				
				/*
				$("#panel_bot_contents .board").bind("click", function() {
					if ( $(this).hasClass("play") == true ) {
						$(this).removeClass("play").addClass("played");
					}
					else {
						$(this).removeClass("played").addClass("play");
					}
				});
				*/
				break;
				
			default:
				console.log("Unsupported buildContentsView value of: " + view);
		}
		
		enableButtonFeedback();
	}
	
	// Sets the modal
	this.setModal = function(modal) {
		
		var modalClass = modal.toLowerCase();
		console.log(modalClass);
		
		switch(modal) {	
			
			case "LOAD" : 
				$("#panel_modal").removeClass().addClass(modalClass).html(
					"<div class='components'>" +
						"<div>" +
							"<header><h1>Loading</h1></header>" +
							"<div class='message'>" +
								"<img src='img/game_load.gif'>" +
								"<div class='wave'></div>" +
							"</div>" +
							"<footer><div class='wave top'></div><div class='wave bottom'></div></footer>" +
						"</div>" +
					"</div>"
				).show().bind("webkitAnimationEnd", function() {
					console.log("DEBUG");
					$(this).unbind();
					setTimeout(function() {
						console.log("LOAD DONE");
						location.hash = "GAMEPLAY";
					}, 1500);
				});
								
				break;
				
			case "FRIENDS" : 
				$("#panel_modal").removeClass().addClass(modalClass).html(
					"<div class='components'>" +
						"<div>" +
							"<header><h1>Friends List</h1></header>" +
							"<div class='message' id='test'><div class='contents'></div><div class='wave'></div></div>" +
							"<footer><button class='white' onclick=\"$('#panel_modal').hide()\">Close</button><div class='wave top'></div><div class='wave bottom'></div></footer>" +
						"</div>" +
					"</div>"
				).show();
				
				if ( playerData.friends.length > 0 ) {
					console.log("Building friends list");
					$("#test .contents").append(
						"<ul>" +
							"<div><input type='text' placeholder='filter by name' autocorrect='off'></div>" +
						"</ul>"
					);
					
					for (var i = 0; i < playerData.friends.length; i++) {
						$("#test .contents ul").append(
							"<li>" +
								"<div class='components'>" +
									"<div class='photo'><img class='photos " + playerData.friends[i].photo + " xsmall' src='img/img_sprite.gif'></div>" +
									"<div class='details'>" +
										"<h1>" + playerData.friends[i].name + "</h1>" +
									"</div>" +
								"</div>" +
							"</li>"
						);
					}
					
					$("#test ul li").bind("click", function() {
						location.hash = "GAMEPLAY";
					});
					
					$("#test input").bind("click touchend", function(event) {
						//console.log("DEBUG PT1");
						event.stopPropagation();
						$(this).focus();
						$("#test ul li").unbind("click");
						$("#panel_modal").bind("click touchend", function(e) {
							//console.log("DEBUG PT2");
							e.stopPropagation();
							$(this).unbind();
							$("#test input").blur();
							
							setTimeout(function() {
								$("#test ul li").bind("click", function() {
									location.hash = "GAMEPLAY";
								});
							}, 250);
							
						});
					});
				}
				
				scroll = new iScroll("test", {bounce: false, hScroll: false, hScrollbar: false, vScrollbar: true, fadeScrollbar: false});
				scroll.refresh();
								
				break;
			
			case "TIP" : 
				$("#panel_modal").removeClass().addClass("tip").html(
					"<div class='components'>" +
						"<div>" +
							"<header><h1>Tip</h1><div class='icon'></div></header>" +
							"<div class='message'>" +
								"<p>Your games list is empty. Let's fix that by starting a new game!</p>" +
								"<div class='wave'></div></div>" +
							"<footer><button class='core' onclick=\"$('#panel_modal').hide(), $('#panel_earl').show()\">Okay</button><div class='wave top'></div><div class='wave bottom'></div><div class='earl'></div></footer>" +
						"</div>" +
					"</div>"
				).show();
								
				break;
			
			case "MENU" :
				
				$("#panel_modal").removeClass().addClass("menu").html(
					"<div class='components'>" +
						"<div>" +
							"<header><h1>Options</h1></header>" +
							"<div class='message'>" +
								"<ul>" +
									"<li><button class='core' onclick=\"View.setModal('PASS')\">Pass</button></li>" +
									"<li><button class='core'>Give Up</button></li>" +
									"<hr>" +
									"<li><button class='core'>Next Game</button></li>" +
									"<li><button class='core' onclick=\"$('#panel_modal').hide(), location.hash = 'GAMELIST'\">Exit Game</button></li>" +
								"</ul>" +
								"<div class='wave'></div>" +
							"</div>" +
							"<footer><button class='white' onclick=\"$('#panel_modal').hide()\">CLOSE</button><div class='wave top'></div><div class='wave bottom'></div></footer>" +
						"</div>" +
					"</div>"
				).show();
								
				break;
			
			case "PASS" :
				
				$("#panel_modal").removeClass().addClass("pass").html(
					"<div class='components'>" +
						"<div>" +
							"<header><h1>Pass</h1><div class='icon'></div></header>" +
							"<div class='message'>" +
								"<p>Are you sure you want to skip your turn?</p>" +
								"<div class='wave'></div>" +
							"</div>" +
							"<footer>" +
								"<ul>" +
									"<li><button class='core'>Yes</button></li>" +
									"<li><button class='white' onclick=\"$('#panel_modal').hide()\">No</button></li>" +
								"</ul>" +
								"<div class='wave top'></div>" +
								"<div class='wave bottom'></div>" +
							"</footer>" +
						"</div>" +
					"</div>"
				).show();
			
				break
				
			default: 
				console.log("Unsupported setModal value: " + modal);
		}
		
		enableButtonFeedback();
		
	}
	
	function enableButtonFeedback() {
			
		$("button").bind("mouseenter touchstart", function() {
			$(this).addClass("hover");
		});
		
		$("button").bind("click mouseleave touchend", function() {
			$(this).removeClass("hover");
		});
	}
}

function hideURLbar() { 
	window.scrollTo(0, 1); 
}

function initPage() {

	location.hash = "";
	
	initScreen(false);	
}

// Initializes the screens
function initScreen(isInitialized) {	

	if (isInitialized == false) { // if not initialized, resize and capture the actual viewport dimensions
		
		$("body").css({"height" : 9999});
		
		addEventListener("load", function() { 
			setTimeout(hideURLbar, 250);
			setTimeout(initScreen, 500); 
		}, false);
	}
	else { // otherwise just capture the viewport dimensions
	
		$("body").css({
			"height" : window.innerHeight
		});
		
		$(window).bind("hashchange", function() {
			console.log("Hash changed!");
			
			var hash = location.hash;
			var view = hash.slice(1)
			
			View.setView(view);		
		});
		
		$(window).resize(function() {
		    clearTimeout(resizeTimer);
		    resizeTimer = setTimeout(resizeScreen, 100);
		});
		
		setTimeout(function() {
			preload();
		}, 250);
			
	}	
}

// Resets the screen
function resetScreen() {

	$(window).unbind("resize");
			
	$("body").css({"height" : 9999});
	
	setTimeout(function() {
		
		hideURLbar();
				
		$("body").css({
			"height" : window.innerHeight
		});
		
		scroll.refresh();
		
	}, 500);	
}

function resizeScreen() {
	$("body").css({
		"height" : window.innerHeight
	});
	
	//alert("Resize screen triggered");
}

var imageAssets = new Array(
	"img/earl_body.png",
	"img/earl_hand.png",
	"img/game_board.jpg",
	"img/game_board_existing.jpg",
	"img/game_board_play.jpg",
	"img/game_board_played.jpg",
	"img/game_board.jpg",
	"img/game_load.gif",
	"img/game_load_static.png",
	"img/game_logo.png",
	"img/icon_caution.png",
	"img/img_sprite.gif",
	"img/item_divider.png",
	"img/photos.jpg",
	"img/test_fade.png",
	"img/texture_btn_mustard.gif",
	"img/texture_btn_white.gif",
	"img/texture_footer_tangerine.gif",
	"img/texture_header_cyan.gif",
	"img/texture_header_mustard.gif",
	"img/texture_header_tangerine.gif",
	"img/texture_panel_cyan.gif",
	"img/texture_panel_tan.gif",
	"img/texture_score_mustard.png",
	"img/texture_score_white.png",
	"img/touch.png",
	"img/wave_cyan.gif",
	"img/wave_cyan_end.png",
	"img/wave_mustard.gif",
	"img/wave_tangerine.gif",
	"img/wave_white.gif",
	"img/wave_white_end.png"
)

var imagesLoaded = 0;

function preload() {
	
	var imageObj = new Image();
	
	imageObj.src = imageAssets[imagesLoaded];
	
	//console.log(imagesLoaded);
	//console.log("Preloading: " + imageAssets[imagesLoaded]);
	
	imageObj.onload = new function() {
		imagesLoaded++;
		if (imagesLoaded < imageAssets.length) {
			//console.log("Preload next");
			
			var x = Math.round(imagesLoaded/imageAssets.length*100);				
			
			$("#panel_top_contents .element h2").html(x);
			
			preload();
		}
		else {
			//console.log("PRELOAD DONE!!!");
			
			$("#panel_top_contents .element h2").html("99");
			
			setTimeout(function() {
				window.location.hash = "SPLASH";
			}, 750);
		}
	}
}


/* TO DO LIST */
/*
	- New player onboarding
	
	- Add Gameplay logic
		- Who's turn
		- Which board
		- Which rack actions
		- Which menu options
	
	- Profile modal
	- Recap modal
	- Scoring modal
	- Results modal
	- Swap tiles modal
	- Forfeit modal
	
*/
