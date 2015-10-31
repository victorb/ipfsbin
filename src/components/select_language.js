var React = require('react')
var modes_service = require('../modes')
var modes = new modes_service()

class SelectLanguage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			mode: null
		}
	}
	handleChange(ev) {
		this.props.onChange(ev.target.value)
		this.setState({mode: ev.target.value})
	}
	render() {
		let count = 0;
		const options = modes.map((mode) => {
			count++
			return <option key={count} value={mode.name}>{mode.name}</option>
		})
		let mode = this.state.mode || this.props.mode
    if(!mode) {
      mode = 'Plain Text'
    }
		return <div id="select">
			<select onChange={this.handleChange.bind(this) } value={mode}>
        {options}
			</select>
		</div>
	}
}

export default SelectLanguage
