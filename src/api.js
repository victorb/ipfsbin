require('script!./../node_modules/ipfs-api/dist/ipfsapi.js')

const parseJSONorNonJSON = (to_parse) => {
  var to_return = null
  try {
    to_return = JSON.parse(to_parse)
  } catch (e) {
    to_return = {
      mode: null,
      text: to_parse
    }
  }
  return to_return
}

class API {
  constructor (hostname) {
    this.hostname = hostname
    this.ipfs = window.ipfsAPI(this.hostname, '5001')
  }
  add (data) {
    return new Promise((resolve) => {
      this.ipfs.add(new Buffer(data), (err, res) => {
        if (err) throw err
        // TODO works for both 0.3 and 0.4, refactor once moved to 0.4
        if (res[0] === undefined) {
          resolve(res.Hash) // 0.4
        } else {
          resolve(res[0].Hash) // 0.3
        }
      })
    })
  }
  cat (hash) {
    return new Promise((resolve) => {
      this.ipfs.cat(hash, (err, res) => {
        if (err) throw err
        if (res.readable) {
          var chunks = []
          res.on('data', function (chunk) {
            chunks.push(chunk)
          })
          res.on('end', function () {
            resolve(parseJSONorNonJSON(chunks.join('')))
          })
        } else {
          resolve(parseJSONorNonJSON(res.toString()))
        }
      })
    })
  }
}

export default API
