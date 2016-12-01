const Auth0Lock = require('auth0-lock').default

module.exports = function (clientId, domain) {
  const lock = new Auth0Lock(clientId, domain, {
    responseType: 'token',
    redirectUrl: 'http://localhost:3000/'
  })

  lock.on('authenticated', _doAuthentication)

  function login () {
    setTimeout(() => lock.show(), 500)

  }

  function _doAuthentication (authResult) {
    setToken(authResult.idToken)
  }

  function logout () {
    localStorage.removeItem('id_token')
  }

  function setToken (idToken) {
    localStorage.setItem('id_token', idToken)
  }

  function getToken () {
    return localStorage.getItem('id_token')
  }

  function loggedIn () {
    return getToken() ? true : false
  }

  return {
    login,
    logout,
    loggedIn,
    setToken,
    getToken
  }
}
