var webpack = require('webpack')

if (process.env.NODE_ENV === 'dev') {
  var WebpackDevServer = require('webpack-dev-server')
  var config = require('./webpack.config')

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
  }).listen(3000, '0.0.0.0', function (err, result) {
    if (err) {
      console.log(err)
    }

    console.log('Listening at 0.0.0.0:3000')
  })
} else {
  var connect = require('connect')
  var serveStatic = require('serve-static')
  var morgan = require('morgan')
  var responseTime = require('response-time')

  connect()
    .use(serveStatic('./dist'))
    .use(morgan('combined'))
    .use(responseTime())
    .listen(3000)
  console.log('Listening on port 3000.')
}
