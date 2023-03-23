const authBtn  = document.querySelector(".authenticationBtn");
const CLIENT_ID = "529b988752914d0d9ad32aef32eb468d";
const REDIRECT_URL = "http://localhost:5050/steptwo.html";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const SCOPES = [
  "playlist-modify-public",
  "streaming",
  "user-library-read",
  "playlist-modify-private",
  "user-read-currently-playing",
  "playlist-read-private",
  "user-modify-playback-state",
  "user-read-playback-state",
];
const SCOPES_DEL = "%20";
const SCOPES_URL = SCOPES.join(SCOPES_DEL);

authBtn.addEventListener("click", async function(e) {
  e.preventDefault();
  window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL}&response_type=token&show_dialog=true`;
})
