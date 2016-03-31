/************************/
/*** GLOBAL VARIABLES ***/
/************************/

var screenWidth, screenHeight;

var moonState = 0;
var moonStateImages = new Array(
	"hf_moon_state_0.png",
	"hf_moon_state_1.png",
	"hf_moon_state_2.png",
	"hf_moon_state_3.png",
	"hf_moon_state_4.png",
	"hf_moon_state_5.png",
	"hf_moon_state_6.png",
	"hf_moon_state_7.png",
	"hf_moon_state_8.png"
);

var searchCycles = 0;
var searchState = 0;
var searchStateImages = new Array(
	"load_random-16.png",
	"load_random-1.png",
	"load_random-2.png",
	"load_random-3.png",
	"load_random-4.png",
	"load_random-5.png",
	"load_random-6.png",
	"load_random-7.png",
	"load_random-8.png",
	"load_random-9.png",
	"load_random-10.png",
	"load_random-11.png",
	"load_random-12.png",
	"load_random-13.png",
	"load_random-14.png",
	"load_random-15.png",
	"load_random-16.png"
);

/**********************/
/*** PAGE FUNCTIONS ***/
/**********************/

// Prevents the default behavior
function preventMove(event) {
	event.preventDefault();
}

// Hides the URL bar for a mobile device
function hideURLbar() {	
	window.scrollTo(0, 1);
}

// Initializes the page
function initPage() {
	initScreen(false);	
}

// Initializes the screen
function initScreen(isInitialized) {
	
	// Perform the initialization
	if (isInitialized == false) { // if not initialized, resize and capture the actual viewport dimensions
		$("body").css({"height" : 9999});
		addEventListener("load", function() { 
			setTimeout(hideURLbar, 500);
			setTimeout(initScreen, 1000); 
		}, false);
	} 
	else { // else just capture the viewport dimensions
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
		
		$("body").css({
			"width" : screenWidth,
			"height" : screenHeight
		});
		
		initGame();
	}
}

/**********************/
/*** GAME FUNCTIONS ***/
/**********************/

// Initializes the game
function initGame() {
	initFE();
	initGP();
	setTimeout(startLoader, 250);
}

// Simulates the initial game load
function startLoader() {
	$("#fe").show();
	$("#fe_intro_moon").html("<img src='img/hf_moon_state_0.png'><p></p>");
	animateLoader();
}

// Animates the game loader
function animateLoader() {
	if (moonState < moonStateImages.length) {
		$("#fe_intro_moon img").attr("src", "img/" + moonStateImages[moonState]);
		$("#fe_intro_moon p").html(Math.round(moonState/moonStateImages.length * 100));
		moonState++;
		setTimeout(animateLoader, 350); // the interval between frames
	}
	else {
		$("#fe_intro_moon img").attr("src", "img/" + moonStateImages[moonState-1]);
		$("#fe_intro_moon p").html(Math.round(moonState/moonStateImages.length * 100));
		setTimeout(startIntro, 250); // play the intro when the load animation completes
	}
}


/***************************/
/*** FRONT END FUNCTIONS ***/
/***************************/

// Initializes the front end
function initFE() {
	$("#fe").hide();
	$("#fe_intro_stars").html(
		"<ul class='fade_in'>" +
			"<li class='pulse'></li>" +
			"<li class='pulse'></li>" +
			"<li class='pulse'></li>" +
			"<li class='pulse'></li>" +
		"</ul>"
	).hide();
	$("#fe_controls").hide();
}

// Starts the front end intro
function startIntro() {
	$("#fe_intro").addClass("pan");
	$("#fe_intro_trees").addClass("pan");
	$("#fe_intro_logo").addClass("pan");
	$("#fe_intro").bind("webkitTransitionEnd", function() {
		$("#fe_intro").unbind("webkitTransitionEnd");
		loadMainControls();
		$("#fe_intro_stars").show();
	});
}

// Displays the main menu controls
function loadMainControls() {
	if ($("#fe_controls").hasClass("fade_in") != true){
		$("#fe_controls li:nth-child(1) button h1").html("Single Player");
		$("#fe_controls li:nth-child(1) button").bind("click", function() {			
			loadSoloGP();			
		});
		$("#fe_controls li:nth-child(2) button h1").html("Multi Player");
		$("#fe_controls li:nth-child(2) button").bind("click", function() {
			loadChallengeControls();				
		});
		$("#fe_controls li:nth-child(3) button h1").html("Leave Game");
		$("#fe_controls li:nth-child(3) button").bind("click", function() {
			console.log("Missing leave game flow");				
		});	
		$("#fe_controls").addClass("fade_in").show();
	}
	else {
		$("#fe_controls li button").unbind("click");
		$("#fe_controls").addClass("fade_out");
		$("#fe_controls").bind("webkitAnimationEnd", function() {
			$("#fe_controls").unbind("webkitAnimationEnd");
			$("#fe_controls li:nth-child(1) button h1").html("Single Player");
			$("#fe_controls li:nth-child(1) button").bind("click", function() {			
				loadSoloGP();			
			});
			$("#fe_controls li:nth-child(2) button h1").html("Multi Player");
			$("#fe_controls li:nth-child(2) button").bind("click", function() {
				loadChallengeControls();				
			});
			$("#fe_controls li:nth-child(3) button h1").html("Leave Game");
			$("#fe_controls li:nth-child(3) button").bind("click", function() {
				alert("Leaves Game");
				//console.log("Missing leave game flow");				
			});	
			$("#fe_controls").removeClass("fade_out");
		});
	}
}

// Loads the multi play controls
function loadChallengeControls() {
	$("#fe_controls li button").unbind("click");
	$("#fe_controls").addClass("fade_out");
	$("#fe_controls").bind("webkitAnimationEnd", function() {
		$("#fe_controls").unbind("webkitAnimationEnd");
		$("#fe_controls li:nth-child(1) button h1").html("Random Play");
		$("#fe_controls li:nth-child(1) button").bind("click", function() {
			loadGameLobby("RANDOM");				
		});
		$("#fe_controls li:nth-child(2) button h1").html("Friend Play");
		$("#fe_controls li:nth-child(2) button").bind("click", function() {
			loadGameLobby("FRIENDS");
		});
		$("#fe_controls li:nth-child(3) button h1").html("Cancel");
		$("#fe_controls li:nth-child(3) button").bind("click", function() {
			loadMainControls();				
		});
		$("#fe_controls").removeClass("fade_out");
	});
}


/**************************/
/*** GAMEPLAY FUNCTIONS ***/
/**************************/

// Initializes the gameplay
function initGP() {
	$("#gp").hide();
	$("#gp_lobby").hide();
	$("#gp_invites").hide();
	$("#gp_solo").hide();
	$("#gp_multi").hide();
	$("#gp_results").hide();
	$("#gp_profile").hide();
	$("#gp_options").hide();
	$("#gp_highscores").hide();
	$("#gp_help").hide();
}

// Loads the solo gameplay
function loadSoloGP() {
	$("#gp").show();
	$("#gp_solo").show();
	$("#gp_solo").html("<div class='components'><nav class='options'><button></button></nav></div>");
	$("#gp_solo .options button").bind("click", function() { 
		loadOptions("SINGLE"); 
	});
	$("#game").addClass("flip");
	$("#game").bind("webkitTransitionEnd", function() {
		$("#game").unbind("webkitTransitionEnd");
		$("#fe").hide();
	});
}

// Loads the multi gameplay
function loadMultiGP() {
	$("#gp").show();
	$("#gp_multi").show();
	$("#gp_multi").html("<div class='components'><nav class='options'><button></button></nav></div>");
	$("#gp_multi .options button").bind("click", function() {
		loadOptions("MULTI");
	});
	setTimeout(function() {
		loadMultiGPResults();
	}, 5000);
}

// Loads the game results 
function loadMultiGPResults() {
	moonState = 0;
	$("#gp_results").html(
		"<div class='components'>" +
			"<section id='gp_results_backing' class='fade_in'><img src='img/hf_moon_state_0.png'></section>" +
			"<section id='gp_results_alert'><img class='shake' src='img/gp_results_timeup.png'></section>" +
			"<section id='gp_results_standings'>" +
				"<ul>" +
					"<li class='place_1'>" +
						"<section class='player'>" +
							"<div class='components'>" +
								"<section class='avatar'><img src='img/player_avatar_1_large.png'></section>" +
								"<section class='details'><h1>Nickname0000001</h1><h2>2,459,102</h2></section>" +
							"</div>" +
						"</section>" +
						"<section class='rank'><img src='img/gp_multi_result_1.png'></section>" +
						"<section class='stars fade_in'>" +
							"<ul>" +
								"<li class='pulse'></li>" +
								"<li class='pulse'></li>" +
								"<li class='pulse'></li>" +
								"<li class='pulse'></li>" +
								"<li class='pulse'></li>" +
								"<li class='pulse'></li>" +
							"</ul>" +
						"</section>" +
					"</li>" +
					"<li class='place_2'>" +
						"<section class='player'>" +
							"<div class='components'>" +
								"<section class='avatar'><img src='img/player_avatar_2_small.png'></section>" +
								"<section class='details'><h1>Nickname0000002</h1><h2>2,006,800</h2></section>" +
							"</div>" +
						"</section>" +
						"<section class='rank'><img src='img/gp_multi_result_2.png'></section>" +
					"</li>" +
					"<li class='place_3'>" +
						"<section class='player'>" +
							"<div class='components'>" +
								"<section class='avatar'><img src='img/player_avatar_3_small.png'></section>" +
								"<section class='details'><h1>Nickname0000003</h1><h2>1,779,672</h2></section>" +
							"</div>" +
						"</section>" +
						"<section class='rank'><img src='img/gp_multi_result_3.png'></section>" +
					"</li>" +
					"<li class='place_4'>" +
						"<section class='player'>" +
							"<div class='components'>" +
								"<section class='avatar'><img src='img/player_avatar_4_small.png'></section>" +
								"<section class='details'><h1>Nickname0000004</h1><h2>1,301,995</h2></section>" +
							"</div>" +
						"</section>" +
						"<section class='rank'><img src='img/gp_multi_result_4.png'></section>" +
					"</li>" +
				"</ul>" +
			"</section>" +
		"</div>"
	);
	$("#gp_results_standings").hide();
	$("#gp_results_standings .stars").hide();
	$("#gp_results_backing").hide();
	$("#gp_results").show();
	$("#gp_results_alert").bind("webkitAnimationEnd", function() {
		$("#gp_results_alert").unbind("webkitAnimationEnd");
		$("#gp_results_backing").show();
		$("#gp_results_alert").addClass("slide");
		$("#gp_results_alert").bind("webkitTransitionEnd", function() {
			$("#gp_results_alert").unbind("webkitTransitionEnd");
			resultsTimer();
			$("#gp_results_standings").show();
			$("#gp_results_standings li:nth-child(1)").bind("webkitAnimationEnd", function() {
				$("#gp_results_standings li:nth-child(1)").unbind("webkitAnimationEnd");
				$("#gp_results_standings li:nth-child(1) .player .avatar").addClass("blink");
				$("#gp_results_standings li:nth-child(1) .rank").addClass("pulse");
				$("#gp_results_standings li:nth-child(1) .stars").show();
			});
		});
	});
}

// The Results Timer
function resultsTimer() {
	if (moonState < moonStateImages.length) {
		var imgName = moonStateImages[moonState];
		$("#gp_results_backing img").attr("src", "img/" + imgName);
		moonState++;
		setTimeout(resultsTimer, 1000);
	}
	else {
		var imgName = moonStateImages[moonStateImages.length-1];
		$("#gp_results_backing img").attr("src", "img/" + imgName);
		setTimeout(function() {
			$("#gp_results").hide();
			$("#gp_multi").hide();
		}, 1000);
	}
}

// Loads the game lobby
function loadGameLobby(type) {
	
	$("#gp").show();	
	$("#gp_lobby").show();
	$("#gp_lobby").html(
		"<div class='components'><nav class='options'><button></button></nav></div>" +
		"<section id='gp_lobby_chat'><div class='components'><header><h1>Chat</h1></header><div class='messages'></div><footer><input type='text'><button>Send</button></footer></div></section>" +
		"<section id='gp_lobby_players'><div class='components'></div></section>"								
	);
	
	// Build the lobby contents
	if (type == "FRIENDS") {
		$("#gp_lobby_players .components").append(
			"<ul class='spots'>" +
				"<li><button class='add'><img src='img/sprite.png'></button></li>" +
				"<li><button class='add'><img src='img/sprite.png'></button></li>" +
				"<li><button class='add'><img src='img/sprite.png'></button></li>" +
			"</ul>" +
			"<ul class='arrows bounce'>" +
				"<li><img src='img/hf_game_lobby_arrow.png'></li>" +
				"<li><img src='img/hf_game_lobby_arrow_text.png'></li>" +
				"<li><img src='img/hf_game_lobby_arrow.png'></li>" +
			"</ul>"
		);
		$("#gp_lobby_players button.add").bind("click", function() {
			loadGameInvites();
		});
	}
	else {
		$("#gp_lobby_players .components").append(
			"<section class='ready'><button><p>Ready!</p></button></section>" +
			"<ul class='spots'>" +
				"<li><button class='search'><img src='img/load_random-16.png'></button></li>" +
				"<li><button class='search'><img src='img/load_random-16.png'></button></li>" +
				"<li><button class='search'><img src='img/load_random-16.png'></button></li>" +
			"</ul>"
		);
		$("#gp_lobby_players .ready button").bind("click", loadMultiGP);
		$("#gp_lobby_players button.player").bind("click", function() {
			loadRecords();
		});
		
		
		setTimeout(function() {
			searchCycles = 0;
			searchState = 0;
			animateSearch();
		}, 1000);
	}
	
	// Bind the button behaviors
	$("#gp_lobby .options button").bind("click", function() {
		loadOptions("MULTI");
	});
	
	// Show the game panels and hide the fe panels
	$("#game").addClass("flip");
	$("#game").bind("webkitTransitionEnd", function() {
		$("#game").unbind("webkitTransitionEnd");
		loadMainControls();
		$("#fe_controls").bind("webkitAnimationEnd", function() {
			$("#fe_controls").unbind("webkitAnimationEnd");
			$("#fe").hide();
		});
	});
}

// Start random search for player 1
function animateSearch() {
	
	if  (searchCycles < 3) {
		if (searchState < searchStateImages.length) {
			$("#gp_lobby_players ul li:nth-child(1) button.search img").attr("src", "img/" + searchStateImages[searchState]);
			searchState++;
			setTimeout(animateSearch, 50);
		}
		else {
			$("#gp_lobby_players ul li:nth-child(1) button.search img").attr("src", "img/" + searchStateImages[searchState-1]);
			setTimeout(function() {
				searchState = 0;
				searchCycles++;
				animateSearch();
			}, 500);
		}
	}
	else {
		$("#gp_lobby_players ul li:nth-child(1) button").html("<img src='img/hf_avatar_2_small.png'>").addClass("player bulge").removeClass("search");
		$("#gp_lobby_players ul li:nth-child(1) button").bind("webkitAnimationEnd", function() {
			$("#gp_lobby_players ul li:nth-child(1) button").unbind("webkitAnimationEnd");
			$("#gp_lobby_players .ready").addClass("slide_in");
		});
	}
}

// Loads the game invites
function loadGameInvites() {
	$("#gp_invites").html(
		"<div class='components'>" +
			"<header><h1>Add Friends</h1></header>" +
			"<nav><button></button><input type='text'></nav>" +
			"<ul></ul>" +
			"<footer><button>Open to Randoms</button></footer>" +
		"</div>"
	);
	$("#gp_invites nav button").bind("click", function() {
		$("#gp_invites").hide();
	});
	$("#gp_invites").show();
}

function loadRecords(player) {
	$("#gp_profile").html(
		"<div class='components'>" +
			"<section id='gp_profile_record'>" +
				"<div class='components'>" +
					"<header><h1>My Record</h1></header>" +
					"<img src='img/hf_avatar_1_large.png'>" +
					"<ul>" +
						"<li><h1>002</h1><h2>Wins</h2></li>" +
						"<li><h1>003</h1><h2>Ties</h2></li>" +
						"<li><h1>006</h1><h2>Losses</h2></li>" +
					"</ul>" +
					"<button></button>" +
				"</div>" +
			"</section>" +
			"<section id='gp_profile_controls'>" +
				"<ul>" +
					"<li><button>Add to Friends</button></li>" +
					"<li><button>Poke Player</button></li>" +
				"</ul>" +
			"</section>" +
		"</div>"
	);
	$("#gp_profile_record button").bind("click", function() {
		$("#gp_profile").hide();
	});
	$("#gp_profile").show();
}

// Loads the options
function loadOptions(type) {
	if (type == "SINGLE") {
		var options = new Array("Resume", "Restart", "Highscores", "Help", "Main Menu");
	
		// Build the list of options
		$("#gp_options").html("<div class='components'><header></header><ul class='controls'></ul></div>");
		for (var i = 0; i < options.length; i++) {
			$("#gp_options ul").append("<li><button><p class='edge_l'></p><h1>" + options[i] + "</h1><p class='edge_r'></p></button></li>");
		}
		
		// Bind actions to the options
		$("#gp_options ul li:nth-child(1)").bind("click", function() {
			$("#gp_options").hide();		
		});
		$("#gp_options ul li:nth-child(5)").bind("click", function() {
			$("#fe").show();
			$("#game").removeClass("flip");
			$("#game").bind("webkitTransitionEnd", function() {
				$("#game").unbind("webkitTransitionEnd");
				$("#gp").hide();
				$("#gp_solo").hide();
				$("#gp_options").hide();
			});		
		});	
	}
	else {
		var options = new Array("Resume", "Profile", "Help", "Main Menu");
	
		// Build the list of options
		$("#gp_options").html("<div class='components'><header></header><ul class='controls'></ul></div>");
		for (var i = 0; i < options.length; i++) {
			$("#gp_options ul").append("<li><button><p class='edge_l'></p><h1>" + options[i] + "</h1><p class='edge_r'></p></button></li>");
		}
		
		// Bind actions to the options
		$("#gp_options ul li:nth-child(1)").bind("click", function() {
			$("#gp_options").hide();		
		});
		$("#gp_options ul li:nth-child(4)").bind("click", function() {
			$("#fe").show();
			$("#game").removeClass("flip");
			$("#game").bind("webkitTransitionEnd", function() {
				$("#game").unbind("webkitTransitionEnd");
				$("#gp").hide();
				$("#gp_lobby").hide();
				$("#gp_multi").hide();
				$("#gp_options").hide();
			});		
		});	
	}
	
	// Show the options panel
	$("#gp_options").show();
}