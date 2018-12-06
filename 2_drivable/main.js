/*
// communicates with the user via HTTP.
// communicates with other nodes through P2P connections.
*/

'use strict';
const CryptoJS = require("crypto-js");
const express = require("express");
const bodyParser = require('body-parser');
const WebSocket = require("ws");

// set environment variable
const http_port = process.env.HTTP_PORT || 3001;                              // > $env:HTTP_PORT=3003
const p2p_port = process.env.P2P_PORT || 6001;                                // > $env:P2P_PORT=6003
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];   // > $env:PEERS = "ws://127.0.0.1:6001, ws://127.0.0.1:6002"

// minimum block structure
class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
}

// WARNING!! if you modify any of the following data,
// you might need to obtain a new hash(SHA256) value
// Use this syntax: console.log(calculateHash(...));
function getGenesisBlock() {
    return new Block(0, "", 1535165503, "Genesis block", "a12eab42aa059b74b1ee08310a88b56e64c3d90cf803445250dc2f209833d6d2");
}

// WARNING!! the current implementation is stored in local volatile memory.
// you may need a database to store the data permanently.
var blockchain = [getGenesisBlock()];

var sockets = [];

const MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
};

// REST API
function initHttpServer() {
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', function (req, res) {
        res.send(JSON.stringify(blockchain));
    });
    app.post('/mineBlock', function (req, res) {
        const newBlock = generateNextBlock(req.body.data || "");
        addBlock(newBlock);
        broadcast(responseLatestMsg());
        console.log('block added: ' + JSON.stringify(newBlock));
        res.send();
    });
    app.get('/peers', function (req, res) {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', function (req, res) {
        connectToPeers([req.body.peer]);
        res.send();
    });
    app.post('/stop', function (req, res) {
        res.send({ 'msg': 'stopping server' });
        process.exit();
    });
    app.listen(http_port, function () { console.log('Listening http on port: ' + http_port) });
}

function initP2PServer() {
    const server = new WebSocket.Server({ port: p2p_port });
    server.on('connection', function (ws) { initConnection(ws) });
    console.log('listening websocket p2p port on: ' + p2p_port);
}

function initConnection(ws) {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
}

function initMessageHandler(ws) {
    ws.on('message', function (data) {
        const message = JSON.parse(data);
        console.log('Received message' + JSON.stringify(message));
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                write(ws, responseLatestMsg());
                break;
            case MessageType.QUERY_ALL:
                write(ws, responseChainMsg());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:
                handleBlockchainResponse(message);
                break;
        }
    });
}

function closeConnection(ws) {
    console.log('connection failed to peer: ' + ws.url);
    sockets.splice(sockets.indexOf(ws), 1);
}

function initErrorHandler(ws) {
    ws.on('close', function () { closeConnection(ws) });
    ws.on('error', function () { closeConnection(ws) });
}

// get new block
// blockData can be anything; transactions, strings, values, etc.
function generateNextBlock(blockData) {
    const previousBlock = getLatestBlock();
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = Math.round(new Date().getTime() / 1000);
    const nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);

    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
}

// get hash
function calculateHashForBlock(block) {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
}

function calculateHash(index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
}

// add new block
// need validation test
function addBlock(newBlock) {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
}

// validation test of new block
function isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    }
    else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    }
    else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
}

function connectToPeers(newPeers) {
    newPeers.forEach(function (peer) {
        var ws = new WebSocket(peer);
        ws.on('open', function () { initConnection(ws) });
        ws.on('error', function () {
            console.log('connection failed')
        });
    });
}

function handleBlockchainResponse(message) {
    const receivedBlocks = JSON.parse(message.data);
    const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    const latestBlockHeld = getLatestBlock();

    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            console.log("We can append the received block to our chain");
            if (addBlock(latestBlockReceived)) {
                broadcast(responseLatestMsg());
            }
        }
        else if (receivedBlocks.length === 1) {
            console.log("We have to query the chain from our peer");
            broadcast(queryAllMsg());
        }
        else {
            console.log("Received blockchain is longer than current blockchain");
            replaceChain(receivedBlocks);
        }
    }
    else {
        console.log('received blockchain is not longer than current blockchain. Do nothing');
    }
}

// WARNING!! you can modify the following implementaion according to your own consensus design.
// current consensus: the longest chain rule.
function replaceChain(newBlocks) {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        broadcast(responseLatestMsg());
    } else {
        console.log('Received blockchain invalid');
    }
}

// validation test of blockchain
function isValidChain(blockchainToValidate) {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
        return false;
    }
    var tempBlocks = [blockchainToValidate[0]];
    for (var i = 1; i < blockchainToValidate.length; i++) {
        if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchainToValidate[i]);
        }
        else {
            return false;
        }
    }
    return true;
}

// get latest block
function getLatestBlock() { return blockchain[blockchain.length - 1] }

function queryChainLengthMsg() { return ({ 'type': MessageType.QUERY_LATEST }) }
function queryAllMsg() { return ({ 'type': MessageType.QUERY_ALL }) }
function responseChainMsg() {
    return ({
        'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(blockchain)
    })
}
function responseLatestMsg() {
    return ({
        'type': MessageType.RESPONSE_BLOCKCHAIN,
        'data': JSON.stringify([getLatestBlock()])
    })
}

function write(ws, message) { ws.send(JSON.stringify(message)) }
function broadcast(message) { sockets.forEach(socket => write(socket, message)) }

// main
connectToPeers(initialPeers);
initHttpServer();
initP2PServer();
