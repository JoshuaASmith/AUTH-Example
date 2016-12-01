const React = require('react')
const {Match, HashRouter, Redirect} = require('react-router')
const {Home, About, Favorites, FavoriteForm} = require('./pages')
const ShowFavorite = require('./pages/favorites/show')
const auth = require('./utils/auth')(process.env.REACT_APP_ID, process.env.REACT_APP_DOMAIN)

const App = React.createClass({
    // getInitialState() {
    //     return {logout: false}
    // },
    logout(e) {
        auth.logout()
        this.setState({loggedout: true})
    },
    render() {
        return (
            <HashRouter>
                {/* {this.state.logout
                    ? <Redirect to="/"/>
                    : null} */}
                <div>
                    <Match exactly pattern="/" render={(props) => <Home {...props} auth={auth}/>}/>
                    <MatchWhenAuthorized exactly pattern="/favorites" component={Favorites} logout={this.logout}/>
                    <MatchWhenAuthorized pattern="/favorites/new" component={FavoriteForm} logout={this.logout}/>
                    <MatchWhenAuthorized pattern="/favorites/:id/edit" component={FavoriteForm} logout={this.logout}/>
                    <MatchWhenAuthorized pattern="/favorites/:id/show" component={ShowFavorite} logout={this.logout}/>
                    <MatchWhenAuthorized pattern="/about" component={About} logout={this.logout}/>
                </div>
            </HashRouter>

        )
    }
})

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

module.exports = App
