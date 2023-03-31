const CLIENT_ID = "3dc5285458fa48759206134beca949c1";
// variable to hold token created after authentication
let token;

// get the hash from the url
const hash = window.location.hash;

// data variable to hold data fetched from each api request
let data;

// Function to get access token
const getAccessToken = async () => {
  // if token is present in localStorage, get the token
  token = sessionStorage.getItem("token");

  setTimeout(() => {
    sessionStorage.removeItem("token");
  }, 300000);
  // if token is not save in localStorage but a hash is gotten, get the token from the hash
  if (!token && hash) {
    token = hash
      .substring(1)
      .split("&")
      .find((elem) => elem.startsWith("access_token"))
      .split("=")[1];
    // reset the hash to an empty string
    window.location.hash = "";
    // save the token in localStorage to use later
    sessionStorage.setItem("token", token);
  }
};

// function to get the user logged in and check if authorization works
const getUserProfile = async () => {
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
      Authorization: `Bearer ${token}`,
    },
  });

  // checks if access token has expired as access token generated has short expiration time
  if (data.status === 401) {
    // create a search params using new parameters to request for a new access token
    url.search = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token,
      client_id: CLIENT_ID,
    });

    // fetch data again
    data = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }
  // convert the data gotton to json format
  const jsonData = await data.json();
  const currentUser = jsonData.display_name;
  user.textContent = currentUser;
};

// call the getUserProfile function
getUserProfile();

// Get the mood buttons with querySelectorALL
const moodBtns = document.querySelectorAll(".moodBtns button");
// listen to a click event on each mood button and get the mood selected
moodBtns.forEach((btn) =>
  btn.addEventListener("click", async () => {
    console.log("is clicked!");
    const mood = btn.innerText;
    console.log(mood);
    const searchEndpoint = new URL("https://api.spotify.com/v1/search");

    searchEndpoint.search = new URLSearchParams({
      q: mood,
      type: ["track"],
    });

    data = await fetch(searchEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    // checks if access token has expired as access token generated has short expiration time
    if (data.status === 401) {
      alert("Oops, session expired. Please link your spotify account again ");
    }
    // convert the data gotton to json format
    const jsonData = await data.json();
    console.log(`Getting ${mood} songs`);
    console.log(jsonData);
    const tracks = jsonData.tracks.items;
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
    // create a new playlist

    const playlistName = `My ${mood} Playlist`;
    const userId = await getUserId(token);
    const playlistId = await createPlaylist(token, userId, playlistName);
    // Add the shuffled tracks to the new playlist
    const trackUris = tracks.map((track) => track.uri);
    await addTracksToPlaylist(token, playlistId, trackUris);
    const playlistUrl = `https://open.spotify.com/playlist/${playlistId}`;
    localStorage.setItem("spotifyUrl", playlistUrl);
    localStorage.setItem("playlistId", playlistId);
    localStorage.setItem("playlistName", playlistName);

    const newPage = "https://playlist-generator-sp.netlify.app/stepthree.html";
    window.location.href = newPage;
    console.log(`Added ${tracks.length} tracks to playlist "${playlistName}"!`);
  })
);

// Get top tracks of the signed in user;
const getTopTracks = async () => {
  console.log("Getting tracks");
  // create a tracksURL
  const tracksURL = new URL("https://api.spotify.com/v1/me/top/tracks");

  const data = await fetch(tracksURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const jsonData = await data.json();

  console.log("Top Tracks...");
  console.log(jsonData);
};

// Call the getTopTracks() function
getTopTracks();

// Helper function to get the user ID
async function getUserId(token) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.id;
}

// Helper function to create a new playlist
async function createPlaylist(token, userId, playlistName) {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
      }),
    }
  );
  const data = await response.json();
  return data.id;
}

// Helper function to add tracks to a playlist
async function addTracksToPlaylist(token, playlistId, trackUris) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    }
  );
  const data = await response.json();
  console.log("the data for tracks", data);
  return data;
}

const openSpotify = () => {
  let playlistUrl = localStorage.getItem("spotifyUrl");
  window.location.href = playlistUrl;
};
const displayTracks = () => {
  const playlistContainer = document.getElementById("playlist-container");

  // Create a new HTML element to display the playlist information
  const playlistElement = document.createElement("div");
  let playlistId = localStorage.getItem("playlistId");
  let playlistName = localStorage.getItem("playlistName");
  // Set the innerHTML of the new element to the playlist information
  playlistElement.innerHTML = `
       <h2> ${playlistName}</h2>
      <p>Number of tracks: 20</p>
      <iframe class="w-full mt-4" src="https://open.spotify.com/embed/playlist/${playlistId}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    `;

  // Add the new element to the container
  playlistContainer.appendChild(playlistElement);
};
window.onload = displayTracks;
