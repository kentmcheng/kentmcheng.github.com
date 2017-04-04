var sudoku = (function() {

	"use strict";

	var cells = [];

	var blocks = [
		[
			[0, 0], [1, 0], [2, 0],
			[0, 1], [1, 1], [2, 1],
			[0, 2], [1, 2], [2, 2]
		],
		[
			[3, 0], [4, 0], [5, 0], 
			[3, 1], [4, 1], [5, 1],
			[3, 2], [4, 2], [5, 2]
		],
		[
			[6, 0], [7, 0], [8, 0],
			[6, 1], [7, 1], [8, 1],
			[6, 2], [7, 2], [8, 2],
		],
		[
			[0, 3], [1, 3], [2, 3],
			[0, 4], [1, 4], [2, 4],
			[0, 5], [1, 5], [2, 5]
		],
		[
			[3, 3], [4, 3], [5, 3],
			[3, 4], [4, 4], [5, 4],
			[3, 5], [4, 5], [5, 5]
		],
		[
			[6, 3], [7, 3], [8, 3],
			[6, 4], [7, 4], [8, 4],
			[6, 5], [7, 5], [8, 5]
		],
		[
			[0, 6], [1, 6], [2, 6],
			[0, 7], [1, 7], [2, 7],
			[0, 8], [1, 8], [2, 8]
		],
		[
			[3, 6], [4, 6], [5, 6],
			[3, 7], [4, 7], [5, 7],
			[3, 8], [4, 8], [5, 8]
		],
		[
			[6, 6], [7, 6], [8, 6],
			[6, 7], [7, 7], [8, 7],
			[6, 8], [7, 8], [8, 8]
		]
	];

	var cols = [
		[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8]],
		[[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8]],
		[[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8]],
		[[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8]],
		[[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
		[[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8]],
		[[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8]],
		[[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8]],
		[[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8]]
	];

	var rows = [
		[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]],
		[[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]],
		[[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]],
		[[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3]],
		[[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4]],
		[[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5]],
		[[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6]],
		[[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7]],
		[[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8]] 
	];
  
	// Create a 2d array for the cells
	var count = 1;

	for (var i = 0; i < rows.length; i++) {
		
		cells.push([]);
		
		for (var j = 0; j < cols.length; j++) {
			
			cells[i].push(new Cell(count, j, i));
			count++;
		}
	}

	// Find and return the cells that match the cell's given
	function givens(cell) {

		var givens = [cell];

		for (var i = 0; i < blocks.length; i++) {

			// Search the other 8 blocks
			if (i !== cell.block) { 

				// Check each cell of each block
				for (var j = 0; j < blocks[i].length; j++) {

					var blockCell = getCell(blocks[i][j]);

					// If we find a match add it to the array and end the current loop
					if (blockCell.value() === cell.given) {

						givens.push(blockCell);
						j = blocks[i].length;
					}
				}
			}
		}

		var str = "";
		givens.forEach(function(item) { str += "[" + item.pos + "]"; });
		// console.log("There are " + givens.length + " instances of the value " + cell.given + " at locations: " + str);
		
		return givens;
	}

	function guess(coords, value) {

		var cell = getCell(coords);
		
		if (cell.guess === value) // remove the guess if it matches
			cell.guess = -1;
		else 
			cell.guess = value; // add or replace if it's different

		return cell;
	}

	// Take in an array of givens and return a list of the possible remaining locations
	function possibleLocations(givens) {

		var blocks = [0, 1, 2, 3, 4, 5, 6, 7, 8],
			cols = [0, 1, 2, 3, 4, 5, 6, 7, 8],
			rows = [0, 1, 2, 3, 4, 5, 6, 7, 8],
			possibleCells = [];

		// Go through each given and mark their respective units
		givens.forEach(function(given) {

			blocks[given.block] = -1;	
			cols[given.pos[0]] = -1;
			rows[given.pos[1]] = -1;
		});

		// Go through the tables to determine which cells are possibles 
		for (var i = 0; i < cols.length; i++) { // x
			for (var j = 0; j < rows.length; j++) { // y

				var x = cols[i],
					y = rows[j];

				if (x !== -1 && y !== -1) { // is a valid cell

					var cell = getCell([x, y]);

					// Check if it's in a valid block and is a non-given cell
					if (blocks[cell.block] !== -1 && cell.value() === "") {
						
						possibleCells.push(cell); // add it to the list
					}
				}
			}
		}

		return possibleCells;
	}

	// Take in an array of cells and return a list of the remaining values
	function possibleValues(cells) {

		var values = [1, 2, 3, 4, 5, 6, 7, 8, 9],
			possibles = [];

		// Go through the cells and flag the values that already exist
		cells.forEach(function(cell) {
			values[cell.value() - 1] = -1; 
		});

		// Go through the values and see what's left
		values.forEach(function(value) { 
			if (value !== -1) possibles.push(value);
		});

		// console.log(possibles);
		return possibles;
	}

	// Find and return the cells that have values for the cell's 3 units
	function takens(cell) {

		var block = blocks[cell.block],
			col = cols[cell.pos[0]],
			row = rows[cell.pos[1]],
			takens = [];

		for (var i = 0; i < block.length; i++) {

			isTaken(getCell(block[i]));
			isTaken(getCell(col[i]));
			isTaken(getCell(row[i]));
		}

		function isTaken(cell) {
			
			if (cell.isTaken()) takens.push(cell);
		}

		return takens;
	}

	function newPuzzle() {

		//e1 = ".2.579......1...2..9...8..69..24.1837...1...4.1..93.6.8.7.5...265..8.43.24.73165."
		//m1 = "7.63.2...........5.426.......9541..85.........18.93...8.723516.2.41.......59....."
		//h1 = ".8...3.......548....5.76..95..1...9.3..5........7..6.4....8....8.1.2.563..76...4."
		//h2 = ".1.4.3...4..7...23.7.9..5......592.....23.8.......7..9.....1..6564.8.9.1..8......"
		//h3 = "...4..13.617........2.57...2....39...9....846..1..53...43...7....8.......56....13"
		//h4 = "......796..983.14...4..2..57..3....9.3....28.....6...3..1..3...82.5...........6.4"
		//h5 = ".....1.479..7......4..62...89.....7...3.94.1.........323.....8....5..7...64...15."
		//e1 = ".......7.....1....12...9..5.6..2.9...9...4.1..726..8..........864.9........476..."
		//e2 = ".....4.2.9..6.....1.79..5......35...36......5..4...1.9.238...........762..9.7...."
		//e3 = "..5..9.6.....3..8...18...533.9..4.15..73.......4.....6...6.18...1..4....4.2....7."
		//e4 = ".6.35..8...5....427...2.9.......1...27...6...5.9.7...8...1...5.....3.....8....4.3"

		var puzzle = ".1.4.3...4..7...23.7.9..5......592.....23.8.......7..9.....1..6564.8.9.1..8......",
			puzzleGivens = puzzle.split(""),
			givens = [],
			coords = [-1, -1];

		for (var i = 0; i < puzzleGivens.length; i++) {

			if (puzzleGivens[i] !== ".") {

				coords[0] = i % cols.length;
				coords[1] = Math.floor(i / rows.length);

				getCell(coords).given = parseInt(puzzleGivens[i]);
				givens.push(getCell(coords));
			}
		}

		return givens;
	}

	function getCell(coords) {
		return cells[coords[1]][coords[0]];
	}

	// Cell class
	function Cell(id, x, y) {
		
		this.id = id,
		this.pos = [x, y],
		this.block = Math.floor(x/3) + (Math.floor(y/3) * 3);
		this.given = -1,
		this.guess = -1,
		this.notes = [];

		this.hasGiven = function() {
			
			if (this.given !== -1)
				return true;
			else
				return false;
		}

		this.isTaken = function() {

			if (this.given !== -1 || this.guess !== -1)
				return true;
			else
				return false;
		}

		this.value = function() {

			if (this.guess !== -1)
				return this.guess;
			else if (this.given !== -1)
				return this.given;
			else
				return "";
		}
	}

	return { // public interface
		
		block : function(i) { 
  			return blocks[i]; 
  		},
  		cell : function(coords) {
  			return getCell(coords);
  		}, 
  		cells : function() { 
  			return cells; 
  		},
  		newPuzzle : function() {
  			return newPuzzle();
  		},
  		givens : function(cell) {
  			return givens(cell);
  		},
  		guess : function(coords, value) {
  			return guess(coords, value);
  		},
  		note : function(coords, value) {

  			var cell = getCell(coords),
  				hasNoteValue = false,
  				hasNoteIndex = -1;

  			// Check if the value exists
  			for (var i = 0; i < cell.notes.length; i++) {
  				
  				if (cell.notes[i] === value) {
  					
  					hasNoteValue = true;
  					hasNoteIndex = i;
  					i = cell.notes.length;
  				}
  			}

  			// console.log(cell.notes);

  			if (!hasNoteValue) 
  				cell.notes.push(value); // doesn't exist, so add it
  			else 
  				cell.notes.splice(hasNoteIndex, 1); // it exists, so remove it

  			return cell;
  		},
  		possibleLocations : function(givens) {
  			return possibleLocations(givens);
  		},
  		possibleValues : function(cells) {
  			return possibleValues(cells);
  		},
  		takens : function(cell) {
  			return takens(cell);
  		},
  		findGiven : function(value) { // return's the first instance of a cell with that value

  			// console.log(value + " is a " + typeof value);

  			// Check each cell in each block
  			// blocks.forEach(function(block) {
  				
  			// 	block.forEach(function(coords) {
  					
  			// 		var cell = getCell(coords);
  					
  			// 		if (cell.given === value) {

  			// 			console.log("Match found at: " + coords);
  			// 			return cell;
  			// 		}
  			// 	});
  			// });

  			for (var i = 0; i < blocks.length; i++) {

  				var block = blocks[i];

  				for (var j = 0; j < block.length; j++) {

  					var cell = getCell(block[j]);

  					if (cell.given === value) {

  						// console.log("Match found at: " + cell.pos);
  						return cell;
  					}
  				}
  			}

  			return false;
  		},
  		unitCells : function(cell) { // returns the 27 related cells
  			
  			var block = blocks[cell.block],
  				col = cols[cell.pos[0]],
  				row = rows[cell.pos[1]],
  				cells = [];

  			for (var i = 0; i < block.length; i++) {

  				cells.push(getCell(block[i]));
  				cells.push(getCell(col[i]));
  				cells.push(getCell(row[i]));
  			}

  			return cells;
  		},
  		removeNote : function(cell, value) {

  			if (cell.value() !== "")
  				return false;

  			var noteIndex = cell.notes.indexOf(value);
  			
			if (noteIndex !== -1) {
  				cell.notes.splice(noteIndex, 1);
  				return true;
			}
			else return false;
  		}
  	};

}).call(this);