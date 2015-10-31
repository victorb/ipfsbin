var ipfsApi = require('ipfs-api')

var api = class API {
  constructor(addr, _window) {
    this.addr = addr
    this._window = _window
    this.is_remote = true
    this.is_local = false
    this.ipfs = ipfsApi(this.addr)
  }
  isAlive() {
    return new Promise((resolve) => {
      resolve(true)
    })
  }
  switchToRemote() {
    this.is_remote = true
    this.is_local = false
  }
  switchToLocal() {
    this.is_remote = false
    this.is_local = true
  }
  add(data) {
    const json = JSON.stringify(data)
    return new Promise((resolve) => {
      this.ipfs.add(new Buffer(json), (err, res) => {
        if(err) throw err
        const hash = res[0].Hash
        resolve(hash)
      })
    })
  }
  cat(hash) {
    return new Promise((resolve) => {
      this.ipfs.cat(hash, (err, res) => {
        if(err) throw err
        resolve(res)
      })
    })
  }
}

export default api
