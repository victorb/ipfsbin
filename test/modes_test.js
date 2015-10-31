var assert = require('assert')
var modes_service = require('../src/modes')

describe('Modes Service', () => {
  var modes;
  beforeEach(() => {
    modes = new modes_service()
  })
  it('modes is defined', () => {
    assert(modes !== undefined)
  })
  it('find mode by name', () => {
    const mode = modes.find('HTTP')
    assert(mode.name === 'HTTP')
    assert(mode.mime === 'message/http')
    assert(mode.mode === 'http')
  })
  it('can map all modes', () => {
    const all_modes = modes.map((m) => { return m })
    assert(all_modes.length === 81)
  })

})
