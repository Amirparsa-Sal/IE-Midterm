function clearStatus(){
    var status_container = document.getElementById("status-container");
    var error_box = document.getElementById("error-box");
    status_container.style.display = "None";
    error_box.style.display = "None";
}

function displayStatus(text, color){
    var status_container = document.getElementById("status-container");
    var error_box = document.getElementById("error-box");
    error_box.innerHTML = text;
    status_container.style.color = color;
    status_container.style.display = "flex";
    error_box.style.display = "inline-block";
}

function httpGetAsync(theUrl, callback)
{
    // clear status
    var status_container = document.getElementById("status-container");
    var error_box = document.getElementById("error-box");
    status_container.style.display = "None";
    error_box.style.display = "None";
    // create request
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("error", (evt) => {
        /* 
          This fires upon a "Network-Level" error, such as when the server is offline, 
          or completely unable to send a response for some reason.
        */
        displayStatus("Network Error!", "red");
    });

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            callback(xmlHttp.responseText);
        }
        else if (xmlHttp.status == 404){
            displayStatus("User not found!", "red");
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

// get search button
var searchButton = document.getElementById("search-button");
console.log(searchButton);
// add event listener
searchButton.addEventListener("click", function() {
    console.log("here");
    // get search input
    var searchInput = document.getElementById("search-box");
    input = searchInput.value;
    // Send GET request to server
    httpGetAsync("https://api.github.com/users/" + input,
        function(response) {
            console.log(response);
            // set the image
            var image = document.getElementById("avatar");
            image.src = JSON.parse(response).avatar_url;
            // set the name
            var nameLabel = document.getElementById("name-label");
            nameLabel.innerHTML = JSON.parse(response).name;
            // set the bio
            var bioLabel = document.getElementById("bio-label");
            bioLabel.innerHTML = JSON.parse(response).bio;
            // set the location
            var locationLabel = document.getElementById("loc-label");
            locationLabel.innerHTML = JSON.parse(response).location;
            // set the blog
            var blogLabel = document.getElementById("blog-label");
            blogLabel.innerHTML = JSON.parse(response).blog;

        }
    );
});