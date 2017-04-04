// APP Controller
var app = (function() {

	var appContainer = {},
		board = {};

	var prevCoords = null;
	var prevSelection = null;

	function initApp(targetId) {

		appContainer = document.getElementById(targetId);

		// Build the board
		//console.log(appContainer.offsetWidth);
		board = view.initBoard(appContainer, sudoku.cells().length);

		// Insert the puzzle hints
		view.insertGivens(sudoku.newPuzzle());
		
		$(board).on("click", function(event) {
			onSelection(view.getCellCoords(event));
		});

		var c = document.createElement("div");
		c.id = "controls";

		appContainer.appendChild(c);
		controls.init(c.id, onKeyPress);

		// Desktop shortcut keys
		$(document).keydown(function(e) {

			//console.log(e.which); // to find the key code
			switch(e.which) {
		        
				case 32: // space bar

					onKeyPress("toggle");
					break;

				case 49: // 1
				case 50: // 2
				case 51: // 3
				case 52: // 4
				case 53: // 5
				case 54: // 6
				case 55: // 7
				case 56: // 8
				case 57: // 9

					onKeyPress("input", Math.abs(49 - e.which -1));
					break;

				default: return; // escape any other keys
			}
			e.preventDefault(); // prevent the default action (scroll / move caret)
		});
	}

	function onSelection(coords) {

		if (prevCoords) {

			if (prevCoords.toString() === coords.toString()) {

				prevCoords = null;
				prevSelection = null;

				controls.disableAll();
				view.reset();
				
				return;
			}
		}

		prevCoords = coords;

		var cell = sudoku.cell(coords);
		
		// console.log(cell);

		if (cell.hasGiven()) {
			prevSelection = function(cell) {
				showGivens(cell);
			}
			showGivens(cell);
		}
		else {
			prevSelection = function(cell) {
				showPossibles(cell);
			}
			showPossibles(cell);
		}
	}

	// Find the cells that match the given value and highlight those values
	// Highlight the cells where the given value can exist in the other blocks
	function showGivens(cell) {

		var givens = sudoku.givens(cell),
			possibleCells = sudoku.possibleLocations(givens);
		
		controls.disableAll();
		view.highlightValues(givens); // rename highlightValues
		view.showPossibleLocations(possibleCells); // rename highlightCells
	}

	// Highlight the selected cell (possible cell)
	// Highlight the values associated to the cell's 3 units
	// Update the controls to reflect the possible values
	function showPossibles(cell) {
		
		var takens = sudoku.takens(cell),
			possibleValues = sudoku.possibleValues(takens);

		if (cell.value() !== "")
			possibleValues.push(cell.value());

		controls.enableInputKeys(possibleValues);
		controls.enableClearKey(); // only if there's a guess

		view.showPossibleLocations([cell]);
		view.highlightValues(takens);
	}

	function onKeyPress(action, value) {
		
		//console.log("Action is: " + action + ", value: " + value);

		switch(action) {
			
			case "input":

				if (controls.isInputValid(value)) {

					// console.log("Add guess of " + value);

					// Get the input mode from the view
					if (view.mode() === 0) {
						// add a guess
						var cell = sudoku.guess(prevCoords, value); // returns the modified cell
						view.addGuess(cell);  // use the new cell return from sudoku

						if (cell.value() !== "") {
							var given = sudoku.findGiven(cell.value());
							// console.log(given);
							showGivens(given);
							prevCoords = given.pos;
							prevSelection = function(cell) {
								showGivens(given);
							}
						}

						// clean up notes?
						var unitCells = sudoku.unitCells(cell);

						unitCells.forEach(function(cell) {
							if (sudoku.removeNote(cell, value))
								view.showNotes(cell);
						});

						//showGivens(cell); 
					}
					else {
						// add a note
						var cell = sudoku.note(prevCoords, value); // returns the modified cell
						// console.log(cell);
						view.showNotes(cell);
						//view.note(cell, value);  // use the new cell return from sudoku
					}
				}

				break;
			
			case "clear":
				
				// console.log("Clear cell");
				// sudoku.clearCell(cell);
				// view.clearCell(cell);
				break;

			case "toggle":
				
				// console.log("Toggle input mode");
				//console.log(prevSelection);
				
				// sudoku.toggleMode();
				controls.toggleMode(view.toggleMode());

				if (prevSelection) prevSelection(sudoku.cell(prevCoords));
				
				break;

			default: return;
		}
	}

	// PUBLIC FUNCTIONS
	return {
		
		init : function(targetId) {
			initApp(targetId);
		}
	};

}).call(this);

// TODO: INCLUDE THIS AS PART OF THE VIEW CONTROLLER
var controls = (function() {

	var container = {};

	var buttons = {
		baseId : "input-key-",
		inputKeys : [
			{
				actionType : "input",
				value : 1
			},
			{
				actionType : "input",
				value : 2
			},
			{
				actionType : "input",
				value : 3
			},
			{
				actionType : "input",
				value : 4
			},
			{
				actionType : "input",
				value : 5
			},
			{
				actionType : "input",
				value : 6
			},
			{
				actionType : "input",
				value : 7
			},
			{
				actionType : "input",
				value : 8
			},
			{
				actionType : "input",
				value : 9
			}
		],
		clearKey : {
			actionType : "clear",
			classList : "fa fa-eraser"
		},
		toggleKey : {
			actionType : "toggle",
			classList : "fa fa-pencil",
		}
	};

	var KEY_1 = 0,
		KEY_2 = 1,
		KEY_3 = 2,
		KEY_4 = 3,
		KEY_5 = 4,
		KEY_6 = 5,
		KEY_7 = 6,
		KEY_8 = 7,
		KEY_9 = 8;

	var inputMethods = ["pen", "pencil"];

	var validInputValues = [];
	
	function disableButton(button, isDisabled) {

		buttonElement = document.getElementById(button.id);
		
		if (isDisabled)
			buttonElement.disabled = true;
		else
			buttonElement.disabled = false;
	}

	function disableClearKey(isDisabled) {
		disableButton(buttons.clearKey, isDisabled);
	}

	function disableInputKeys(values, isDisabled) {

		values.forEach(function(value) {
			disableButton(buttons.inputKeys[value - 1], isDisabled);
			if (!isDisabled) validInputValues.push(value);
		});
	}

	function disableAll(isDisabled) {

		validInputValues = [];

		disableButton(buttons.clearKey, isDisabled)

		buttons.inputKeys.forEach(function(button) {
			disableButton(button, isDisabled);
		});
	}

	function switchToggleKey() {

		// Game needs to know which mode
		var button = document.getElementById(buttons.toggleKey.id);
		
		if (button.classList.contains("fa-pencil")) {
			button.classList.add("fa-paint-brush");
			button.classList.remove("fa-pencil");
		}
		else {
			button.classList.add("fa-pencil");
			button.classList.remove("fa-paint-brush");
		}
	}

	function init(targetId, callback) {

		container = document.getElementById(targetId);
		container.classList.add(inputMethods[0]);

		var row1 = [
			buttons.inputKeys[KEY_1],
			buttons.inputKeys[KEY_3],
			buttons.inputKeys[KEY_5],
			buttons.inputKeys[KEY_7],
			buttons.inputKeys[KEY_9]
		];

		var row2 = [
			buttons.clearKey,
			buttons.inputKeys[KEY_2],
			buttons.inputKeys[KEY_4],
			buttons.inputKeys[KEY_6],
			buttons.inputKeys[KEY_8],
			buttons.toggleKey
		];

		// Create the buttons
		container.appendChild(createButtons(row1));
		container.appendChild(createButtons(row2));

		$(container).on("click", "button", function() {
			if (typeof callback === 'function')
				callback(this.getAttribute("data-action-type"), parseInt(this.innerHTML));
		});

		//$("#" + buttons.toggleKey.id).on("click", switchToggleKey);

		disableAll(true);

		// Creates and inserts the button markup
		// Takes an array of buttons and builds them in that order
		function createButtons(buttonArray) {

			var container = document.createElement("ul");

			for (var i = 0; i < buttonArray.length; i++) {

				var item = buttonArray[i],
					itemId = buttons.baseId,
					button = document.createElement("button"),
					buttonContainer = document.createElement("li");
					
				if (typeof item.value !== "undefined") {
					button.innerHTML = item.value;
					itemId += item.value;
				}
				else {
					itemId += item.actionType;
				}

				item.id = itemId;
				button.setAttribute("id", itemId);
				button.setAttribute("data-action-type", item.actionType);

				if (typeof item.classList !== "undefined")
					button.setAttribute("class", item.classList);

				buttonContainer.appendChild(button);
				container.appendChild(buttonContainer);
			}

			return container;
		}
	}

	function toggleMode(mode) {

		// console.log(mode);
		// console.log(inputMethods);

		if (mode === 0) {
			container.classList.add(inputMethods[0]);
			container.classList.remove(inputMethods[1]);
		}
		else {
			container.classList.add(inputMethods[1]);
			container.classList.remove(inputMethods[0]);
		}

		switchToggleKey();
	}

	return {

		init : function(targetId, callback) {
			init(targetId, callback);
		},
		disableClearKey : function() {
			disableClearKey(true);
		},
		enableClearKey : function() {
			disableClearKey(false);
		},
		disableInputKeys : function(values) {
			disableAll(false);
			disableInputKeys(values, true);
		},
		enableInputKeys :function(values) {
			disableAll(true);
			disableInputKeys(values, false);
		},
		disableAll : function() {
			disableAll(true);
		},
		enableAll : function() {
			disableAll(false);
		},
		toggleMode : function(mode) {
			toggleMode(mode);
		},
		isInputValid : function(value) {
			
			if (validInputValues.indexOf(value) !== -1) 
				return true;
			else 
				return false;
		}
	};

})();



