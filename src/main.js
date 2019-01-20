"use strict";
const express = require("express");
const bodyParser = require("body-parser");

const nw = require("./network");
const wl = require("./wallet");

// set environment variable
const http_port = process.env.HTTP_PORT || 3001;                              // > $env:HTTP_PORT=3003 (windows) || export HTTP_PORT=3003 (mac)
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];   // > $env:PEERS = "ws://127.0.0.1:6001, ws://127.0.0.1:6002"

// RESTful
function initHttpServer() {
    const bc = require("./blockchain");

    const app = express();
    app.use(bodyParser.json());

    app.get("/blocks", function (req, res) {
        res.send(bc.getBlockchain());
    });
    app.post("/mineBlock", function (req, res) {
        const newBlock = bc.generateNextBlock(req.body.data || "");
        bc.addBlock(newBlock);
        nw.broadcast(nw.responseLatestMsg());
        console.log("Block added: " + JSON.stringify(newBlock));
        res.send();
    });
    app.get("/peers", function (req, res) {
        /* 
         *  ref. https://developer.mozilla.org
         *
         *  The map() method creates a new array
         *  with the results of calling a provided function
         *  on every element in the calling array.
         */
        res.send(nw.getSockets().map(function (s) {
            return s._socket.remoteAddress + ':' + s._socket.remotePort;
        }));
        /*
         *  Same as the following code.
         * 
         *  The forEach() method executes a provided function once
         *  for each array element.
         */
        /*
            var resStrings = [];
            nw.getSockets().forEach(function(s){
                resStrings.push(s._socket.remoteAddress + ':' + s._socket.remotePort);
            });
            res.send(resStrings);
        */
    });
    app.post("/addPeer", function (req, res) {
        nw.connectToPeers([req.body.peer]);
        res.send();
    });
    app.get("/address", function (req, res) {
        const address = wl.getPublicFromWallet().toString();
        if (address != "") { res.send({ "address": address }); }
        else { res.send(); }
    });
    app.post("/createWallet", function (req, res) {
        wl.createWallet();
        res.send();
    });
    app.post("/deleteWallet", function (req, res) {
        wl.deleteWallet();
        res.send();
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
