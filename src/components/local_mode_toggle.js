import React, { Component, PropTypes } from 'react'

class LocalModeToggle extends Component {
  handleOnClick (ev) {
    this.props.onChange(ev.target.checked)
  }
  render () {
    return <div>
      <input
        ref='checkbox'
        id='local-mode-checkbox'
        type='checkbox'
        checked={this.props.local}
        onChange={this.handleOnClick.bind(this)}
      />
      <label htmlFor='local-mode-checkbox'>
        Use local IPFS daemon
      </label>
    </div>
  }
}
LocalModeToggle.propTypes = {
  onChange: PropTypes.func.isRequired,
  local: PropTypes.bool.isRequired
}

export default LocalModeToggle
