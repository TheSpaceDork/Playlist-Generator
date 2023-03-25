const CLIENT_ID = "3dc5285458fa48759206134beca949c1";
// variable to hold token created after authentication
let token;
// get the hash from the url
const hash = window.location.hash;
// if token is present in localStorage, get the token
token = localStorage.getItem("token");
// if token is not save in localStorage but a hash is gotten, get the token from the hash
if (token && hash) {
  token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
  // reset the hash to an empty string
  window.location.hash = ""
  // save the token in localStorage to use later
  window.localStorage.setItem("token", token)
}

console.log(token);
// function to get the user logged in and check if authorization works
const userData = async() => {
  // get a reference to the user div on the html file
  const user = document.querySelector(".user");
  let data;
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

// call the user function
userData();

// Get the mood buttons with querySelectorALL
const moodBtn = document.querySelectorAll("#mood-btn")

// Listen for click on each item of the moodBtn array of items(buttons)
function getTopSongs() {
  moodBtn.forEach(item => item.addEventListener("click", () =>{
         console.log("is clicked!")

            const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`

       const getTopTracks = async () => {
       await access_token

  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}
  })) 
  

}
