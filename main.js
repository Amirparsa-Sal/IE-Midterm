function clearStatus(){
    var status_container = document.getElementById("status-container");
    var error_box = document.getElementById("status-box");
    status_container.style.display = "None";
    error_box.style.display = "None";
}

function displayStatus(text, r, g, b, a){
    var status_container = document.getElementById("status-container");
    var error_box = document.getElementById("status-box");
    error_box.innerHTML = text;
    status_container.style.backgroundColor = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    status_container.style.display = "flex";
    error_box.style.display = "inline-block";
}

function httpGetAsync(theUrl, callback)
{
    // clear status
    var status_container = document.getElementById("status-container");
    var error_box = document.getElementById("status-box");
    status_container.style.display = "None";
    error_box.style.display = "None";
    // create request
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("error", (evt) => {
        /* 
          This fires upon a "Network-Level" error, such as when the server is offline, 
          or completely unable to send a response for some reason.
        */
        displayStatus("Network Error!", 129, 7, 7, 0.77);
    });

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            callback(xmlHttp.responseText);
        }
        else if (xmlHttp.status == 404){
            displayStatus("User not found!", 129, 7, 7, 0.77);
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
    // get search input
    var searchInput = document.getElementById("search-box");
    input = searchInput.value;
    // Send GET request to get info
    httpGetAsync("https://api.github.com/users/" + input,
        function(response) {
            res = JSON.parse(response);
            // get divs
            var blogDiv = document.getElementById("blog-row");
            var locDiv = document.getElementById("loc-row");
            var bioDiv = document.getElementById("bio-box");
            // get labels
            var nameLabel = document.getElementById("name-label");
            var bioLabel = document.getElementById("bio-label");
            var locLabel = document.getElementById("loc-label");
            var blogLabel = document.getElementById("blog-label");
            // set the image
            var image = document.getElementById("avatar");
            image.src = res.avatar_url;
            // set the name
            if (res.name == null || res.name == ""){
                nameLabel.style.display = "None";
            }
            else{
                var nameLabel = document.getElementById("name-label");
                nameLabel.innerHTML = res.name;
                nameLabel.style.display = "inline-block";
            }
            // set the bio
            if (res.bio == null || res.bio == ""){
                bioDiv.style.display = "None";
            }
            else{
                bioLabel.innerHTML = res.bio;
                bioDiv.style.display = "flex";
            }
            // set the location
            if (res.location == null || res.location == ""){
                locDiv.style.display = "None";
            }
            else{
                locLabel.innerHTML = res.location;
                locDiv.style.display = "flex";
            }
            // set the blog
            if (res.blog == null || res.blog == ""){
                blogDiv.style.display = "None";
            }
            else{
                blogLabel.innerHTML = res.blog;
                blogDiv.style.display = "flex";
            }
        }
    );
    // Send GET request to get repos
    httpGetAsync("https://api.github.com/users/" + input + "/repos",
        function(response) {
            // sort the response by push date
            var repos = JSON.parse(response);
            repos.sort(function(a, b) {
                return new Date(b.pushed_at) - new Date(a.pushed_at);
            });
            // count langs in top 5 repos
            langs = {};
            for (var i = 0; i < Math.min(5, repos.length); i++){
                var repo = repos[i];
                if (repo.language == null){
                    continue;
                }
                if (repo.language in langs){
                    langs[repo.language] += 1;
                }
                else{
                    langs[repo.language] = 1;
                }
            }
            // get the most common lang
            var mostCommonLang = "";
            var mostCommonLangCount = 0;
            for (var lang in langs){
                if (langs[lang] > mostCommonLangCount){
                    mostCommonLang = lang;
                    mostCommonLangCount = langs[lang];
                }
            }
            // set the most common lang
            var langLabel = document.getElementById("lang-label");
            langLabel.innerHTML = mostCommonLang;
        }
    );
});