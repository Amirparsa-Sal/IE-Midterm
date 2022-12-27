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

function fillInfo(data)
{
    // get divs
    var blogDiv = document.getElementById("blog-row");
    var locDiv = document.getElementById("loc-row");
    var bioDiv = document.getElementById("bio-box");
    var langDiv = document.getElementById("lang-row");
    // get labels
    var nameLabel = document.getElementById("name-label");
    var bioLabel = document.getElementById("bio-label");
    var locLabel = document.getElementById("loc-label");
    var blogLabel = document.getElementById("blog-label");
    var langLabel = document.getElementById("lang-label");
    // set the image
    var image = document.getElementById("avatar");
    image.src = data.avatar_url;
    // set the name
    if (data.name == null || data.name == ""){
        nameLabel.style.display = "None";
    }
    else{
        var nameLabel = document.getElementById("name-label");
        nameLabel.innerHTML = data.name;
        nameLabel.style.display = "inline-block";
    }
    // set the bio
    if (data.bio == null || data.bio == ""){
        bioDiv.style.display = "None";
    }
    else{
        bioLabel.innerHTML = data.bio;
        bioDiv.style.display = "flex";
    }
    // set the location
    if (data.location == null || data.location == ""){
        locDiv.style.display = "None";
    }
    else{
        locLabel.innerHTML = data.location;
        locDiv.style.display = "flex";
    }
    // set the blog
    if (data.blog == null || data.blog == ""){
        blogDiv.style.display = "None";
    }
    else{
        blogLabel.innerHTML = data.blog;
        blogDiv.style.display = "flex";
    }
    // set the lang
    if ("lang" in data){
        langLabel.innerHTML = data.lang;
        langDiv.style.display = "flex";
    }
    else{
        langDiv.style.display = "None";
    }
}   

// get search button
var searchButton = document.getElementById("search-button");
console.log(searchButton);
// add event listener
searchButton.addEventListener("click", function() {
    // clear status
    clearStatus();
    // get search input
    var searchInput = document.getElementById("search-box");
    input = searchInput.value;
    // check if the data is in local storage
    if (localStorage.getItem(input) != null){
        var data = JSON.parse(window.localStorage.getItem(input));
        console.log(data)
        fillInfo(data);
        displayStatus("Loaded from local storage!", 255, 215, 7, 0.77);
        return;
    }

    // create data dict to store info
    var data = {};
    // Send GET request to get info
    fetch("https://api.github.com/users/" + input)
    // convert to json
    .then((response) => response.json())
    // fill info and update data dict to store info later in local storage
    .then((res) => {
        fillInfo(res);
        // update data dict
        data["name"] = res.name;
        data["bio"] = res.bio;
        data["location"] = res.location;
        data["blog"] = res.blog;
        data["avatar_url"] = res.avatar_url;
        console.log(data)
        // Send GET request to get repos
        return fetch("https://api.github.com/users/" + input + "/repos");
    })
    // convert to json
    .then((response) => response.json())
    // get the most common lang
    .then((repos) => {
        // sort the repos by push date
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
            if (langs[lang] > mostCommonLangCount && lang != "null"){
                mostCommonLang = lang;
                mostCommonLangCount = langs[lang];
            }
        }
        // set the most common lang
        var langDiv = document.getElementById("lang-row");
        if (mostCommonLangCount == 0){
            langDiv.style.display = "None";
        }
        else{
            var langLabel = document.getElementById("lang-label");
            langLabel.innerHTML = mostCommonLang;
            langDiv.style.display = "flex";
            data["lang"] = mostCommonLang;
        }  
        return data;
    })
    .then((data) => window.localStorage.setItem(input, JSON.stringify(data)))
    .catch((error) => console.log(error));
});