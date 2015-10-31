var React = require('react')

class LocalModeToggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: this.props.local || false
    }
  }
  handleOnClick(ev) {
    const new_checked = !this.state.checked
    this.setState({
      checked: new_checked
    })
    console.log('Changed!')
      console.log('returning')
      console.log(new_checked)
    this.props.onChange(new_checked)
  }
  render() {
    return <div id="local-mode">
      <input
        ref="checkbox"
        id="local-mode-checkbox"
        type="checkbox"
        checked={this.state.checked}
        onChange={this.handleOnClick.bind(this)}
      />
      &nbsp;
      <label htmlFor="local-mode-checkbox">Use local IPFS daemon</label>
    </div>
  }
}

export default LocalModeToggle
