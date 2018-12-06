'use strict';
const express = require("express");
const bodyParser = require('body-parser');

const nw = require("./network");

// set environment variable
const http_port = process.env.HTTP_PORT || 3001;                              // > $env:HTTP_PORT=3003 (windows) || export HTTP_PORT=3003 (mac)
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];   // > $env:PEERS = "ws://127.0.0.1:6001, ws://127.0.0.1:6002"

// REST API
function initHttpServer() {
    const bc = require("./blockchain");
    
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', function (req, res) {
        res.send(bc.getBlockchain());
    });
    app.post('/mineBlock', function (req, res) {
        const newBlock = bc.generateNextBlock(req.body.data || "");
        bc.addBlock(newBlock);
        nw.broadcast(nw.responseLatestMsg());
        console.log('block added: ' + JSON.stringify(newBlock));
        res.send();
    });
    app.get('/peers', function (req, res) {
        res.send(nw.getSockets().map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', function (req, res) {
        nw.connectToPeers([req.body.peer]);
        res.send();
    });
    app.post('/stop', function (req, res) {
        res.send({ 'msg': 'stopping server' });
        process.exit();
    });
    app.listen(http_port, function () { console.log('Listening http on port: ' + http_port) });
}

// main
nw.connectToPeers(initialPeers);
initHttpServer();
nw.initP2PServer();
