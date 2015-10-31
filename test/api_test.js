var assert = require('assert')
var ipfsd = require('ipfsd-ctl')
var api_service = require('../src/api')

var test_object = {
  a: 1,
  b: {
    c: 2
  }
}

var test_object_hash = 'QmQ6pqQQbPnzPjf4wNaRhUyRDqD4zWC7xQk8Nct63FZjJi'

//TODO this whole thing is a mess and should really be fixed
xdescribe('API Service', function() {
  var api;
  this.timeout(10000)

  before((done) => {
    ipfsd.disposable((err, node) => {
      if(err) throw err
        node.setConfig('Bootstrap', null, (err) => {
          node.setConfig('Mdns', false, (err) => {
            node.startDaemon((err) => {
              if(err) throw err
              api = new api_service(node.apiAddr)
              done()
            })
          })
        })
    })
  })
  it('API have been defined', () => {
    assert(api !== undefined)
  })
  it('Checks if current mode is working', (done) => {
    api.isAlive().then((isAlive) => {
      assert(isAlive)
      done()
    })
  })
  it('Defaults to remote mode', () => {
    assert(api.is_remote)
    assert(!api.is_local)
  })
  it('Can switch to local mode and back to remote', () => {
    api.switchToLocal()
    assert(!api.is_remote)
    assert(api.is_local)
    console.log(api.ipfs.config.show())

    api.switchToRemote()
    assert(api.is_remote)
    assert(!api.is_local)
  })
  it('Can add new content to IPFS', (done) => {
    api.add(test_object).then((hash) => {
      assert(hash === test_object_hash)
      done()
    })
  })
  // TODO this method returns weird things...
  xit('Can get content from IPFS', (done) => {
    api.cat(test_object_hash).then((obj) => {
      assert(obj.a, test_object.a)
      assert(obj.b.c, test_object.b.c)
      done()
    })
  })
})
//
// Can check if current mode is working
// Starts in remote/local mode
// can add new content to ipfs
// can get content from ipfs
