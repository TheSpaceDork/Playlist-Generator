const authBtn = document.querySelector(".authenticationBtn");
const CLIENT_ID = "3dc5285458fa48759206134beca949c1";
const REDIRECT_URI = "https://playlist-generator-sp.netlify.app/steptwo.html";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
const SCOPES = [
  "playlist-modify-public",
  "streaming",
  "user-library-read",
  "playlist-modify-private",
  "user-read-currently-playing",
  "playlist-read-private",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-top-read",
];
const SCOPES_DEL = "%20";
const SCOPES_URL = SCOPES.join(SCOPES_DEL);

const user = document.querySelector(".user");
async function authorize() {
  try {
    // Construct the authorization URL
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL}&response_type=${RESPONSE_TYPE}`;

    // Open the authorization URL in a new window
    const authWindow = window.open(authUrl);

    // Wait for the user to authorize the application
    const authResult = await new Promise((resolve, reject) => {
      const checkAuth = setInterval(() => {
        try {
          // Check if the user has authorized the application
          if (authWindow.location.href.indexOf(REDIRECT_URI) === 0) {
            // Extract the authorization code from the URL
            const code = authWindow.location.search.match(/code=([^&]*)/)[1];

            // Close the authorization window

            // Resolve with the authorization code
            resolve(code);
          }
        } catch (err) {
          // Reject with any errors
          reject(err);
        }
      }, 1000);
    });

    // Exchange the authorization code for an access token
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const clientSecret = "e7460502b84441df83db78e3ae7f05e5"; // Keep this value secret
    const params = {
      grant_type: "authorization_code",
      code: authResult,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: clientSecret,
    };

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    localStorage.setItem("token", accessToken);
    // Use the access token to make requests to the Spotify Web API
    const userDataUrl = "https://api.spotify.com/v1/me";
    const userDataResponse = await fetch(userDataUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userDataResponse.json();

    // Log the user's email address
    console.log(userData);
    localStorage.setItem("display_name", userData.display_name);
  } catch (err) {
    console.error(err);
  }
}

authBtn.addEventListener("click", authorize);
