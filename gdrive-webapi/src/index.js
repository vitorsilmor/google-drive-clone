import  fs  from 'fs'
import https from 'https'
import logger from './logger.js'
import { Server } from 'socket.io'
import Routes from './routes.js'

const PORT = process.env.PORT || 3000

const localHostSSL = {
    key: fs.readFileSync('./certificates/key.pem'),
    cert: fs.readFileSync('./certificates/cert.pem')
}

const router = new Routes()

const server = https.createServer(
    localHostSSL, 
    router.handler.bind(router)
)

const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: false
    }
});

io.on("connection", (socket) => logger.info(`someone connected: ${socket.id}`))

const startServer = () => {
    const { address, port } = server.address();
    logger.info(`app running at https://${address}:${port}`)
}

server.listen(PORT, startServer)