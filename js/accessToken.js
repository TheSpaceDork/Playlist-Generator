// variable to hold token created after authentication
let token;
// get the hash from the url
const hash = window.location.hash;
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

// function to get the user logged in and check if authorization works
const user = async() => {
  // create a new url using the spotify api with the user endpoint
  const url = new URL("https://api.spotify.com/v1/me");
  // using fetch api, get the details of the user logged in passing the token in the
  // localStorage as the header
  const data = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  // convert the data gotton to json format
  const jsonData = await data.json();
  // use aler to display the logged in user name for verification
  alert(`Welcome ${jsonData.display_name}`);
}

// call the user function
user();