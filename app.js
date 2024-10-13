const express = require("express");
const socketIo = require("socket.io");

const connections = require("./connections");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 8000;

app.set('trust proxy', 1); // trusts first proxy
app.use(cookieParser(process.env.COOKIE_SECRET ?? 'hackdearborn2024'));
app.use(cors({
    credentials: true,
    origin: isProduction ? "https://api.bloomo.ca" : "http://localhost:8000",
    methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials'],
    exposedHeaders: ['Set-Cookie', 'Content-Length', 'Accept', 'X-Requested-With', 'X-HTTP-Method-Override', 'X-Set-Cookie' ],
}));

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

app.head(routes.head);

io.on('connection', (socket) => {
    socket.on('not sure', (callback) => {
        connections.notsure(socket, io, callback);
    });
});

server.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
});