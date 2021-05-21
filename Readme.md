# Spotify Api

1. Spotify api needs authorization
2. Inorder to fetch data from spotify we need to authorize our application
3. Register the application in spotify developers login (https://developer.spotify.com/dashboard)
   Add a Redirect URL

# Building the redirect URL

1. https://accounts.spotify.com/authorize
2. client_id = spotify provides
3. response_type = code
4. redirect_uri = http://127.0.0.1:5500/index.html
5. state = show_dialog=true
6. scope = The permissions you need in your app

# Getting Access and Request Token

When Spotify redirects after we agree with the terms and conditions the URL will have code parameter in it

We need to fetch it from the URL and use it in the fetch request

# Access Token

```javascript
function fetchAccessToken(code) {
  let body = "grant_type=authorization_code"
  body += "&code=" + code
  body += "&redirect_uri=" + encodeURI(redirect_uri)
  body += "&client_id=" + client_id
  body += "&client_secret=" + client_secret
  callAuthorizationApi(body)
}
```

# Request Token

```javascript
function refreshAccessToken() {
  refresh_token = localStorage.getItem("refresh_token")
  let body = "grant_type=refresh_token"
  body += "&refresh_token=" + refresh_token
  body += "&client_id=" + client_id
  callAuthorizationApi(body)
}
```

# Making Api calls

```javascript
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
```

Reference - https://developer.spotify.com/documentation/general/guides/authorization-guide/
