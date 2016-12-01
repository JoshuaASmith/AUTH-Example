const React = require('react')
const {Link} = require('react-router')
const data = require('../../utils/data')()
const { map } = require('ramda')

const transform = map(fav => {
  return <div key={fav.id}><Link to={`/favorites/${fav.id}`}>{fav.name}</Link></div>
})

const Favorites = React.createClass({
  getInitialState() {
    return {
      favorites: []
    }
  },
  componentDidMount () {
    data.list('favorites')
      .then(favorites => this.setState({favorites}))
      .catch(err => console.log(err.message))

  },
  render () {


    return (
      <div>
        <header>
          <h1>Favorites</h1>
          <Link to="/favorites/new">New Favorite</Link>
        </header>
        {transform(this.state.favorites)}
        <Link to="/">Menu</Link>
      </div>
    )
  }
})

module.exports = Favorites
