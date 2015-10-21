import React                  from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';

import Codemirror from 'react-codemirror'

require('css!codemirror/lib/codemirror.css');
//require('codemirror/mode/javascript/javascript.js');

import modes from '../utils/modes'

modes.map((mode) => {
	const name = mode.mode
	if(name !== "null") {
		require('codemirror/mode/'+name+'/'+name+'.js');
	}
})

//var AceEditor = require('react-ace');
//
//var javascript = require('brace/mode/javascript')
//var monokai = require('brace/theme/monokai')

// Normally you'd import your action creators, but I don't want to create
// a file that you're just going to delete anyways!
const actionCreators = {
  increment : () => ({ type : 'COUNTER_INCREMENT' })
};

// We define mapStateToProps and mapDispatchToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.monokai.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  counter : state.counter
});
const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

class Select extends React.Component {
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
			return <option key={count} value={mode.mode}>{mode.name}</option>
		})
		const mode = this.state.mode || this.props.mode
		return <div id="select"><select onChange={this.handleChange.bind(this) } value={mode}>{options}</select></div>
	}
}

export class HomeView extends React.Component {
  static propTypes = {
    actions  : React.PropTypes.object,
    counter  : React.PropTypes.number
  }

  constructor () {
    super();
		this.state = {
			text: '',
			mode: 'javascript'
		}
		if(window.location.hash !== '') {
			this.state.hash = window.location.hash.substr(1, window.location.hash.length)
		}
  }

	onChange(ev) {
		this.setState({text: ev})
		return ev
	}

	onSave() {
		fetch('http://localhost:3001/paste', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({text: this.state.text, mode: this.state.mode}),
		}).then((res) => {
			if(res.status !== 201 && res.status !== 200) {
				alert('Something went wrong with creating your paste')
			}
			return res.json()
		}).then((json) => {
			window.location.hash = json.hash
			this.setState({last_saved_text: this.state.text})
		})
	}

	fetchAndSetText(hash) {
		fetch('http://localhost:3001/paste/' + hash)
			.then((res) => {
				if(res.status === 404) {
					alert("Couldn't find this paste, resetting")
					window.location.hash = ""
				}
				return res.json()
			}).then((res) => {
				this.setState({text: res.text, last_saved_text: res.text, mode: res.mode})
			}).catch((error) => {
				console.log(error)
			})
	}

	componentDidMount() {
		if(this.state.hash) {
			this.fetchAndSetText(this.state.hash)
		}

		window.onhashchange = () => {
			const hash = window.location.hash.substr(1, window.location.hash.length)
			this.fetchAndSetText(hash)
		}
	}

	handleLanguageChange(mode) {
		this.setState({mode: mode})
	}

  render () {
		let button_classname = ""
		let disabled = false
		if(this.state.last_saved_text === this.state.text) {
			button_classname = "disabled"
			disabled = true
		}
		const options = {
			lineNumbers: true,
			theme: 'base16-dark',
			mode: this.state.mode
		}
				//<AceEditor
				//	style={editorStyle}
				//	mode="javascript"
				//	theme="monokai"
				//	name="editor"
				//	height="6em"
				//	onChange={this.onChange.bind(this)}
				//	value={this.state.text}
				//	ref='editor'
				//	editorProps={{}}javascript
				///>
    return (
      <div>
				<Codemirror value={this.state.text} onChange={this.onChange.bind(this)} options={options}/>
				<button id="save-button" disabled={disabled} className={button_classname} onClick={this.onSave.bind(this)}>Save</button> 
				<Select onChange={this.handleLanguageChange.bind(this)} mode={this.state.mode}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
