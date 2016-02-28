import React, { Component, PropTypes } from 'react'
import SelectLanguage from './select_language'
import LocalModeToggle from './local_mode_toggle'
require('./header.css')

export default class Header extends Component {
  render () {
    let saveClasses = 'save-button'
    let saveText = 'Save'

    if (this.props.saved) {
      saveClasses = saveClasses + '-disabled'
      saveText = 'Saved'
    }
    if (this.props.saving) {
      saveClasses = saveClasses + '-saving'
      saveText = 'Saving'
    }
    return <div className='header'>
      <div className='header-item'>
        <div className='header-title'>
          IPFSBin
        </div>
      </div>
      <div className='header-item'>
        <SelectLanguage mode={this.props.mode} onChange={this.props.onChangeMode}/>
      </div>
      <div className='header-item'>
        <LocalModeToggle local={this.props.local} onChange={this.props.onChangeLocal}/>
      </div>
      <div className='header-item' onClick={this.props.onNew}>
        <a href='#'>New</a>
      </div>
      <div className={'header-item ' + saveClasses} onClick={(evt) => {
        evt.preventDefault()
        this.props.onSave()
      }}>
        <a href='#'>{saveText}</a>
      </div>
      <div className='header-item header-item-right'>
        <a href='https://github.com/victorbjelkholm/ipfsbin' target='_blank'>Source Code</a>
      </div>
      <div className='clear'></div>
    </div>
  }
}
Header.propTypes = {
  onChangeMode: PropTypes.func.isRequired,
  onChangeLocal: PropTypes.func.isRequired,
  mode: PropTypes.string,
  local: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  saved: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onNew: PropTypes.func.isRequired
}
