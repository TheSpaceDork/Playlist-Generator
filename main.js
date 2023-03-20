const changeImage = (imgSrc) => {
  const img = document.getElementById("moodImage");
  img.classList.remove("scale");
  img.src = imgSrc;
  img.classList.add("scale");
};
const redirect_uri = "http://127.0.0.1:5500/stepone.html";

const client_id = "df032b522964736bfa5635b5f3e48e4";
const client_secret = "e7460502b84441df83db78e3ae7f05e5";
const AUTHORIZE = "https://accounts.spotify.com/authorize";

const onPageLoad = () => {};

const requestAuthorization = () => {
  let url = AUTHORIZE;
  url += "?client_id" + client_id;
  url += "&response_type=code";
  url += "&redirect_uri" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url +=
    "&scope=user-read-private user-read-email user-modify-playback-state user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  window.location.href = url; //show spotify auth screen
};
