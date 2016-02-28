import React, { Component, PropTypes } from 'react'
import Modes from '../modes'
var modes = new Modes()

class SelectLanguage extends Component {
  handleChange (evt) {
    evt.preventDefault()
    this.props.onChange(evt.target.value)
  }
  render () {
    let count = 0
    const options = modes.map((mode) => {
      count++
      return <option key={count} value={mode.name}>
        {mode.name}
      </option>
    })
    return <select onChange={this.handleChange.bind(this)} value={this.props.mode || 'Plain Text'}>
      {options}
    </select>
  }
}
SelectLanguage.propTypes = {
  onChange: PropTypes.func.isRequired,
  mode: PropTypes.string
}

export default SelectLanguage
