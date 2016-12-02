# Auth0 Walkthrough

## How to integrate Auth0 with React

### Resources:

- auth0.com/docs/overview
- auth0.com/blog
- auth0.com/docs/quickstart/spa/react

### Overview:
- How to AUTH your website:

- Create/Login to Auth 0 account:

- Set up New client

- give it a name, choose a type (Single Page for React/etc.)

- npm install auth0-lock --save on your directory to have the dependency.

- within src/utils create an AuthService file that initiates and requires the auth0-lock file

- add functions like doAuthentication, login, loggedIn, setToken, getToken, logout,
add consts like lock and notify function

- require in that auth-service file in your main app.js file and create auth functions to login and logout

- you can also create a helper function to MatchWhenAuthorized to help add authorization to each auth link.

- On your home page you've gotta add some stuff.

--

###### On Auth0.com

* Setup auth0 account
* Create a client application
* Single page application
* Setup your connections
* Add localhost:3000 as a Callback URL
* Add localhost:3000 as a CORS Origin

--

## STEP BY STEP

##### Step 1:
Setting up the api to be secure:

```
npm install express-jwt dotenv --save
```

Grab the id and secret from auth0's dashboard for our client access application

Create a .env file
Put in auth0_secret AUTH0_ID=id

Build our middleware

>Disclaimer: this middleware is built to work with express api apps

Create a jwt-validate.js file
```
require('dotenv').config()

const jwt = require('express-jwt')
module.exports = jwt({
    secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
    audience: process.env.AUTH0_ID
})
```
Example api test server
```
npm install json-server -S
json -I -f package.json -e 'this.scripts.start = "json-server db.json --watch --port 4000 -m ./jwt-validate"'
```

Create db.json in api folder
```
{
  persons: [],
  places: [],
  etc: []
}
```

##### Step 2

Setting the web app:

Install auth0-lock, moment, jwt-decode
```
npm install auth0-lock moment jwt-decode --save
```

Create auth.js file in src/utils/

```
const Auth0Lock = require('auth0-lock').default
const jwtDecode = require('jwt-decode')
const moment = require('moment')

module.exports = function(clientId, domain) {
    const lock = new Auth0Lock(clientId, domain, {})

    function login() {
        lock.show()
    }
    let notifyFunction = null
    function _doAuthentication(authResult) {
        setToken(authResult.idToken)
        lock.getUserInfo(authResult.accessToken, function(error, profile) {
            if (error)
                return console.log(error.message)
            localStorage.setItem('profile', JSON.stringify(profile))
            if (notifyFunction) {
                notifyFunction(profile)
            }
            console.log(JSON.stringify(profile, null, 2))
        })
    }
    function logout() {
        localStorage.removeItem('id_token')
        localStorage.removeItem('profile')
    }
    function loggedIn() {
        return getToken()
            ? true
            : false
    }
    function setToken(idToken) {
        localStorage.setItem('id_token', idToken)
    }
    function getToken() {
        return localStorage.getItem('id_token')
    }
    function notify(fn) {
        notifyFunction = fn
    }

    lock.on('authenticated', _doAuthentication)
    if (getToken()) {
        const info = jwtDecode(getToken())
        console.log('current ', moment().toString())
        console.log('expires ', moment.unix(info.exp).toString())
        if (moment().isAfter(moment.unix(info.exp))) {
            logout()
        }

    }
    return {
        login,
        logout,
        loggedIn,
        setToken,
        getToken,
        notify
    }
}

```

Create a .env file in web and add our clientId and domain
example:
```
REACT_APP_API=http://localhost:4000
REACT_APP_ID=XFLuovUM5S8l6rIXz9rrsjHI1tYeBwiM
REACT_APP_DOMAIN=joshuaasmith.auth0.com
```

In src/app.js we want to include the src/utils/auth.js file, and specifically require the ID and domain again.
```
const auth = require('./utils/auth')(process.env.REACT_APP_ID, process.env.REACT_APP_DOMAIN)
```

Using React Router version 4.0.0-alpha6, we want to create an authorization check function within the app.js to apply to all Match routes.
```
const MatchWhenAuthorized = ({
    component: Component,
    logout: logout,
    ...rest
}) => <Match {...rest} render={props => auth.loggedIn()
    ? <div>
            <div style={{
                float: 'right'
            }}>
                <button onClick={logout}>Logout</button>
            </div>
            <Component {...props} logout={logout}/>
        </div>
    : <Redirect to="/"/>}/>
```

Set a logout flag on getInitialState() of app.js file
```
getInitialState() {
    return {logout: false}
},
```

Create a logout method on our app component:
```
logout(e) {
    auth.logout()
    this.setState({logout: true})
},
```

>NOTE: In React Router, use the HashRouter instead of the BrowserRouter to allow for Auth0 to have a consistent callback URL.
This is currently a bug with either side that may be fixed in the future.  

##### Step 3:

On your login component page add the auth.login method on the Home component on componentDidMount():
```
componentDidMount() {
    this.props.auth.notify(profile => {
        this.setState({picture: profile.picture, nickname: profile.nickname})
    })
    if (!this.props.auth.loggedIn() && this.props.location.hash.indexOf('access_token') === -1) {
        this.props.auth.login()
    }
    if (localStorage.getItem('profile')) {
        const profile = JSON.parse(localStorage.getItem('profile'))
        this.setState({picture: profile.picture, nickname: profile.nickname})
    }
},
```
You can use this to get a picture or profile name from the persons account to render to the page.

Add a logout function and state to the home page:
```
getInitialState() {
    return {logout: false, picture: 'http://placekitten.com/60', nickname: ''}
},
```

##### Step 4:

In order to make secure API calls we need to pass our JWT token in the authorization header as a Bearer token in each different type of request we make.  
Go to data and handle API calls.

```
const setHeader = (header) => {
    header.Authorization = `Bearer ${localStorage.getItem('id_token')}`
    return header
}
```
Examples:
```
const get = (model, id) => fetch(`${url}/${model}/${id}`, {headers: setHeader({})}).then(toJSON)
const post = (model, doc) => fetch(`${url}/${model}`, {
    method: "post",
    body: JSON.stringify(doc),
    headers: setHeader({'Content-Type': 'application/json'})
}).then(toJSON)
```

###### Summary:

Notes:
* Notify React when auth status changes - like logout
* Performing jwt expiring check when the app is initialized to confirm that the token is not expired.

## GOOD LUCK
