import React from 'react'
import _findWhere from 'lodash/collection/findWhere'

var ipfsApi = require('ipfs-api')

var ipfs = ipfsApi(window.location.hostname, '5001')

function ifError(err) {
  if(err) {
    alert("Error making a connection to the daemon! Check the console for more information")
    console.log(err)
    console.log(id)
  }
}

ipfs.id((err, id) => {
  ifError(err)
})

import Codemirror from 'react-codemirror'

import modes from './modes'

modes.map((mode) => {
	const name = mode.mode
	if(name !== "null") {
		require('codemirror/mode/'+name+'/'+name+'.js');
	}
})


if(window.location.hash === '') {
  window.location.hash = 'QmSS3dUE5oKdyDNvpGsYCXgm2mBW4fSDzC5B3NDf7DR8VR'
}

class LocalModeToggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      local_mode: false
    }
  }
  handleOnChange(ev) {
    this.setState({
      local_mode: ev.target.value
    })
    if(ev.target.value) {
      ipfs = ipfsApi('localhost', '5001')
    } else {
      ipfs = ipfsApi(window.location.hostname, '5001')
    }
  }
  render() {
    return <div id="local-mode">
      <input id="local-mode-checkbox" type="checkbox" defaultValue={this.state.local_mode} onChange={this.handleOnChange.bind(this)}></input>
      &nbsp;
      <label htmlFor="local-mode-checkbox">Use local IPFS daemon</label>
    </div>
  }
}

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
			return <option key={count} value={mode.name}>{mode.name}</option>
		})
		const mode = this.state.mode || this.props.mode
		return <div id="select">
			<select onChange={this.handleChange.bind(this) } value={mode}>
			{options}
			</select>
		</div>
	}
}

class App extends React.Component {
  constructor () {
    super();
		this.state = {
			text: '',
			last_saved_text: '',
			mode: 'JavaScript',
			last_saved_mode: 'JavaScript',
      local_mode: false
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
    const body = JSON.stringify({
      text: this.state.text,
      mode: this.state.mode
    })

    ipfs.add(new Buffer(body), (err, res) => {
      ifError(err)
      window.location.hash = res.Hash
      this.setState({
        last_saved_text: this.state.text,
        last_saved_mode: this.state.mode
      })
    })
		//fetch(api_endpoint + '/paste', {
		//	method: 'POST',
		//	headers: {
		//		'Accept': 'application/json',
		//		'Content-Type': 'application/json'
		//	},
		//	body: JSON.stringify({text: this.state.text, mode: this.state.mode}),
		//}).then((res) => {
		//	if(res.status !== 201 && res.status !== 200) {
		//		alert('Something went wrong with creating your paste')
		//	}
		//	return res.json()
		//}).then((json) => {
		//	window.location.hash = json.hash
		//	this.setState({
		//		last_saved_text: this.state.text,
		//		last_saved_mode: this.state.mode
		//	})
		//})
	}

	fetchAndSetText(hash) {
    ipfs.cat(hash, (err, content) => {
      ifError(err)
      const text = content.text
      const mode = content.mode
      this.setState({
        text,
        mode,
        last_saved_text: text,
        last_saved_mode: mode
      })
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

    this.refs.editor.codeMirror.focus()
	}

	handleLanguageChange(mode) {
		this.setState({mode: mode})
	}

  render () {
		let button_classname = ""
		let disabled = false
		if(
				this.state.last_saved_text === this.state.text &&
				this.state.last_saved_mode === this.state.mode
				) {
			button_classname = "disabled"
			disabled = true
		}
	  let found_mode = _findWhere(modes, {name: this.state.mode})
		if(found_mode !== undefined) {
			found_mode = found_mode.mode
		} else {
			found_mode = "null"
		}
		const options = {
			lineNumbers: true,
			theme: 'base16-dark',
			mode: found_mode
		}
    return (
      <div>
				<Codemirror value={this.state.text} onChange={this.onChange.bind(this)} options={options} ref="editor"/>
				<button id="save-button" disabled={disabled} className={button_classname} onClick={this.onSave.bind(this)}>Save</button>
				<Select onChange={this.handleLanguageChange.bind(this)} mode={this.state.mode}/>
        <LocalModeToggle/>
      </div>
    );
  }
}

export default App
