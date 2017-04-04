var view = (function() {

	"use strict";

	var cellSize = 0,
		gameboard = {},
		gameboardId = "gameboard";

	var mode = 0,
		fontfillColor = ["rgb(0, 150, 255)", "rgb(255, 147, 0)"],
		rectfillColor = ["rgba(0, 150, 255, 0.25)", "rgba(255, 147, 0, 0.25)"];

	var cellCanvas = (function() {

		var canvas = document.createElement("canvas"),
			context = canvas.getContext("2d"),
			typeface = "PT Mono",
			givenFontSize = "",
			noteFontSize = "";

		function setSize(newSize) {
			
			canvas.width = canvas.height = newSize;
			
			givenFontSize = Math.round(canvas.height * 0.75) + "px ";
			noteFontSize = Math.round(canvas.height * 0.25) + "px ";
		}

		function setGiven(cell) {

			// Clear the context
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Set the font and its alignment
			context.fillStyle = "#333";
			context.font = givenFontSize + typeface;
			context.textAlign = "center";
			context.textBaseline = "middle";

			// Draw in the value
			context.fillText(cell.given, canvas.width/2, canvas.height/2);
			
			return context.getImageData(0, 0, canvas.width, canvas.height);
		}

		function setGuess(cell) {

			// Clear the context
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Set the font and its alignment
			context.fillStyle = "#999";
			context.font = givenFontSize + typeface;
			context.textAlign = "center";
			context.textBaseline = "middle";

			// Draw in the value
			context.fillText(cell.value(), canvas.width/2, canvas.height/2);
			
			return context.getImageData(0, 0, canvas.width, canvas.height);
		}

		function showNotes(cell) {

			// Need to split and position the note values
			var top = canvas.height/4,
				left = canvas.width/4,
				mid = canvas.width/2,
				right = canvas.width/4 *3,
				bottom = canvas.height/4 *3;

			var notePositions = [
				[left, top], [mid, top], [right, top],
				[left, mid], [mid, mid], [right, mid],
				[left, bottom], [mid, bottom], [right, bottom]
			]

			var str = ".........";

			cell.notes.forEach(function(note) {
				str = replaceCharacterAt(str, note - 1, note);
			});

			// str = str.replace(/\./g, " ");
			// str = "123456789";
			
			// var row1 = str.substr(0, 3),
			// 	row2 = str.substr(3, 3),
			// 	row3 = str.substr(6, 3);

			// console.log(str);
			// console.log(row1 + ", " + row2 + ", " + row3);

			// Clear the context
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Set the font and its alignment
			context.fillStyle = "#333";
			context.font = noteFontSize + typeface;
			context.textAlign = "center";
			context.textBaseline = "middle";
		
			// Draw in the value
			//context.fillText(notes, canvas.width/2, canvas.height/2);
			// context.fillText(row1, canvas.width/2, canvas.height/4 * 1);
			// context.fillText(row2, canvas.width/2, canvas.height/4 * 2);
			// context.fillText(row3, canvas.width/2, canvas.height/4 * 3);

			for (var i = 0; i < str.length; i++) {
				if (str.charAt(i) !== ".")
					context.fillText(str.charAt(i), notePositions[i][0], notePositions[i][1]);
			}
			
			return context.getImageData(0, 0, canvas.width, canvas.height);

			function replaceCharacterAt(string, index, value) {

				return string.slice(0, index) + value + string.slice(index + 1);

				// console.log(string.length, index, value);
				
				// if (index < string.length - 1)
				// 	return string.slice(0, index) + value + string.slice(index + 1);
				// else
				// 	return string.slice(0, -1) + value; 
					
			} 
		}

		function highlight(cell) {

			// Clear the context
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Set the font and its alignment
			context.fillStyle = rectfillColor[mode];
			context.fillRect(0, 0, canvas.width, canvas.height);

			return context.getImageData(0, 0, canvas.width, canvas.height);
		}

		function highlightGiven(cell) {

			// Clear the context
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Set the font and its alignment
			context.fillStyle = fontfillColor[mode];
			context.font = givenFontSize + typeface;
			context.textAlign = "center";
			context.textBaseline = "middle";

			// Draw the value
			context.fillText(cell.given, canvas.width/2, canvas.height/2);

			return context.getImageData(0, 0, canvas.width, canvas.height);
		}

		function highlightValue(cell) {

			// Clear the context
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Set the font and its alignment
			context.fillStyle = fontfillColor[mode];
			context.font = givenFontSize + typeface;
			context.textAlign = "center";
			context.textBaseline = "middle";

			// Draw the value
			context.fillText(cell.value(), canvas.width/2, canvas.height/2);

			return context.getImageData(0, 0, canvas.width, canvas.height);
		}  

		return {

			canvas : function() { 
				return canvas; 
			},
			context : function() { 
				return context; 
			},
			setSize : function(newSize) {
				setSize(newSize);
			},
			setGiven : function(cell) {
				return setGiven(cell);
			},
			setGuess : function(cell) {
				return setGuess(cell);
			},
			highlightGiven : function(cell) {
				return highlightGiven(cell);
			},
			highlight : function(cell) {
				return highlight(cell);
			},
			highlightValue : function(cell) {
				return highlightValue(cell);
			},
			showNotes : function(cell) {
				return showNotes(cell);
			}
		};

	})();

	var digitsCanvas = (function() {

		var canvas = document.createElement("canvas"),
			context = canvas.getContext("2d"),
			imageData = {};

		return {

			canvas : function() { 
				return canvas; 
			},
			context : function() { 
				return context; 
			},
			save : function() {
				imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			},
			appendToSave : function(image, x, y) {
				
				var _canvas = document.createElement("canvas"),
					_context = _canvas.getContext("2d");

				_canvas.width = canvas.width;
				_canvas.height = canvas.height;

				_context.putImageData(imageData, 0, 0);
				_context.putImageData(image, x, y);

				imageData = _context.getImageData(0, 0, _canvas.width, _canvas.height);
			},
			restore : function() {
				context.putImageData(imageData, 0, 0);
			}
		};

	})();

	var gridCanvas = (function() {

		var canvas = document.createElement("canvas"),
			context = canvas.getContext("2d");

		function drawGrid(spacing) {

			var offset = 0,
				minors = [1, 2, 4, 5, 7, 8],
				majors = [3, 6];

			minors.forEach(function(minor) {
				offset = minor * spacing;
				drawMinor(offset);
			});

			majors.forEach(function(major) {
				offset = major * spacing;
				drawMajor(offset);
			});

			function drawMinor(offset) {

				offset += 0.5;

				context.lineWidth = 1;
				context.setLineDash([4,2]);
				context.strokeStyle = "#929292";

				drawLine(offset);
			}

			function drawMajor(offset) {

				// console.log("drawing major!");

				context.lineWidth = 2;
				context.setLineDash([]); // make it solid
				context.strokeStyle = "#545454";

				drawLine(offset);
			}

			function drawLine(offset) {

				// Draw the vertical
				context.beginPath();
				context.moveTo(offset, 0);
				context.lineTo(offset, canvas.height);
				context.stroke();

		  		// Draw the horizontal
		  		context.beginPath();
		  		context.moveTo(0, offset);
				context.lineTo(canvas.width, offset);
				context.stroke();
			}
		}

		return {

			canvas : function() { 
				return canvas; 
			},
			context : function() { 
				return context; 
			},
			drawGrid : function(spacing) { 
				drawGrid(spacing); 
			}
		};

	})();

	var selectionCanvas = (function() {

		var canvas = document.createElement("canvas"),
			context = canvas.getContext("2d"),
			imageData = {};

		return {

			canvas : function() { 
				return canvas; 
			},
			context : function() { 
				return context; 
			},
			save : function() {
				//console.log(canvas);
				imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			},
			restore : function() {
				context.putImageData(imageData, 0, 0);
			}
		};

	})();
	
	function initBoard(container, boardSize) {

		// Calculate the size of the gameboard

		var usableWidth = $(container).width();
		cellSize = Math.floor( usableWidth / boardSize );
		var gameboardWidth = cellSize * boardSize;

		// Create and size the gameboard
		gameboard = document.createElement("div");
		gameboard.id = gameboardId;
		gameboard.style.width = gameboard.style.height = gameboardWidth + "px";

		// Size and add the canvases to the gameboard
		setCanvasSize(digitsCanvas.canvas(), gameboardWidth);
		setCanvasSize(gridCanvas.canvas(), gameboardWidth);
		setCanvasSize(selectionCanvas.canvas(), gameboardWidth);
				
		gameboard.appendChild(selectionCanvas.canvas());
		gameboard.appendChild(digitsCanvas.canvas());
		gameboard.appendChild(gridCanvas.canvas());

		// Add the gameboard to the parent container
		container.appendChild(gameboard);

		// Size the cell canvas
		cellCanvas.setSize(cellSize);

		// Draw the grid
		// console.log("Preparing to draw the grid!");
		gridCanvas.drawGrid(cellSize);
		
		selectionCanvas.save();
		
		return gameboard;

		function setCanvasSize(canvas, newSize) {
			canvas.width = canvas.height = newSize;
		}
	}

	function getCellCoords(event) {

		var pos = {},
			r = [0, 0];

		// console.log(event.clientX + ", " + event.clientY);
		
		if (event.pageX != undefined && event.pageY != undefined) {
			pos.x = event.pageX;
			pos.y = event.pageY;
		}
		else {
			pos.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			pos.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		
		pos.x -= gameboard.offsetLeft;
		pos.y -= gameboard.offsetTop;

		// Show info in the debugging element
		// var markup = "Pos: " + pos.x + ", " + pos.y + " Row: " + getCellIndex(pos.y) + " Col: " + getCellIndex(pos.x);
		// debug.innerHTML = "<p>" + markup + "</p>";

		r[0] = getIndex(pos.x);
		r[1] = getIndex(pos.y);

		// console.log("Pos: " + pos.x + "," + pos.y + " Cell: " + r);

		function getIndex(pos) {

			var pos = Math.floor((gameboard.offsetWidth + pos) / cellSize - 9);

			if (pos >= 9) return 8;
			else return pos;
		}

		return r;
	}

	function insertGivens(cells) {
			
		cells.forEach(function(cell) {

			var image = cellCanvas.setGiven(cell),
				x = cell.pos[0] * image.width,
				y = cell.pos[1] * image.height;

			digitsCanvas.context().putImageData(image, x, y);
		});

		digitsCanvas.save();
	}

	function highlightGivens(cells) {

		digitsCanvas.restore();

		cells.forEach(function(cell) {

			var image = cellCanvas.highlightGiven(cell),
				x = cell.pos[0] * image.width,
				y = cell.pos[1] * image.height;

			digitsCanvas.context().putImageData(image, x, y);
		});
	}

	function highlightValues(cells) {

		digitsCanvas.restore();

		cells.forEach(function(cell) {

			var image = cellCanvas.highlightValue(cell),
				x = cell.pos[0] * image.width,
				y = cell.pos[1] * image.height;

			digitsCanvas.context().putImageData(image, x, y);
		});
	}

	function showPossibleLocations(cells) {

		selectionCanvas.restore();

		cells.forEach(function(cell) {

			var image = cellCanvas.highlight(cell),
				x = cell.pos[0] * image.width,
				y = cell.pos[1] * image.height;

			selectionCanvas.context().putImageData(image, x, y);
		});
	}

	function reset() {

		selectionCanvas.restore();
		digitsCanvas.restore();
	}

	function toggleMode() {
		
		if (mode === 0) mode = 1;
		else mode = 0;

		return mode;
	}

	function addGuess(cell) {

		// Add the guess to the base digits image, save it as the new base
		// Highlight the value

		// console.log(cell);

		var guessImage = cellCanvas.setGuess(cell),
			highlightedImage = cellCanvas.highlightValue(cell),
			x = cell.pos[0] * guessImage.width,
			y = cell.pos[1] * guessImage.height;

		digitsCanvas.appendToSave(guessImage, x, y);
		digitsCanvas.context().putImageData(highlightedImage, x, y);
	}

	function showNotes(cell) {

		var image = cellCanvas.showNotes(cell), 
			x = cell.pos[0] * image.width, 
			y = cell.pos[1] * image.height;

		// append the image to the save
		digitsCanvas.context().putImageData(image, x, y);
		digitsCanvas.appendToSave(image, x, y);
	}

	return {
		
		initBoard : function(container, boardSize) {
			return initBoard(container, boardSize);	
		},
		getCellCoords : function(event) {
			return getCellCoords(event);
		},
		insertGivens : function(cells) {
			insertGivens(cells);
		},
		highlightGivens : function(cells) {
			highlightGivens(cells);
		},
		highlightValues : function(cells) {
			highlightValues(cells);
		},
		showPossibleLocations : function(cells) {
			showPossibleLocations(cells);
		},
		reset : function() {
			reset();
		},
		toggleMode : function() {
			return toggleMode();
		},
		mode : function() {
			return mode;
		},
		addGuess : function(cell) { // showGuess?
			addGuess(cell);
		},
		showNotes : function(cell) {
			showNotes(cell);
		}
	};

}).call(this);