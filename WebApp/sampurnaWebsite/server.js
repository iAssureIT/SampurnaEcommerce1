const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3006
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express();

    server.all('*', (req, res) => {
      // console.log("req => ",req);
      // console.log("res => ",res);
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
})