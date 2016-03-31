var notFiltered = [
	"math-8",
	"math-9",
	"math-10"
];

var filtered = [];

function showCourse(courseId) {


	// Determine the filter action (on or off)

	var pos = filtered.indexOf(courseId);

	if (pos === -1) { // filtered it

		filtered.push(courseId); // add it to the filtered list

	} else { // do not filter it

		filtered.splice(pos, 1); // remove it
	}

	var course = document.getElementById(courseId);
	course.style.display = "";

	applyFilters();
}

function applyFilters() {

	// Hide all the courses that shouldn't be shown

	var courses = document.getElementsByClassName("course");

	for (var i = 0; i < courses.length; i++) {

		// Determine if it should be hidden

		if (filtered.length !== 0) { // only hide if there is a filtered applied

			if (filtered.indexOf(courses[i].id) === -1) {

				courses[i].style.display = "none";
			}
		}
		else {

			courses[i].style.display = "";
		}		
	}
}

function clearFilters() {

	// Empty the filtered list and then apply the filters

	filtered = [];

	applyFilters();

	clearCheckboxes();

	function clearCheckboxes() {

		var cbList = document.getElementById("sp-results-filters-checkboxes"),
			checkboxes = document.getElementsByTagName("input");

		for (var i = 0; i < checkboxes.length; i++) {

			if (checkboxes[i].type === "checkbox")
				checkboxes[i].checked = false;
		}
	}
}

function addCourseResults(courseId, courseTitle, numberOfResults) {

	var courseContainer = document.getElementById(courseId);

	var title = document.createElement("h4");
	title.innerText = courseTitle + " (" + numberOfResults + ")";

	console.log(title);

	courseContainer.appendChild(title);

	for (var i = 0; i < numberOfResults; i++) {

		var r = addResult();

		courseContainer.appendChild(r);
	}

	// Add the course to the filters list & bind the filter action
}

function addResult() {

	var c = document.createElement("li");

	c.innerHTML = (
		'<div class="row desc">' +
			'<div class="col-xs-12">' +
				'<h5><a href="#">Surface area and volume of prisms</a></h5>' +
				'<p>So, we’ve learned the basics in the “Introduction to volume” lesson. Now, let’s practice some harder questions on how to find out the surface area and volume of prisms.</p>' +
				'<h6>Examples</h6>' +
				'<p>Find the surface area and volume of the following prisms:</p>' +
			'</div>' +
		'</div>' +
		'<!-- Example + Video -->' +
		'<div class="row details">' +
			'<div class="col-xs-8 col-sm-7">' +
				'<img src="https://dcvp84mxptlac.cloudfront.net/screenshots/MATH10-2-1-X-1a.jpeg">' +
			'</div>' +
			'<div class="col-xs-4 col-sm-5">' +
				'<img src="https://dcvp84mxptlac.cloudfront.net/diagrams/MATH10-2-1-A-1a.png">' +
			'</div>' +
		'</div>' +
		'<!-- Jump to the entire lesson -->' +
		'<div class="row">' +
			'<div class="col-xs-12">' +
				'<p><a href="#">See All Examples</a></p>' +
			'</div>' +
		'</div>'
	);

	return c;
}

