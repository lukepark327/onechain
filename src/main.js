"use strict";
const express = require("express");
const bodyParser = require("body-parser");

const nw = require("./network");
const wl = require("./wallet");

const http_port = process.env.HTTP_PORT || 3001;
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

function initHttpServer() {
    const bc = require("./blockchain");

    const app = express();
    app.use(bodyParser.json());

    app.get("/blocks", function (req, res) {
        res.send(bc.getBlockchain());
    });
    app.post("/mineBlock", function (req, res) {
        const data = req.body.data || [];
        const newBlock = bc.generateNextBlock(data);
        if (bc.addBlock(newBlock)) {
            nw.broadcast(nw.responseLatestMsg());
            console.log("Block added: " + JSON.stringify(newBlock));
        }
        res.send();
    });
    app.get("/version", function (req, res) {
        res.send(bc.getCurrentVersion());
    });
    app.post("/blockVersion", function (req, res) {
        const index = req.body.index;
        res.send(bc.getBlockVersion(index));
    });
    app.get("/peers", function (req, res) {
        /**
         * https://developer.mozilla.org
         * 
         * The map() method creates a new array
         * with the results of calling a provided function
         * on every element in the calling array.
         */
        res.send(nw.getSockets().map(function (s) {
            return s._socket.remoteAddress + ':' + s._socket.remotePort;
        }));

        // var resStrings = [];
        // nw.getSockets().forEach(function(s){
        //     resStrings.push(s._socket.remoteAddress + ':' + s._socket.remotePort);
        // });
        // res.send(resStrings);
    });
    app.post("/addPeers", function (req, res) {
        const peers = req.body.peers || [];
        nw.connectToPeers(peers);
        res.send();
    });
    app.get("/address", function (req, res) {
        const address = wl.getPublicFromWallet().toString();
        res.send({ "address": address });
    });
    app.post("/stop", function (req, res) {
        res.send({ "msg": "Stopping server" });
        process.exit();
    });
    app.listen(http_port, function () { console.log("Listening http port on: " + http_port) });
}

// main
nw.connectToPeers(initialPeers);
initHttpServer();
nw.initP2PServer();
wl.initWallet();
