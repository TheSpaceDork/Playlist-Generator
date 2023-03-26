const CLIENT_ID = "3dc5285458fa48759206134beca949c1";
// variable to hold token created after authentication
let token;

// get the hash from the url
const hash = window.location.hash;

// data variable to hold data fetched from each api request
let data;


// Function to get access token
const getAccessToken = async() => {
  // if token is present in localStorage, get the token
  token = localStorage.getItem("token");
  // if token is not save in localStorage but a hash is gotten, get the token from the hash
  if (!token && hash) {
    token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
    // reset the hash to an empty string
    window.location.hash = ""
    // save the token in localStorage to use later
    window.localStorage.setItem("token", token)
  }

  console.log(token);
}


// function to get the user logged in and check if authorization works
const getUserProfile = async() => {
  // Call the getAccessToken() function here as we need the token generated to get user's data
  await getAccessToken();

  // get a reference to the user div on the html file
  const user = document.querySelector(".user");

  // create a new url using the spotify api with the user endpoint
  const url = new URL("https://api.spotify.com/v1/me");

  // using fetch api, get the details of the user logged in passing the token in the
  // localStorage as the header
  data = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // checks if access token has expired as access token generated has short expiration time
  if(data.status === 401) {
    // create a search params using new parameters to request for a new access token
    url.search = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token,
      client_id: CLIENT_ID
    })

    // fetch data again
    data = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  }
  // convert the data gotton to json format
  const jsonData = await data.json();
  const currentUser = jsonData.display_name;
  user.textContent = currentUser;
}

// call the getUserProfile function
getUserProfile();



// Get the mood buttons with querySelectorALL
const moodBtns = document.querySelectorAll(".moodBtns button")
// listen to a click event on each mood button and get the mood selected
moodBtns.forEach(btn => btn.addEventListener("click", async () => {
  console.log("is clicked!")
  const mood = btn.innerText;
  console.log(mood);
  const searchEndpoint = new URL("https://api.spotify.com/v1/search");
    
  searchEndpoint.search = new URLSearchParams({
    q: mood,
    type: ["album", "artist", "track"]
  });

  data = await fetch(searchEndpoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  console.log(data);
  // checks if access token has expired as access token generated has short expiration time
  if(data.status === 401) {
    alert("Oops, session expired. Please link your spotify account again ")
  }
  // convert the data gotton to json format
  const jsonData = await data.json();
  console.log(`Getting ${mood} songs`);
  console.log(jsonData);
}))



// Get top tracks of the signed in user;
const getTopTracks = async () => {
  console.log("Getting tracks");
  // create a tracksURL
  const tracksURL = new URL("https://api.spotify.com/v1/me/top/tracks");

  const data = await fetch(tracksURL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const jsonData = await data.json();

  console.log("Top Tracks...");
  console.log(jsonData);
}

// Call the getTopTracks() function
getTopTracks();
