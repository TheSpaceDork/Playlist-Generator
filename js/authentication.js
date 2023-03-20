const authBtn  = document.querySelector(".authenticationBtn");
const CLIENT_ID = "89e5a59d75d74c3a98a357a8fcc664cb";
const REDIRECT_URL = "http://127.0.0.1:5500/steptwo.html";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

authBtn.addEventListener("click", async function(e) {
  e.preventDefault();
  window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=${RESPONSE_TYPE}`
})
