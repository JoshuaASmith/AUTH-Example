const React = require('react')
const { Match, BrowserRouter, HashRouter, Redirect } = require('react-router')
const { Home, About, Favorites, FavoriteForm, Favorite } = require('./pages')

const auth = require('./utils/auth')(
  process.env.REACT_APP_ID,
  process.env.REACT_APP_DOMAIN

)

const App = React.createClass({
  render() {
    return (
      <HashRouter>
        <div>
          <Match exactly pattern="/" render={(matchProps) => <Home {...matchProps} auth={auth} />} />
          <MatchWhenAuthorized exactly pattern="/favorites" component={Favorites} />
          <MatchWhenAuthorized exactly pattern="/favorites/:id" component={Favorite} />
          <MatchWhenAuthorized pattern="/favorites/:id/edit" component={FavoriteForm} />
          <MatchWhenAuthorized pattern="/favorites/new" component={FavoriteForm} />
          <MatchWhenAuthorized pattern="/about" component={About} />
        </div>
      </HashRouter>

    )
  }
})

const MatchWhenAuthorized = ({component: Component, ...rest}) =>
  <Match {...rest} render={props => auth.loggedIn() ?
    <div>
      <div style={{float: 'right'}}><button onClick={e => auth.logout()}>Logout</button></div>
      <Component {...props} />
    </div> : <Redirect to="/" /> } />

module.exports = App
