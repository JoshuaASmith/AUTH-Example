const React = require('react')
const Auth0Lock = require('auth0-lock').default

const Auth = Component => React.createClass({
    getInitialState() {
        this.lock = new Auth0Lock(process.env.REACT_APP_ID, process.env.REACT_APP_DOMAIN, {
            auth: {
                redirectUrl: 'http://localhost:3000/',
                responseType: 'token'
            }
        })
        // Add callback for lock `authenticated` event
        this.lock.on('authenticated', this._doAuthentication)
        return {loggedIn: this.loggedIn()}

    },
    login() {
        // Call the show method to display the widget.
        this.lock.show()
    },
    _doAuthentication(authResult) {
        // Saves the user token
        this.setToken(authResult.idToken)
        setTimeout(_ => {
            this.setState({loggedIn: true})
        }, 100)

    },
    logout() {
        // Clear user token and profile data from local storage
        localStorage.removeItem('id_token');
        this.login()
    },
    setToken(idToken) {
        // Saves user token to local storage
        localStorage.setItem('id_token', idToken)
    },
    getToken() {
        return localStorage.getItem('id_token')
    },
    loggedIn() {
        return !!this.getToken()
    },
    componentDidMount() {
        if (!this.state.loggedIn && this.props.location.hash.indexOf('access_token') === -1) {
            this.login()
        }
    },
    render() {
        return (
            <div>
                {this.state.loggedIn
                    ? <button onClick={this.logout}>LogOut</button>
                    : null}
                <Component {...this.props} auth={this}/>
            </div>
        )
    }
})

module.exports = Auth
