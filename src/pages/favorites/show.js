const React = require('react')
const {Link, Redirect} = require('react-router')
const data = require('../../utils/data')()
import confirm from 'react-confirm2'

const ShowFavorite = React.createClass({
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
        data.get('favorites', this.props.params.id).then(fav => this.setState({fav}))
    },
    handleRemove(e) {
        e.preventDefault()
        confirm('But...', () => {
            data.remove('favorites', this.props.params.id, this.state.fav).then(res => this.setState({resolved: true}))
        })
    },
    render() {
        return (
            <div>
                {this.state.resolved
                    ? <Redirect to="/favorites"/>
                    : null}
                <h1>Show</h1>
                <h2>{this.state.fav.name}</h2>
                <button>
                    <Link to={`/favorites/${this.state.fav.id}/edit`}>Edit</Link>
                </button>
                <button className="db mv2">
                    <Link to="/" onClick={this.handleRemove}>Remove</Link>
                </button>
                <Link className="no-underline black hover-bg-moon-gray" to="/favorites">Return</Link>

            </div>
        )
    }
})

module.exports = ShowFavorite
