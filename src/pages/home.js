const React = require('react')
const { Link } = require('react-router')

const Home = React.createClass({
  componentDidMount() {
    if (!this.props.auth.loggedIn() && this.props.location.hash.indexOf('access_token') === -1) {
      this.props.auth.login()
    }
  },
  render() {
    return (
      <div>
        <h1>LunchIt</h1>
        <h3>Menu</h3>
        <ul>
          <li>
            <Link to="/favorites">Favorites</Link>
          </li>
          <li>
            <a href="">Circles</a>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
    )
  }
})

module.exports = Home
