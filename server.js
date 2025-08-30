import {
    createServer as createHttpServer,
} from 'http'
import {
    WebSocketServer,
} from 'ws'

// Import the library.
import {
    createServerConnector,
} from '@doars/roupn'

const PORT = process.env.PORT || 10000

// Function to set CORS headers
const setCorsHeaders = (response) => {
}

// Create a server connector instance.
const {
  handleHttpRequest,
  handleSocketUpgrade,
} = createServerConnector({
  // Configuration options.
})

// Set up the HTTP server.
const httpServer = createHttpServer((
  request,
  response,
) => {
  // Set CORS headers for all requests
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Max-Age', '86400')

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  // The connector handles requests to the /create-room endpoint.
  const handled = handleHttpRequest(
    request,
    response,
  )
  if (!handled) {
    // Handle other requests or return 404.
    response.writeHead(404)
    response.end('Not found')
  }
})

// Set up the WebSocket server.
const socketServer = new WebSocketServer({
  noServer: true,
})
httpServer.on('upgrade', (
  request,
  socket,
  head,
) => {
  // Add CORS headers for WebSocket upgrade requests
  const origin = request.headers.origin
  if (origin) {
    socket.write(
      'HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\n' +
      'Connection: Upgrade\r\n' +
      'Access-Control-Allow-Origin: *\r\n' +
      'Access-Control-Allow-Credentials: true\r\n' +
      '\r\n'
    )
  }

  // The connector handles upgrades for the /join-room endpoint.
  const handled = handleSocketUpgrade(
    request,
    socket,
    head,
    socketServer,
  )
  if (!handled) {
    socket.destroy()
  }
})

// Start the server.
httpServer.listen(PORT, () => {
  console.log('HTTP server listening on http://localhost:' + PORT)
})
