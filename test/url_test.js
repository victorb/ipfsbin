var assert = require('assert')

var url_service = require('../src/url')

var window_mock = {
  location: {
    hash: '',
    search: '',
    hostname: 'ipfsbin.dev'
  }
}

describe('URL Service', function() {
  var url;
  beforeEach(() => {
    url = new url_service(window_mock)
  })
  it('knows if we want to start in local mode', () => {
    assert(!url.isLocalMode, 'was in local mode')

    url = new url_service({location: {search: '?local'}})
    assert(url.isLocalMode, 'was not in local mode')

    url = new url_service({location: {search: ''}})
    assert(!url.isLocalMode, 'was in local mode')

    url = new url_service({location: {search: '?'}})
    assert(!url.isLocalMode, 'was in local mode')

    url = new url_service({location: {search: '?something'}})
    assert(!url.isLocalMode, 'was in local mode')

    url = new url_service({location: {search: null}})
    assert(!url.isLocalMode, 'was in local mode')
  })
  it('defaults to showing a hash', () => {
    assert(url.hash.length !== 0, 'was 0 characters long')
    assert(url.hash.split('')[0] !== '#', 'first character of hash was #')
    assert(url._window.location.hash.split('')[0] === '#', 'first character of location.hash was not hash')
  })
  it('can set/read value of hash', () => {
    var initial_value = url.hash
    url.setHash('abcde')
    assert(url.hash === 'abcde', 'didnt set hash property')
    assert(url._window.location.hash === '#abcde', 'didnt set hash property of location')
    assert(initial_value !== 'abcde', 'was the same as initial value')
  })
  it('can toggle local mode', () => {
    assert(!url.isLocalMode, 'didnt start in local mode')
    assert(url._window.location.search !== '?local', 'didnt start in local mode .search')

    url.toggleLocalMode()
    assert(url.isLocalMode, 'first toggle didnt turn on local mode')
    assert(url._window.location.search === '?local', 'first toggle didnt set .search')

    url.toggleLocalMode()
    assert(!url.isLocalMode, 'second toggle didnt turn off local mode')
    assert(url._window.location.search !== '?local', 'second toggle didnt set .search')
  })
})
