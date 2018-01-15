'use strict'
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
const devConfig = require("./dev")

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const app = express()
const compiler = webpack(devConfig)
const proxy = require('http-proxy-middleware');

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: devConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
   log: false,
   heartbeat: 2000
})

app.use(hotMiddleware);
app.use(devMiddleware);

const staticPath = path.posix.join('/', 'static')
app.use(staticPath, express.static('./static'))

const port = 8088;
const uri = 'http://localhost:' + port;

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')

devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')

    if (process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
