var express = require('express');
var bodyParser = require('body-parser')
var ipfsApi = require('ipfs-api')
var ipfsd = require('ipfsd-ctl')
var cors = require('cors')

var ipfs

var app = express();

app.use(bodyParser.json({limit: '50mb'}))
app.use(cors());
app.use(express.static('dist'));

app.post('/paste', function (req, res) {
	const text = req.body.text
	console.log('adding paste')
	ipfs.add(new Buffer(text), function(err, response) {
		if(err) {
			console.error(err)
			res.sendStatus(500)
			return
		}
		res.send({hash: response[0].Hash})
	})
});

app.get('/paste/:id', function (req, res) {
	console.log('getting paste')
	ipfs.cat(req.params.id, function(err, stream) {
		if(err) {
			console.error(err)
			res.sendStatus(404)
			return
		}
		var buf = ''
			stream
			.on('error', function (err) { throw err })
			.on('data', function (data) { buf += data })
			.on('end', function () {
				res.send({text: buf.toString()});
			})
	})
});

ipfsd.disposable(function (err, node) {
	if (err) throw err
	console.log('ipfs init done')

	node.startDaemon(function (err, ignore) {
		if (err) throw err
		console.log('ipfs daemon running')

		ipfs = ipfsApi(node.apiAddr)

		var server = app.listen(3000, function () {
			var host = server.address().address;
			var port = server.address().port;

			console.log('Example app listening at http://%s:%s', host, port);
		});
	})
})

