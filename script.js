//var news = JSON.parse(http://www.freecodecamp.com/news/hot);
//console.log(news);

var req = new XMLHttpRequest();
req.open("GET", "http://www.freecodecamp.com/news/hot", true);
req.addEventListener("load", function() {
	if (req.status !== 200) {
		noJSON();
		return;
	}
	try {
		responseOK(JSON.parse(req.response));
	} catch(e) {
		noJSON();
	}
});
req.addEventListener("error", function() {
	noJSON();
});
function noJSON() {
	console.log("smallest violin");
	var errMsg = document.createElement("h2");
	errMsg.innerHTML = "API unavailable, try later :(";
	document.getElementById('news-field').appendChild(errMsg)
}
document.addEventListener("DOMContentLoaded", function() {
	req.send(null);
});

function responseOK(response) {
	//tileByIndex starts empty, array will grow as new tiles are added
	var tileByIndex = document.getElementsByClassName("story-container");
	
	for (var i = 0; i < response.length; i++) {
		
		//Make a new tile, append to <body>
		var tile = document.createElement("div");
		tile.className = "story-container";
		tile.style.backgroundColor = randomPastel();
		document.getElementById('news-field').appendChild(tile);
		
		//create news link <a> within tile. CSS stretches it to occupy entire tile
		var storyURL = document.createElement("a");
		storyURL.setAttribute('href', response[i].link);
		storyURL.setAttribute('class', 'story-link');
		tile.appendChild(storyURL);
		
		//pull headline, username and upvotes from `response`. Place inside the news link <a>
		var headline = document.createElement("span");
		var username = document.createElement("span");
		var upvotes  = document.createElement("span");
		headline.style.backgroundColor = randomPastel(0.2);
		headline.innerHTML = response[i].headline;
		username.innerHTML = '/' + response[i].author.username;
		upvotes.innerHTML  = response[i].rank;
		headline.setAttribute('class', 'story-headline');
		username.setAttribute('class', 'story-poster');
		upvotes.setAttribute('class', 'story-upvotes');
		storyURL.appendChild(headline);
		storyURL.appendChild(username);
		storyURL.appendChild(upvotes);
		
		//Set tile background to news story image;
		//if story image doesn't load, try user avatar,
		//if all images fail, tile will keep random pastel background
		var imageURL = response[i].image;
		var avatarURL = response[i].author.picture;
		var background = new Image();
		background.onload = storyImageOK(i);
		background.addEventListener("error", function() {
			//Microsoft Edge was breaking unless I made this empty listener :/
			// the error event listener was not working properly
			//
		});
		background.onerror = storyImageNotOK(i);
		background.src = imageURL;
		
		// does not really re-load the image if the browser has proper caching
		function storyImageOK(index) {
			var storyImageURL = response[index].image;
			return function() {
				tileByIndex[index].style.backgroundImage = "url('" + storyImageURL + "')";
			}
		}
		// if image can't load, use contributer avatar instead
		function storyImageNotOK(index) {
			var userAvatar = response[index].author.picture;
			var pastels;
			return function(err) {
				tileByIndex[index].style.backgroundImage = "url('" + userAvatar + "')";
			}
		}
	}
}

function randomPastel(alpha) {
	var red   = 128 + Math.floor(Math.random()*128);
	var green = 128 + Math.floor(Math.random()*128);
	var blue  = 128 + Math.floor(Math.random()*128);
	if(typeof(alpha) === 'number') {
		return 'rgba('+red+', '+green+', '+blue+', '+alpha+')';
	}
	return 'rgb('+red+', '+green+', '+blue+')';
}

