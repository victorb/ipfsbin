/* global describe, it */
import reducer from '../src/reducer'
import assert from 'assert'
import * as actions from '../src/actions'

describe('Reducer', () => {
  it('should be able to change the text in the state', () => {
    const state = reducer(undefined, actions.ChangeText('Hello World'))
    assert.strictEqual(state.text, 'Hello World')
  })
  it('should be able to change the mode in the state', () => {
    const state = reducer(undefined, actions.ChangeMode('javascript'))
    assert.strictEqual(state.mode, 'javascript')
  })
  it('change to local mode and to remote', () => {
    const state = reducer(undefined, actions.ChangeLocal(true))
    assert.strictEqual(state.local, true)
    const new_state = reducer(state, actions.ChangeLocal(false))
    assert.strictEqual(new_state.local, false)
  })
  it('Should track saved state', () => {
    let state = reducer(undefined, {})
    assert.strictEqual(state.saved, true)
    assert.strictEqual(state.saving, false)
    assert.strictEqual(state.text, '')
    assert.strictEqual(state.saved_text, '')
    assert.strictEqual(state.hash, null)

    state = reducer(state, actions.ChangeText('Something'))
    assert.strictEqual(state.saved, false)
    assert.strictEqual(state.saving, false)
    assert.strictEqual(state.text, 'Something')
    assert.strictEqual(state.saved_text, '')
    assert.strictEqual(state.hash, null)

    state = reducer(state, actions.Save())
    assert.strictEqual(state.saved, false)
    assert.strictEqual(state.saving, true)
    assert.strictEqual(state.saved_text, '')
    assert.strictEqual(state.hash, null)

    state = reducer(state, actions.Saved('HASH'))
    assert.strictEqual(state.saved, true)
    assert.strictEqual(state.saving, false)
    assert.strictEqual(state.saved_text, 'Something')
    assert.strictEqual(state.hash, 'HASH')

    state = reducer(state, actions.ChangeText('Something'))
    assert.strictEqual(state.saved, true)
    assert.strictEqual(state.saving, false)
    assert.strictEqual(state.text, 'Something')
    assert.strictEqual(state.saved_text, 'Something')
    assert.strictEqual(state.hash, 'HASH')
  })
  it('Reset state', () => {
    let state = reducer(undefined, actions.ChangeText('Hello World'))
    assert.strictEqual(state.text, 'Hello World')
    state = reducer(state, actions.Reset())
    assert.strictEqual(state.text, '')
  })
})
