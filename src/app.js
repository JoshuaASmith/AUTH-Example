const React = require('react')
const { Match, BrowserRouter, HashRouter, Redirect } = require('react-router')
const { Home, About, Favorites, FavoriteForm, Favorite } = require('./pages')

const auth = require('./utils/auth')(
  process.env.REACT_APP_ID,
  process.env.REACT_APP_DOMAIN

)

const App = React.createClass({
  logout(e) {
    auth.logout()
  },
  render() {
    return (
      <HashRouter>
        <div>
          <Match exactly pattern="/" render={(matchProps) => <Home {...matchProps} auth={auth} />} />
          <MatchWhenAuthorized exactly pattern="/favorites" component={Favorites} logout={this.logout} />
          <MatchWhenAuthorized exactly pattern="/favorites/:id" component={Favorite}  logout={this.logout} />
          <MatchWhenAuthorized pattern="/favorites/:id/edit" component={FavoriteForm}  logout={this.logout} />
          <MatchWhenAuthorized pattern="/favorites/new" component={FavoriteForm}  logout={this.logout} />
          <MatchWhenAuthorized pattern="/about" component={About}  logout={this.logout} />
        </div>
      </HashRouter>

    )
  }
})

const MatchWhenAuthorized = ({component: Component, ...rest}) =>
  <Match {...rest} render={props => auth.loggedIn() ?
    <div>
      <div style={{float: 'right'}}><button onClick={props.logout}>Logout</button></div>
      <Component {...props} />
    </div> : <Redirect to="/" /> } />

module.exports = App
