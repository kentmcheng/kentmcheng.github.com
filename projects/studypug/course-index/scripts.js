var data = {
	
	topics : [
		{
			topic: "Number Theory",
			subTopics: [
				{
					title: "Understanding the number systems", 
					isFree: true
				},
				{
					title: "Prime factorization",
					isFree: false
				},
				{
					title: "Greatest Common Factor (GCF)",
					isFree: false
				},
				{
					title: "Least Common Multiple (LCM)",
					isFree: true
				}
			]
		},
		{
			topic: "Integers",
			subTopics: [
				{
					title: "Understanding the number systems",
					isFree: true
				}
			]
		},
		{
			topic: "Operations with Integers",
			subTopics: [
				{
					title: "Multiplying integers",
					isFree: false
				},
				{
					title: "Dividing integers",
					isFree: false
				}
			]
		},
		{
			topic: "Rational Numbers",
			subTopics: [
				{
					title: "Rational vs Irrational numbers",
					isFree: false
				},
				{
					title: "Coverting repeating decimals to fractions",
					isFree: false
				},
				{
					title: "Greatest common factors (GCF)",
					isFree: false
				},
				{
					title: "Percents, fractions, and decimals",
					isFree: false
				},
				{
					title: "Absolute value functions",
					isFree: true
				}
			]
		},
		{
			topic: "Operations with Rational Numbers",
			subTopics: [
				{
					title: "Adding and subtracting of rational numbers",
					isFree: true
				}
			]
		},
		{
			topic: "Exponents and Roots",
			subTopics: [
				{
					title: "Using exponents to describe numbers",
					isFree: true
				},
				{
					title: "Quotient law of exponents",
					isFree: false
				},
				{
					title: "Product law of exponents",
					isFree: true
				},
				{
					title: "Power of a quotient law",
					isFree: false
				},
				{
					title: "Power of a power law",
					isFree: true
				},
				{
					title: "Solving for exponents",
					isFree: false
				},
				{
					title: "Squares and square roots",
					isFree: true
				},
				{
					title: "Cubic and cube roots",
					isFree: false
				}
			]
		}
	]
}

var fakeData = {
	topic: "Lorem Ipsum Dolor",
	subTopics: [
		"Lorem ipsum dolor sit amet",
		"Consectetur adipisicing",
		"Sed do eiusmod tempor",
		"Ut enim ad minim",
		"Quis nostrud exercitation",
		"Duis aute irure"
	]
}

function courseList(targetId) {

	var container = document.getElementById(targetId),
		topics = data.topics;

	for (var i = 0; i < topics.length; i++) {

		var node = document.createElement("div"),
			nodeHeading = document.createElement("h5"),
			nodeItems = document.createElement("ul");

		node.classList.add("col-xs-12", "col-sm-6", "col-md-4", "sp-pad-bottom-md");
		//node.classList.add("col-xs-12", "sp-pad-bottom-md");

		nodeHeading.innerText = "Chapter " + (i + 1) + " – " + topics[i].topic;

		for (var j = 0; j < topics[i].subTopics.length; j++) {

			var subNode = document.createElement("li"),
				subTopic = topics[i].subTopics[j];

			if (subTopic.isFree) {
				subNode.classList.add("free");
			}

			subNode.innerHTML = (
				"<a href='#'>" +
					"<div class='sp-course-topic-number'>" + (i + 1) + "." + (j + 1) + "&nbsp;&ndash;&nbsp;</div>" +
					"<div class='sp-course-topic-name'>" + subTopic.title + "</div>" +
				"</a>"
			);

			nodeItems.appendChild(subNode);
		}
		
		node.appendChild(nodeHeading);
		node.appendChild(nodeItems);
		container.appendChild(node);

		// 2 column row check clear
		if ((i + 1) % 2 === 0) {

			var nodeClear = document.createElement("div");
			nodeClear.classList.add("clearfix", "hidden", "visible-sm")

			container.appendChild(nodeClear);
		}

		// 3 column row check clear
		if ((i + 1) % 3 === 0) {

			var nodeClear = document.createElement("div");
			nodeClear.classList.add("clearfix", "hidden", "visible-md", "visible-lg")

			container.appendChild(nodeClear);
		}
	}
}

function addFakeCourses(targetId, topics, offset) {

	var container = document.getElementById(targetId);

	for (var i = 0; i < topics; i++) {

		console.log("Adding fake data: " + i);

		var node = document.createElement("div"),
			nodeHeading = document.createElement("h5"),
			nodeItems = document.createElement("ul");

		node.classList.add("col-xs-12", "col-sm-6", "col-md-4", "sp-pad-bottom-md");
		//node.classList.add("col-xs-12", "sp-pad-bottom-md");

		nodeHeading.innerText = "Chapter " + (i + offset + 1) + " – " + fakeData.topic;

		// random a from 1-6 (for the sub topics)
		var x = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

		for (var j = 0; j < x; j++) {

			var subNode = document.createElement("li");
			subNode.innerHTML = (
				"<a href='#'>" +
					"<div class='sp-course-topic-number'>" + (i + offset + 1) + "." + (j + 1) + "&nbsp;&ndash;&nbsp;</div>" +
					"<div class='sp-course-topic-name'>" + fakeData.subTopics[j] + "</div>" +
				"</a>"
			);

			nodeItems.appendChild(subNode);
		}
		
		node.appendChild(nodeHeading);
		node.appendChild(nodeItems);
		container.appendChild(node);

		// 2 column row check clear
		if ((i + 1) % 2 === 0) {

			var nodeClear = document.createElement("div");
			nodeClear.classList.add("clearfix", "hidden", "visible-sm")

			container.appendChild(nodeClear);
		}

		// 3 column row check clear
		if ((i + 1) % 3 === 0) {

			var nodeClear = document.createElement("div");
			nodeClear.classList.add("clearfix", "hidden", "visible-md", "visible-lg")

			container.appendChild(nodeClear);
		}
	}
}

// Lorem Ipsum