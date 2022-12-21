function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

// get search button
var searchButton = document.getElementById("search_button");
console.log(searchButton);
// add event listener
searchButton.addEventListener("click", function() {
    console.log("here");
    // get search input
    var searchInput = document.getElementById("search_box");
    input = searchInput.value;
    // Send GET request to server
    httpGetAsync("https://api.github.com/users/" + input,
        function(response) {
            console.log(response);
            // set the name
            var nameLabel = document.getElementById("name_label");
            nameLabel.innerHTML = JSON.parse(response).name;
            // set the bio
            var bioLabel = document.getElementById("bio_label");
            bioLabel.innerHTML = JSON.parse(response).bio;
            // set the location
            var locationLabel = document.getElementById("loc_label");
            locationLabel.innerHTML = JSON.parse(response).location;
            // set the image
            var image = document.getElementById("avatar");
            image.src = JSON.parse(response).avatar_url;
            // set the blog
            var blogLabel = document.getElementById("blog_label");
            blogLabel.innerHTML = JSON.parse(response).blog;

        }
    );
});