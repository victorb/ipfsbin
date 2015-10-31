import React from 'react'
import _findWhere from 'lodash/collection/findWhere'
import Codemirror from 'react-codemirror'
import modes_service from './modes'
import api_service from './api'

require('offline-plugin/runtime').install()

var modes = new modes_service()


function ifError(err) {
  if(err) {
    console.error(err)
  }
}

modes.require_all_modes()

// Tested
if(window.location.hash === '') {
  window.location.hash = 'Qmc2KLJkWLwEpsRvnMkVU5STyeGt4cCy5PY1FXJPDmrJgD'
}

// Tested
let start_in_local = false
if(window.location.search === '?local') {
  start_in_local = true
}

var api;
if(start_in_local) {
  api = new api_service('localhost')
} else {
  api = new api_service(window.location.hostname)
}

class LocalModeToggle extends React.Component {
  handleOnClick(ev) {
    if(ev.target.value) {
      window.location.search = "?local"
    } else {
      window.location.search = ""
    }
  }
  render() {
    return <div id="local-mode" onClick={this.handleOnClick.bind(this)}>
      <input id="local-mode-checkbox" type="checkbox" checked={this.props.local}></input>
      &nbsp;
      <label htmlFor="local-mode-checkbox">Use local IPFS daemon</label>
    </div>
  }
}

// Tested

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
      local_mode: false,
      loading: false
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
    const body = {
      text: this.state.text,
      mode: this.state.mode
    }
    this.setState({loading: true})

    api.add(body).then((hash) => {
      window.location.hash = hash
      this.setState({
        last_saved_text: this.state.text,
        last_saved_mode: this.state.mode,
        loading: false
      })
    })
	}

	fetchAndSetText(hash) {
    this.setState({loading: true})
    api.cat(hash).then((content) => {
      const text = content.text
      const mode = content.mode
      this.setState({
        text,
        mode,
        last_saved_text: text,
        last_saved_mode: mode,
        loading: false
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
    let loading = null
    if(this.state.loading) {
      loading = <div className="loading">Current loading paste...</div>
    }
    return (
      <div>
				<Codemirror value={this.state.text} onChange={this.onChange.bind(this)} options={options} ref="editor"/>
        {loading}
				<button id="save-button" disabled={disabled} className={button_classname} onClick={this.onSave.bind(this)}>Save</button>
				<Select onChange={this.handleLanguageChange.bind(this)} mode={this.state.mode}/>
        <LocalModeToggle local={start_in_local}/>
      </div>
    );
  }
}

export default App
