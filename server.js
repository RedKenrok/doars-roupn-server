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

const PORT = 10000

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
