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
