// 1. Import json-server
const jsonServer = require('json-server')

// Import cors
const cors = require('cors')

// Create a server using json server
const server = jsonServer.create()

// Setup middlewares
const middleware = jsonServer.defaults({
  logger: true,
  bodyParser: true,
  static: 'public'
})

// Configure CORS
const corsOptions = {
  origin: '*',  // In production, replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
}
server.use(cors(corsOptions))

// Setup response timeout
server.use((req, res, next) => {
  res.setTimeout(5000, () => {
    res.status(504).json({ error: 'Server timeout' })
  })
  next()
})

// Error handling middleware
server.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Setup the routes with error handling
const route = jsonServer.router('db.json')
server.use(middleware)
server.use((req, res, next) => {
  try {
    route(req, res, next)
  } catch (err) {
    next(err)
  }
})

// Set port and host
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

// Start the server with error handling
server.listen(PORT, HOST, (err) => {
  if (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
  console.log(`JSON Server is running on http://${HOST}:${PORT}`)
})
