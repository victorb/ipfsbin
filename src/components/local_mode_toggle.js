var React = require('react')

class LocalModeToggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: this.props.local || false
    }
  }
  handleOnClick(ev) {
    this.setState({
      checked: !this.state.checked
    })
    this.props.onChange(!this.state.checked)
  }
  render() {
    return <div id="local-mode" onClick={this.handleOnClick.bind(this)}>
      <input
        ref="checkbox"
        id="local-mode-checkbox"
        onChange={() => {/* empty because we use state and don't want warning */}}
        type="checkbox"
        checked={this.state.checked}
      />
      &nbsp;
      <label htmlFor="local-mode-checkbox">Use local IPFS daemon</label>
    </div>
  }
}

export default LocalModeToggle
