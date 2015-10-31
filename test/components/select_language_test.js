var assert = require('assert')
var SelectLanguage = require('../../src/components/select_language')
var React = require('react')
var TestUtils = require('react-addons-test-utils')

describe('Component | <SelectLanguage/>', () => {
  var select_language;
  before(() => {
    select_language = TestUtils.renderIntoDocument(
      <SelectLanguage/>
    );
  })
  it('Is defined', () => {
    assert(select_language !== undefined)
  })
  it('Default to plain text', () => {
    var options = TestUtils.scryRenderedDOMComponentsWithTag(
      select_language,
      'option'
    );
    var selected_option;
    options.forEach((option) => {
      if(option.selected) {
        selected_option = option
      }
    })
    assert.equal(selected_option.value, 'Plain Text')
  })
  it('Set default language', () => {
    select_language = TestUtils.renderIntoDocument(
      <SelectLanguage mode="Markdown"/>
    )
    var options = TestUtils.scryRenderedDOMComponentsWithTag(
      select_language,
      'option'
    );
    var selected_option;
    options.forEach((option) => {
      if(option.selected) {
        selected_option = option
      }
    })
    assert.equal(selected_option.value, 'Markdown')
  })
  it('Change language', () => {
    var selected_mode;
    var change_language = (mode) => {
      selected_mode = mode
    }
    select_language = TestUtils.renderIntoDocument(
      <SelectLanguage mode="Markdown" onChange={change_language}/>
    )
    var select_element = TestUtils.findRenderedDOMComponentWithTag(
      select_language,
      'select'
    )
    TestUtils.Simulate.change(select_element, {
      target: {
        value: 'Markdown'
      }
    })
    var options = TestUtils.scryRenderedDOMComponentsWithTag(
      select_language,
      'option'
    );
    var selected_option;
    options.forEach((option) => {
      if(option.selected) {
        selected_option = option
      }
    })

    assert.equal(selected_option.value, 'Markdown')
    assert.equal(selected_mode, 'Markdown')
  })
})
