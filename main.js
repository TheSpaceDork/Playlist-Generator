const changeImage = (imgSrc) => {
  const img = document.getElementById("moodImage");
  img.classList.remove("scale");
  img.src = imgSrc;
  img.classList.add("scale");
};
const redirect_uri = "http://127.0.0.1:5500/steptwo.html";

const client_id = "3dc5285458fa48759206134beca949c1";
const client_secret = "e7460502b84441df83db78e3ae7f05e5";
const AUTHORIZE = "https://accounts.spotify.com/authorize";
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
const space_del = "%20";
const scopesUrl = SCOPES.join(space_del);

const requestAuthorization = () => {
  window.location = `${AUTHORIZE}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopesUrl}&response_type=token&show_dialog=true`;
  //show spotify auth screen
};
const getAccessTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  const params = hash.split("&").reduce(function (acc, curr) {
    const [key, value] = curr.split("=");

    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
  return params.access_token;
};
const accessToken = getAccessTokenFromUrl();
const user = document.getElementById("user");

fetch("https://api.spotify.com/v1/me", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    const currentUser = data.display_name;
    user.textContent = currentUser;
  })
  .catch((error) => console.error(error));
