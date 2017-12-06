$(document).ready(function(){

	//Intializing my variables...
	var topics = ["breakfast", "waffles", "pancakes", "bacon", "bread", "lunch", "pizza", "chicken wings", "french fries",
	"burgers", "tacos", "burritos", "sandwich", "nachos", "barbecue", "dinner", "ramen", "lobster", "sushi", "steak", "mashed potatoes",
	"pasta", "ice cream", "brownies", "cookies", "pastry", "donuts", "cupcakes", "pie", "cake"];
	var gifStillURL = [];
	var gifMovingURL = [];
	var ratings = [];
	var numberOfGif = 10;
	var duplicate = false;

	//function to make the buttons
	function makeButtons() {
		$("#buttonarea").empty();
		for (var i = 0; i < topics.length; i++)
		{
			var button = $("<button>");
			button.addClass("topic");
			button.attr("data-name", topics[i]);
			button.text(topics[i]);
			$("#buttonarea").append(button);
		}
	}

	//function to display the Gifs, used when the buttons are clicked.
	function displayGif() {
		$("#gifs").empty();
		$("#subheading").empty();
		gifStillURL = [];
		gifMovingURL = [];

		var currTopic = $(this).attr("data-name");
		var fixedTopic = currTopic.split(" ").join("+");
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + fixedTopic +"&api_key=dc6zaTOxFJmzC&limit=" +numberOfGif;

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			for (var i = 0; i < numberOfGif; i++)
			{
				var toPushRating = response.data[i].rating;
				var toPushStill = response.data[i].images.fixed_height_small_still.url;
				var toPushMoving = response.data[i].images.fixed_height_small.url;
				toPushRating = toPushRating.toUpperCase();
				ratings.push(toPushRating);
				gifStillURL.push(toPushStill);
				gifMovingURL.push(toPushMoving);



				var gifDiv = $("<div id ='gif" + (i+1) +  "''>");
				gifDiv.addClass("gifdisplayed");
				gifDiv.attr("data-index", i);
				gifDiv.attr("data-moving", "no");
				$(gifDiv).html("<img src='"+gifStillURL[i]+"'><br>Rating: " + ratings[i]);
				$("#gifs").append(gifDiv);

			}
			$("#bottomtext").text("Just look at them! (Click on them!)");
		});
	}

	//function to update the gif if clicked. If the Gif is moving, then stop it. If the gif is still, then move it.
	function updateGif() {
		var currentIndex = $(this).attr("data-index");
		var currentMoving = $(this).attr("data-moving");

		if (currentMoving === "no")
		{
			$(this).find('img').attr('src', gifMovingURL[currentIndex]);
			$(this).attr("data-moving", "yes");
		}
		else if (currentMoving === "yes")
		{
			$(this).html("<img src ='" + gifStillURL[currentIndex] + "'><br>Rating: " + ratings[currentIndex]);
			$(this).attr("data-moving", "no");
		}

	}

	//This function takes in the input from the user to create a new button
	$("input[type='submit']").on("click", function(event) {
		event.preventDefault();

		var addedTopic = $("input[type='text']").val();
		$("input[type='text']").val("");
		addedTopic = addedTopic.toLowerCase();

		for (var i =0; i < topics.length; i++)
		{
			if (topics[i] === addedTopic)
			{
				duplicate = true;
			}
		}
		if (duplicate)
		{
			$("#gifs").empty();
			$("#bottomtext").text("This button already exists!")
			duplicate = false;
		}
		else
		{
			$("#bottomtext").text("New food topic has been added!!!!!!!")
			topics.push(addedTopic);
			makeButtons();
		}
	})

	//running the functions
	makeButtons();
	$(document).on("click", ".topic", displayGif);
	$(document).on("click", ".gifdisplayed", updateGif);
});