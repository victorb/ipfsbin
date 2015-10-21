import React                  from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';

var AceEditor = require('react-ace');

var javascript = require('brace/mode/javascript')
var monokai = require('brace/theme/monokai')

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
export class HomeView extends React.Component {
  static propTypes = {
    actions  : React.PropTypes.object,
    counter  : React.PropTypes.number
  }

  constructor () {
    super();
		this.state = {
			text: null
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
		fetch('/paste', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({text: this.state.text}),
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

	componentDidMount() {
		if(this.state.hash) {
			console.log('hash')
			fetch('/paste/' + this.state.hash)
				.then((res) => {
					if(res.status === 404) {
						alert("Couldn't find this paste, resetting")
						window.location.hash = ""
					}
					return res.json()
				}).then((res) => {
					this.setState({text: res.text, last_saved_text: res.text})
				}).catch((error) => {
					console.log(error)
				})
		}
		this.refs.editor.commands.bindKeys({"ctrl-l":null, "left":null})  // or
		this.refs.editor.commands.bindKey("tab", null) // or
		this.refs.editor.commands.removeCommands(["gotoline", "find"])
	}


  render () {
		const editorStyle = {
			width: '100%'
		}
		let button_classname = ""
		let disabled = false
		if(this.state.last_saved_text === this.state.text) {
			button_classname = "disabled"
			disabled = true
		}
		console.log(button_classname)
    return (
      <div>
				<AceEditor
					style={editorStyle}
					mode="javascript"
					theme="monokai"
					name="editor"
					height="6em"
					onChange={this.onChange.bind(this)}
					value={this.state.text}
					ref='editor'
					editorProps={{}}
				/>
				<button id="save-button" disabled={disabled} className={button_classname} onClick={this.onSave.bind(this)}>Save</button> 
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
