const React =  require('react')
const data = require('../../utils/data')()
const { Link, Redirect } = require('react-router')

import confirm from 'react-confirm2'

const obj = new Object()

// const confirm = require('react-confirm2')
const Favorite = React.createClass({
  getInitialState() {
    return {
      fav: {
        id: -1,
        name: ''
      },
      resolved: false
    }
  },
  componentDidMount() {
    data.get('favorites', this.props.params.id)
      .then(fav => this.setState({fav}) )
  },
  handleRemove(e) {
    e.preventDefault()
    confirm('Are you sure you want to remove this favorite location?', () => {
      data.remove('favorites', this.props.params.id, this.state.fav)
        .then(res => {
          this.setState({resolved: true})
        })

    })
  },
  render() {
    return (
      <div>
        {this.state.resolved ? <Redirect to="/favorites" /> : null }
        <h1>Show</h1>
        {this.state.fav.name}
        <nav>
          <Link to={`/favorites/${this.state.fav.id}/edit`}>Edit</Link>
          |
          <a href="#" onClick={this.handleRemove}>Remove</a>
          |
          <Link to="/favorites">Index</Link>
        </nav>
      </div>
    )
  }
})

module.exports = Favorite
