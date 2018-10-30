/*
// add the private key and public key address system.
// store the private key permanently.
*/

'use strict';
var CryptoJS = require("crypto-js");
var express = require("express");
var bodyParser = require("body-parser");
var WebSocket = require("ws");
var fs = require("fs");
var ecdsa = require("elliptic");

var ec = new ecdsa.ec("secp256k1");

// set environment variable
var http_port = process.env.HTTP_PORT || 3001;                              // > $env:HTTP_PORT=3003
var p2p_port = process.env.P2P_PORT || 6001;                                // > $env:P2P_PORT=6003
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];   // > $env:PEERS = "ws://127.0.0.1:6001, ws://127.0.0.1:6002"
var privateKeyLocation = process.env.PRIVATE_KEY || ('wallet/' + p2p_port.toString() + '/private_key');  // private key location

// get private key
function getPrivateFromWallet() {
    var buffer = fs.readFileSync(privateKeyLocation, 'utf8');
    return buffer.toString();
}

// get public key
function getPublicFromWallet() {
    var privateKey = getPrivateFromWallet();
    var key = ec.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex');
}

// generate private key
function generatePrivateKey() {
    var keyPair = ec.genKeyPair();
    var privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
}

// get or generate private key
function initWallet() {
    // do not override existing private keys
    if (fs.existsSync(privateKeyLocation)) { return; }

    var newPrivateKey = generatePrivateKey();

    // mkdir, if necessary
    if (!fs.existsSync('wallet/')) { fs.mkdirSync('wallet/'); }
    if (!fs.existsSync('wallet/' + p2p_port.toString())) { fs.mkdirSync('wallet/' + p2p_port.toString()); }

    // write file
    fs.writeFileSync(privateKeyLocation, newPrivateKey);

    console.log('new wallet with private key created to : %s', privateKeyLocation);
}

// delete private key
function deleteWallet() {
    if (fs.existsSync(privateKeyLocation)) {
        fs.unlinkSync(privateKeyLocation);
    }
}

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
function getGenesisBlock() {
    return new Block(0, "", 1535165503, "Genesis block", "a12eab42aa059b74b1ee08310a88b56e64c3d90cf803445250dc2f209833d6d2");
};

// WARNING!! the current implementation is stored in local volatile memory.
// you may need a database to store the data permanently.
var blockchain = [getGenesisBlock()];

// get new block
// blockData can be anything; transactions, strings, values, etc.
function generateNextBlock(blockData) {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};

// get hash
function calculateHashForBlock(block) {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};

function calculateHash(index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

// add new block
// need validation test
function addBlock(newBlock) {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};

// validation test of new block
function isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};

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
};

// validation test of blockchain
function isValidChain(blockchainToValidate) {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
        return false;
    }
    var tempBlocks = [blockchainToValidate[0]];
    for (var i = 1; i < blockchainToValidate.length; i++) {
        if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchainToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
};

// get latest block
function getLatestBlock() { return blockchain[blockchain.length - 1] };

var sockets = [];
var MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
};

// REST API
function initHttpServer() {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', function (req, res) {
        res.send(JSON.stringify(blockchain));
    });
    app.post('/mineBlock', function (req, res) {
        var newBlock = generateNextBlock(req.body.data || "");
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
    app.get('/address', function (req, res) {
        var address = getPublicFromWallet().toString();
        res.send({ 'address': address });
    });
    app.post('/deleteWallet', function (req, res) {
        deleteWallet();
        res.send();
    });    
    app.listen(http_port, function () { console.log('Listening http on port: ' + http_port) });
};

function initP2PServer() {
    var server = new WebSocket.Server({ port: p2p_port });
    server.on('connection', function (ws) { initConnection(ws) });
    console.log('listening websocket p2p port on: ' + p2p_port);

};

function initConnection(ws) {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
};

function initMessageHandler(ws) {
    ws.on('message', function (data) {
        var message = JSON.parse(data);
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
};

function initErrorHandler(ws) {
    var closeConnection = function (ws) {
        console.log('connection failed to peer: ' + ws.url);
        sockets.splice(sockets.indexOf(ws), 1);
    };
    ws.on('close', function () { closeConnection(ws) });
    ws.on('error', function () { closeConnection(ws) });
};

function connectToPeers(newPeers) {
    newPeers.forEach(function (peer) {
        var ws = new WebSocket(peer);
        ws.on('open', function () { initConnection(ws) });
        ws.on('error', function () {
            console.log('connection failed')
        });
    });
};

function handleBlockchainResponse(message) {
    var receivedBlocks = JSON.parse(message.data).sort(function (b1, b2) { (b1.index - b2.index) });
    var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    var latestBlockHeld = getLatestBlock();
    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            console.log("We can append the received block to our chain");
            blockchain.push(latestBlockReceived);
            broadcast(responseLatestMsg());
        } else if (receivedBlocks.length === 1) {
            console.log("We have to query the chain from our peer");
            broadcast(queryAllMsg());
        } else {
            console.log("Received blockchain is longer than current blockchain");
            replaceChain(receivedBlocks);
        }
    } else {
        console.log('received blockchain is not longer than current blockchain. Do nothing');
    }
};

function queryChainLengthMsg() { return ({ 'type': MessageType.QUERY_LATEST }) };
function queryAllMsg() { return ({ 'type': MessageType.QUERY_ALL }) };
function responseChainMsg() {
    return ({
        'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(blockchain)
    })
};
function responseLatestMsg() {
    return ({
        'type': MessageType.RESPONSE_BLOCKCHAIN,
        'data': JSON.stringify([getLatestBlock()])
    })
};

function write(ws, message) { ws.send(JSON.stringify(message)) };
function broadcast(message) { sockets.forEach(socket => write(socket, message)) };

// main
connectToPeers(initialPeers);
initHttpServer();
initP2PServer();
initWallet();
