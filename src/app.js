require('./style.css')
require('./codemirror.css')
require('./base16-dark.css')

import React from 'react'

import Codemirror from 'react-codemirror'
import LocalModeToggle from './components/local_mode_toggle'
import SelectLanguage from './components/select_language'

import modes_service from './modes'
import api_service from './api'
import url_service from './url'

require('offline-plugin/runtime').install()

var modes = new modes_service()
var url = new url_service(window)


// TODO extract out into error component+service
function ifError(err) {
  if(err) {
    console.error(err)
  }
}

modes.require_all_modes()

var api;
if(url.isLocalMode) {
  api = new api_service('localhost')
} else {
  api = new api_service(window.location.hostname)
}

class App extends React.Component {
  constructor () {
    super();
		this.state = {
			text: '',
			last_saved_text: '',
			mode: 'JavaScript',
			last_saved_mode: 'JavaScript',
      loading: false,
      hash: url.hash
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
      url.setHash(hash)
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

    // TODO get rid of this
		window.onhashchange = () => {
			const hash = window.location.hash.substr(1, window.location.hash.length)
      url.setHash(hash)
			this.fetchAndSetText(hash)
		}

    this.refs.editor.codeMirror.focus()
	}

	handleLanguageChange(mode) {
		this.setState({mode: mode})
	}

  render () {
    // TODO extract out into SaveButton component
		let button_classname = ""
		let disabled = false
		if(
				this.state.last_saved_text === this.state.text &&
				this.state.last_saved_mode === this.state.mode
				) {
			button_classname = "disabled"
			disabled = true
		}
    // TODO should be inside SelectLanguage component
	  let found_mode = modes.find(this.state.mode)
		if(found_mode !== undefined) {
			found_mode = found_mode.mode
		} else {
			found_mode = "null"
		}
    // TODO Extract out into Editor component
		const options = {
			lineNumbers: true,
			theme: 'base16-dark',
			mode: found_mode
		}
    // TODO extract out into loading
    let loading = null
    if(this.state.loading) {
      loading = <div className="loading">Current loading paste...</div>
    }
    return (
      <div>
				<Codemirror value={this.state.text} onChange={this.onChange.bind(this)} options={options} ref="editor"/>
        {loading}
				<button id="save-button" disabled={disabled} className={button_classname} onClick={this.onSave.bind(this)}>Save</button>
				<SelectLanguage onChange={this.handleLanguageChange.bind(this)} mode={this.state.mode}/>
        <LocalModeToggle local={url.isLocalMode} onChange={() => {
          url.toggleLocalMode()
        }}/>
      </div>
    );
  }
}

export default App
