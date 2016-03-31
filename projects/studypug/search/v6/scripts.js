
// NEW ITEM MARKUP

function addData(targetId) {

	container = document.getElementById(targetId),
	results = data.results.lessons;

	for (var i = 0; i < results.length; i++) {

		var node = addSearchResult(results[i]);

		container.appendChild(node);
	}

	function addSearchResult(obj) {

		var resultsNode = document.createElement("li"),
			foundWithin = "",
			exampleImage = "";

		for (var i = 0; i < obj.belongsTo.length; i++) {

			var courseInfo = obj.belongsTo[i];

			if (i !== 0) foundWithin += ", ";

			foundWithin += "<a href='#'>" + courseInfo.course + "</a>";
		}

		if (obj.example.image) {
			exampleImage = "<img class='sp-results-example-img' src='" + obj.example.image + "'>";
		}

		resultsNode.innerHTML = (
			'<div class="row desc">' +
				'<div class="col-xs-12">' +
					'<h5><a href="#">' + obj.name + '</a></h5>' +
					'<p>' + obj.desc + '</p>' +
				'</div>' +
			'</div>' +
			'<!-- Video & Examples -->' +
			'<div class="row sp-details">' +
				'<div class="col-xs-12 col-md-6">' +
					'<img class="sp-video" src="' + obj.videoThumnail + '">' +
					'<p>Found within: ' + foundWithin + '</p>' +
				'</div>' +
				'<div class="hidden-xs hidden-sm col-md-6">' +
					'<h6>Example:</h6>' +
					'<p>' + obj.example.text + '</p>' + exampleImage +
				'</div>' +
			'</div>'
		);

		return resultsNode;
	}
}

var data = {
	
	results: {

		term: "Prism",
		lessons: [
			{
				name: "Surface area and volume of prisms",
				desc: "So, we’ve learned the basics in the “Introduction to volume” lesson. Now, let’s practice some harder questions on how to find out the surface area and volume of prisms and composite solids.",
				videoThumnail: "https://dcvp84mxptlac.cloudfront.net/screenshots/MATH10-2-1-X-1a.jpeg",
				example: {
					text: "Find the surface area and the volume of the following prisms:",
					image: "https://dcvp84mxptlac.cloudfront.net/diagrams/MATH10-2-1-A-1a.png"
				},
				belongsTo: [
					{
						course: "Math 8",
						chapter: "Chapter 17: Geometry"
					},
					{
						course: "Algebra 1",
						chapter: "Chapter 6: Geometry"
					},
					{
						course: "Geometry",
						chapter: "Chapter 3: Surface Area and Volume"
					}
				] 
			},
			{
				name: "Introduction to Volume",
				desc: "In this lesson, we will make use of what we learn from the surface area chapter to calculate the volume of 3D shapes like triangular prisms and cylinders.",
				videoThumnail: "https://dcvp84mxptlac.cloudfront.net/screenshots/MATH8-7-1-X-1a_480p.jpeg",
				example: {
					text: "Find the volume.",
					image: "https://dcvp84mxptlac.cloudfront.net/diagrams/MATH8-7-1-X-1a.png"
				},
				belongsTo: [
					{
						course: "Math 7",
						chapter: "Chapter 17: Volume"
					},
					{
						course: "Pre-Algebra",
						chapter: "Chapter 12: Volume of 3-Dimensional Shapes"
					},
					{
						course: "Algebra 1",
						chapter: "Chapter 6: Geometry"
					}
				] 
			},
			{
				name: "Surface area of prisms",
				desc: "In this section, we will learn how to calculate the surface area of rectangular and triangular prisms. The calculation is easier than what it may seem if you know the surface area formulas for regular polygons.",
				videoThumnail: "https://dcvp84mxptlac.cloudfront.net/screenshots/MATH8-5-3-X-1_480p.jpeg",
				example: {
					text: "Find the surface area of the rectangular prism. ",
					image: "https://dcvp84mxptlac.cloudfront.net/diagrams/MATH8-5-3-X-1.png"
				},
				belongsTo: [
					{
						course: "Math 7",
						chapter: "Chapter 16: Introduction to 3D Objects"
					},
					{
						course: "Math 8",
						chapter: "Chapter 17: Geometry"
					},
					{
						course: "Pre-Algebra",
						chapter: "Chapter 11: Surface Area of 3-Dimensional Shapes"
					},
					{
						course: "College Algebra",
						chapter: "Chapter 1: Surface Area and Volume"
					}
				] 
			},
			{
				name: "Volume of prisms",
				desc: "In the previous section, we learned the basic formula to calculate volume of prisms. We will practice more on calculating the volume of different types of regular prisms such as, rectangular and triangular prisms, and irregular prisms.",
				videoThumnail: "https://dcvp84mxptlac.cloudfront.net/screenshots/MATH8-7-2-X-1a_480p.jpeg",
				example: {
					text: "Find the volume.",
					image: "https://dcvp84mxptlac.cloudfront.net/diagrams/MATH8-7-2-X-1a.png"
				},
				belongsTo: [
					{
						course: "Math 7",
						chapter: "Chapter 17: Volume"
					},
					{
						course: "Pre-Algebra",
						chapter: "Chapter 12: Volume of 3-Dimensional Shapes"
					}
				] 
			},
			{
				name: "Word problems relating volume of prisms and cylinders",
				desc: "We have learned the how to calculate volume of cylinders and prisms. In this section, we will work on word problems which involve both cylinders and prisms.",
				videoThumnail: "https://dcvp84mxptlac.cloudfront.net/screenshots/MATH8-7-4-X-1_480p.jpeg",
				example: {
					text: "A cylindrically-shaped plasticine is 8 cm tall and has a radius of 3 cm. If a kid reshapes this plasticine into a cube, what will be the side length of the cube? Give your answer to two decimal places.",
				},
				belongsTo: [
					{
						course: "Math 7",
						chapter: "Chapter 17: Volume"
					},
					{
						course: "Pre-Algebra",
						chapter: "Chapter 12: Volume of 3-Dimensional Shapes"
					},
				] 
			},
		]
	}
}


// OLD CODE NOT USED & PROBABLY BROKEN

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

	// title.onclick = function() {
	// 	hideResults(courseId);
	// };

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
				'<h5><a href="#">Surface area and volume of <span class="sp-highlight">prism</span>s</a></h5>' +
				'<p>So, we’ve learned the basics in the “Introduction to volume” lesson. Now, let’s practice some harder questions on how to find out the surface area and volume of <span class="sp-highlight">prism</span>s.</p>' +
			'</div>' +
		'</div>' +
		'<!-- Video & Examples -->' +
		'<div class="row sp-details">' +
			'<div class="col-xs-12 col-md-6">' +
				'<img class="sp-video" src="https://dcvp84mxptlac.cloudfront.net/screenshots/MATH10-2-1-X-1a.jpeg">' +
			'</div>' +
			'<div class="col-xs-12 col-md-6">' +
				'<h6>Examples:</h6>' +
				'<p>Find the surface area and volume of the following <span class="sp-highlight">prism</span>s:</p>' +
				'<img src="https://dcvp84mxptlac.cloudfront.net/diagrams/MATH10-2-1-A-1a.png">' +
			'</div>' +
		'</div>' +
		'<!-- Jump to the entire lesson -->' +
		'<div class="row">' +
			'<div class="col-xs-12">' +
				'<p>Found in <a href="#">Course name – Chapter #: name</a></p>' +
			'</div>' +
		'</div>'
	);

	return c;
}

function hideResults(courseId) {

	var courseList = document.getElementById(courseId);

	courseList.classList.toggle("hide-items");
}