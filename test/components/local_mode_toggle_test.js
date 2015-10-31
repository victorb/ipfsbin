var assert = require('assert')
var LocalModeToggle = require('../../src/components/local_mode_toggle')
var React = require('react')
var TestUtils = require('react-addons-test-utils')

describe('Component | <LocalModeToggle/>', () => {
  var local_mode_toggle;
  before(() => {
    local_mode_toggle = TestUtils.renderIntoDocument(
      <LocalModeToggle/>
    );
  })
  it('Is defined', () => {
    assert(local_mode_toggle !== undefined)
  })
  it('Defaults to off', () => {
    var checkbox = TestUtils.findRenderedDOMComponentWithTag(
      local_mode_toggle,
      'input'
    );
    assert.equal(false, checkbox.checked)
  })
  it('Read props `local`', () => {
    local_mode_toggle = TestUtils.renderIntoDocument(
      <LocalModeToggle local={true}/>
    );
    var checkbox = TestUtils.findRenderedDOMComponentWithTag(
      local_mode_toggle,
      'input'
    );
    assert.equal(true, checkbox.checked)
  })
  it('Calls callback', () => {
    var was_called = false
    var callback_value;
    var callback = (value) => {
      was_called = true
      callback_value = value
    }
    local_mode_toggle = TestUtils.renderIntoDocument(
      <LocalModeToggle onChange={callback}/>
    );
    var el = TestUtils.findRenderedDOMComponentWithTag(
      local_mode_toggle,
      'div'
    );
    TestUtils.Simulate.click(el)
    assert.equal(true, was_called)
    assert.equal(true, callback_value)

    TestUtils.Simulate.click(el)
    assert.equal(false, callback_value)
  })
})
