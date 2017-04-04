function Canvas(id) {
	
	var canvas = document.createElement("canvas"),
		context = canvas.getContext("2d");

	canvas.id = id;

	this.canvas = canvas;
	this.context = context;
}

Canvas.prototype.setSize = function(size) {
	this.canvas.width = this.canvas.height = size;
}

var cellCanvas = new Canvas("");

	cellCanvas.typeface = "PT Mono";
	cellCanvas.givenFontSize = "";
	cellCanvas.noteFontSize = "";

	cellCanvas.setSize = function(size) {
		
		this.canvas.width = this.canvas.height = size;
		
		this.givenFontSize = Math.round(this.canvas.height * 0.75) + "px ";
		this.noteFontSize = Math.round(this.canvas.height * 0.25) + "px ";
	}

	cellCanvas.setGiven = function(cell) {

		// Clear the context
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Set the font and its alignment
		this.context.font = this.givenFontSize + this.typeface;
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";

		// Draw in the value
		this.context.fillText(cell.given, this.canvas.width/2, this.canvas.height/2);
		
		return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	}

	cellCanvas.highlightGiven = function(cell) {

		// Clear the context
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Set the font and its alignment
		this.context.fillStyle = "#f90";
		this.context.font = this.givenFontSize + this.typeface;
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";

		// Draw the value
		this.context.fillText(cell.given, this.canvas.width/2, this.canvas.height/2);

		return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	}

function DigitsCanvas(id) {

	Canvas.call(this, id);

}

DigitsCanvas.prototype = Object.create(Canvas.prototype);
DigitsCanvas.prototype.constructor = DigitsCanvas;

DigitsCanvas.prototype.save = function() {

	this.image = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
}

DigitsCanvas.prototype.restore = function() {

	if (typeof this.image !== "undefined")
		this.context.putImageData(this.image, 0, 0);
}

var digitsCanvas = new Canvas("digits-canvas");

	// Saves the current state of the canvas
	digitsCanvas.save = function() {
		
		this.saveImage = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	}

	digitsCanvas.restore = function() {
		this.context.putImageData(this.saveImage, 0, 0);
	}


var gridCanvas = new Canvas("grid-canvas");
	/*
	gridCanvas.drawGrid = function(cellSize) {
		
		console.log("Drawing grid!");
		alert("jo");

		var canvas = this.canvas,
			context = this.context,
			offset = 0,
			minors = [1, 2, 4, 5, 7, 8],
			majors = [3, 6];

		// minors.forEach(function(minor) {
		// 	offset = minor * cellSize;
		// 	drawMinor(offset);
		// });

		// majors.forEach(function(major) {
		// 	offset = major * cellSize;
		// 	drawMajor(offset);
		// });

		function drawMinor(offset) {

			console.log("Drawing minor [" + offset + "]");

			offset += 0.5;

			context.lineWidth = 1;
			context.setLineDash([4,2]);
			context.strokeStyle = "#929292";

			drawLine(offset);
		}

		function drawMajor(offset) {

			console.log("Drawing major [" + offset + "]");

			context.lineWidth = 2;
			context.setLineDash([2,1]);
			context.strokeStyle = "#545454";

			drawLine(offset);
		}

		function drawLine(offset) {

			console.log("Now drawing line [" + offset + "]");

			// Draw the vertical
			context.beginPath();
			context.moveTo(offset, 0);
			context.lineTo(offset, canvas.height);
			context.closePath();
			context.stroke();

	  		// Draw the horizontal
	  		context.beginPath();
	  		context.moveTo(0, offset);
			context.lineTo(canvas.width, offset);
			context.closePath();
			context.stroke();
		}
	}
	*/

var selectionCanvas = new Canvas("selection-canvas");

	selectionCanvas.debug = function() {

		// DEBUG: REMOVE LATER
		// var ctx = selectionCanvas.getContext("2d");

		// for (var i = 0; i < 81; i++) {

		// 	if (i%2 === 0)
		// 		ctx.fillStyle = "rgba(255, 147, 0, 0.25)";
		// 	else
		// 		ctx.fillStyle = "rgba(0, 150, 255, 0.25)";

		// 	ctx.fillRect(cellSize * (i % 9), cellSize * Math.floor(i/9), cellSize, cellSize);
		// }
	}
