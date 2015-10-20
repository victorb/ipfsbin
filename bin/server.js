var express = require('express');
var bodyParser = require('body-parser')
var ipfsApi = require('ipfs-api')
var cors = require('cors')

var ipfs = ipfsApi('ipfs', '5001')

var app = express();

app.use(bodyParser.json({limit: '50mb'}))
app.use(cors());
app.use(express.static('dist'));

app.post('/paste', function (req, res) {
	const text = req.body.text
	ipfs.add(new Buffer(text), function(err, response) {
		if(err) {
			console.error(err)
			res.sendStatus(500)
			return
		}
		const hash = response[0].Hash
		console.log('added paste ' + hash)
		res.send({hash: hash})
	})
});

app.get('/paste/:id', function (req, res) {
	const id = req.params.id
	console.log('getting paste ' + id)
	ipfs.cat(id, function(err, stream) {
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


var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
