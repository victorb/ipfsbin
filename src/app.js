require('./style.css')
require('./codemirror.css')
require('./base16-dark.css')

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from './actions'

import Codemirror from 'react-codemirror'
import Header from './components/header'

import ModesService from './modes'
import APIService from './api'

require('offline-plugin/runtime').install()

// Welcome snippet, added and saved if no paste loaded
const INTRODUCTION = `## Welcome to IPFSBin!

** Basic usage**

1. Remove all the content from this default paste

2. Paste your content here

3. Click on save in the top menu

4. Copy the URL from your addressbar

5. Send to your friend

6. Profit!!

If you have any questions, open a issue here:
https://github.com/VictorBjelkholm/ipfsbin/issues/new

or feel free to contact the creator directly on Twitter here:
https://twitter.com/VictorBjelkholm`

var modes = new ModesService()

class App extends Component {
  componentDidMount () {
    if (this.props.local) {
      this.api = new APIService('localhost')
    } else {
      this.api = new APIService(window.location.hostname)
    }
    const loadPaste = (hash) => {
      this.props.dispatch(actions.Reset())
      this.api.cat(hash).then((obj) => {
        this.props.dispatch(actions.ChangeText(obj.text))
        this.props.dispatch(actions.ChangeMode(obj.mode))
        this.props.dispatch(actions.Saved(hash))
      })
    }
    const hashFromURL = () => {
      return window.location.hash.substr(1, window.location.hash.length)
    }

    if (window.location.hash.includes('Qm')) {
      loadPaste(hashFromURL())
      this.refs.editor.codeMirror.focus()
    } else {
      this.handleOnChange(INTRODUCTION)
      this.handleOnChangeMode('Markdown')
      setTimeout(() => {
        this.handleOnSave()
      }, 500)
    }

    window.onhashchange = () => {
      if (hashFromURL() !== this.props.hash) {
        loadPaste(hashFromURL())
      }
    }
  }
  componentDidUpdate (prevProps) {
    if (this.props.local) {
      this.api = new APIService('localhost')
    } else {
      this.api = new APIService(window.location.hostname)
    }
  }
  handleOnChange (text) {
    if (text !== this.props.text) {
      this.props.dispatch(actions.ChangeText(text))
    }
  }
  handleOnSave () {
    if (!this.props.saved) {
      this.props.dispatch(actions.Save())
      let to_save = null
      if (this.props.mode === 'Plain Text' || this.props.mode === null) {
        to_save = this.props.text
      } else {
        const { text, mode } = this.props
        to_save = JSON.stringify({
          text,
          mode
        })
      }
      this.api.add(to_save).then((hash) => {
        window.location.hash = hash
        this.props.dispatch(actions.Saved(hash))
      })
    }
  }
  handleOnNew (evt) {
    evt.preventDefault()
    this.props.dispatch(actions.Reset())
    window.history.replaceState({}, document.title, '/')
  }
  handleOnChangeMode (mode) {
    this.props.dispatch(actions.ChangeMode(mode))
  }
  handleOnChangeLocal (is_local) {
    window.localStorage.setItem('local', is_local)
    this.props.dispatch(actions.ChangeLocal(is_local))
  }
  render () {
    // TODO Extract editor component
    let found_mode = modes.find(this.props.mode)
    if (found_mode !== undefined) {
      found_mode = found_mode.mode
    } else {
      found_mode = 'null'
    }
    const options = {
      lineNumbers: true,
      theme: 'base16-dark',
      mode: found_mode
    }
    return <div>
      <Header
        mode={this.props.mode}
        onChangeMode={this.handleOnChangeMode.bind(this)}
        local={this.props.local}
        onChangeLocal={this.handleOnChangeLocal.bind(this)}
        saving={this.props.saving}
        saved={this.props.saved}
        onSave={this.handleOnSave.bind(this)}
        onNew={this.handleOnNew.bind(this)}
      />
      <Codemirror
        value={this.props.text}
        onChange={this.handleOnChange.bind(this)}
        options={options}
        ref='editor' />
    </div>
  }
}
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  hash: PropTypes.string,
  text: PropTypes.string.isRequired,
  local: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  saved: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
  return state
}

export default connect(
  mapStateToProps
)(App)
