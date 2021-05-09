/*

1. https://accounts.spotify.com/authorize
2. client_id = spotify provides
3. response_type = code
4. redirect_uri = http://127.0.0.1:5500/index.html
4. state = show_dialog=true
5. scope = scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private

*/

//redirect url
var redirect_uri = "http://127.0.0.1:5500/index.html"
var client_id = ""
var client_secret = ""

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token"
const authbtn = document.getElementById("authbtn")

const requestAuthorization = () => {
  client_id = document.getElementById("clientId").value
  console.log(client_id)
  client_secret = document.getElementById("clientsecret").value

  // setting client_id and secret to local storage for further usage
  localStorage.setItem("client_id", client_id)
  localStorage.setItem("client_secret", client_secret)

  // building the redirect url to spotify authentication
  let url = AUTHORIZE
  url += "?client_id=" + client_id
  url += "&response_type=code"
  url += "&redirect_uri=" + encodeURI(redirect_uri)
  url += "&show_dialog=true"
  url +=
    "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private"

  //redirecting to show spotify authorization screen
  window.location.href = url
}

authbtn.addEventListener("click", requestAuthorization)
