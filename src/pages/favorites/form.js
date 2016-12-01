const React = require('react')

const {Redirect} = require('react-router')

const {set, lensProp} = require('ramda')

const data = require('../../utils/data')()

const FavoriteForm = React.createClass({
    getInitialState() {
        return {favorite: {}, resolved: false}
    },
    componentDidMount() {
        if (this.props.params.id) {
            data.get('favorites', this.props.params.id).then(favorite => this.setState({favorite}))
        }
    },
    handleChange(field) {
        return (e) => {
            this.setState({
                favorite: set(lensProp(field), e.target.value, this.state.favorite)
            })
        }
    },
    handleSubmit(e) {
        e.preventDefault()
        if (this.state.favorite.id) {
            return data.put('favorites', this.state.favorite.id, this.state.favorite).then(res => {
                if (res.id) {
                    this.setState({resolved: res.id})
                }
            })
        }
        data.post('favorites', this.state.favorite).then(res => {
            if (res.id) {
                this.setState({resolved: res.id})
            }

        })
    },
    render() {
        return (
            <div>
                {this.state.resolved
                    ? <Redirect to="/favorites"/>
                    : null}
                <header>
                    <h1>Resturant</h1>
                </header>
                <main>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <label htmlFor="">Name</label>
                            <input type="text" value={this.state.favorite.name} onChange={this.handleChange('name')}/>
                        </div>
                        <div>
                            <button>Submit</button>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
})

module.exports = FavoriteForm
