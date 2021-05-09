var redirect_uri = "http://127.0.0.1:5500/index.html"
var client_id = ""
var client_secret = ""
var access_token = localStorage.getItem("access_token")
var refresh_token = localStorage.getItem("refresh_token")

const TOKEN = "https://accounts.spotify.com/api/token"
const DEVICES = "https://api.spotify.com/v1/me/player/devices"
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists"
const SEARCH = "https://api.spotify.com/v1/search"
const SEARCHLIMIT = "&type=track%2Cartist&market=US&limit=1&offset=5"
//"https://api.spotify.com/v1/search?q=Muse&type=track%2Cartist&market=US&limit=10&offset=5"

// html elements
const getDevicesbtn = document.getElementById("getDevicesbtn")
const devices = document.getElementById("devices")
const getPlaylistsbtn = document.getElementById("getPlaylistsbtn")
const playlists = document.getElementById("playlists")
const getTracksbtn = document.getElementById("getTracksbtn")

const onPageLoad = () => {
  client_id = localStorage.getItem("client_id")
  client_secret = localStorage.getItem("client_secret")
  if (window.location.search.length > 0) {
    handleRedirect()
  }
}

function handleRedirect() {
  let code = getCode()
  fetchAccessToken(code)
  window.history.pushState("", "", redirect_uri)
}

function getCode() {
  let code = null

  //getting the code from the url
  const queryString = window.location.search

  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString)
    code = urlParams.get("code")
  }

  return code
}

function fetchAccessToken(code) {
  let body = "grant_type=authorization_code"
  body += "&code=" + code
  body += "&redirect_uri=" + encodeURI(redirect_uri)
  body += "&client_id=" + client_id
  body += "&client_secret=" + client_secret
  callAuthorizationApi(body)
}

function refreshAccessToken() {
  refresh_token = localStorage.getItem("refresh_token")
  let body = "grant_type=refresh_token"
  body += "&refresh_token=" + refresh_token
  body += "&client_id=" + client_id
  callAuthorizationApi(body)
}

function callAuthorizationApi(body) {
  fetch(TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
    },
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.access_token != undefined) {
        access_token = data.access_token
        localStorage.setItem("access_token", access_token)
      }
      if (data.refresh_token != undefined) {
        refresh_token = data.refresh_token
        localStorage.setItem("refresh_token", refresh_token)
      }
      onPageLoad()
    })
    .catch((err) => {
      console.log("error", err)
      alert(err.message)
    })
}

getDevicesbtn.addEventListener("click", () => {
  fetch(DEVICES, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        refreshAccessToken()
      } else {
        return response.json()
      }
    })
    .then((data) => {
      // console.log(data)
      removeAllItems("devices")
      data.devices.map((item) => {
        addDevice(item)
      })
    })
    .catch((err) => console.log(err))
})

getPlaylistsbtn.addEventListener("click", () => {
  fetch(PLAYLISTS, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        refreshAccessToken()
      } else {
        return response.json()
      }
    })
    .then((data) => {
      console.log(data)
      removeAllItems("playlists")
      data.items.map((item) => {
        addPlaylists(item)
        const links = document.getElementById("links")
        links.innerHTML += `<a href='${item.external_urls.spotify}'target='_blank'>
          ${item.name}  </ a>
        <br>`
      })
    })
    .catch((err) => console.log(err))
})

//"https://api.spotify.com/v1/search?q=Muse&type=track%2Cartist&market=US&limit=1&offset=5"
getTracksbtn.addEventListener("click", () => {
  const searchTracksInp = document.getElementById("searchTracksInp").value
  // const id = "3n3Ppam7vgaVa1iaRUc9Lp"
  fetch(`${SEARCH}?q=${searchTracksInp}${SEARCHLIMIT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        refreshAccessToken()
      } else {
        return response.json()
      }
    })
    .then((data) => {
      console.log(data)
      const searchOutput = document.getElementById("searchOutput")
      // const image = data.artists.items.map((item) => {
      //   let count = 0
      //   console.log(item.images[count].url)
      // })
      // console.log(image)

      data.tracks.items.map((item) => {
        let count = 1
        searchOutput.innerHTML += `<a href="${item.album.external_urls.spotify}"><img src="${item.album.images[count].url}"></a>
        `
      })
    })
    .catch((err) => console.log(err))
})

function addDevice(item) {
  let node = document.createElement("option")
  node.value = item.id
  node.innerHTML = item.name
  document.getElementById("devices").appendChild(node)
}

function addPlaylists(item) {
  let node = document.createElement("option")
  node.value = item.id
  node.innerHTML = item.name + " (" + item.tracks.total + ")"
  playlists.appendChild(node)
}

function removeAllItems(elementId) {
  let node = document.getElementById(elementId)
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}
