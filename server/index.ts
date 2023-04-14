import http from 'http';
import express from 'express';
import cors from "cors";
import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import expressBasicAuth from 'express-basic-auth';
import { TicTacToe } from "./rooms/tictactoe"
import { monitor } from '@colyseus/monitor';

const app = express();
const port = Number(process.env.PORT || 3553);

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({ server: server })
});

gameServer.define('tictactoe', TicTacToe);
gameServer.listen(port);

app.use(express.static(__dirname + "/../javascript-pixi/public"));


const basicAuthMiddleware = expressBasicAuth({
    // list of users and passwords
    users: {
        "admin": "admin",
    },
    // sends WWW-Authenticate header, which will prompt the user to fill
    // credentials in
    challenge: true
});

app.use("/colyseus", basicAuthMiddleware, monitor());

console.log(`Listening on port ${ port }`);
