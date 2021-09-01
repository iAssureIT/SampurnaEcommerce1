const { createServer } = require('http')
const { parse } = require('url')
const conf = require('./next.config')
const next = require('next')

const dev = conf.publicRuntimeConfig.NODE_ENV !== 'production'
console.log("dev = ",dev);
console.log("conf.publicRuntimeConfig.NODE_ENV = ",conf.publicRuntimeConfig.NODE_ENV);

const app = next({ dev })
const port = conf.publicRuntimeConfig.PORT;
console.log("port=",port)

const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
		res.setHeader("Cache-Control", "public,max-age=31536000,immutable");

    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    // if (pathname === '/a') {
    //   app.render(req, res, '/a', query)
    // } else if (pathname === '/b') {
    //   app.render(req, res, '/b', query)
    // } else {
      handle(req, res, parsedUrl)
    //}
  }).listen(port, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:'+port)
  })
})