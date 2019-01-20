"use strict";
const fs = require("fs");
const ecdsa = require("elliptic");

const ec = new ecdsa.ec("secp256k1");

// set environment variable
const http_port = process.env.HTTP_PORT || 3001;
const privateKeyLocation = process.env.PRIVATE_KEY || ("wallet/" + http_port.toString());   // DIR
const privateKeyFile = privateKeyLocation + "/private_key";

// get private key
function getPrivateFromWallet() {
    const buffer = fs.readFileSync(privateKeyFile, "utf8");
    return buffer.toString();
}

// get public key
function getPublicFromWallet() {
    if (fs.existsSync(privateKeyFile)) {
        const privateKey = getPrivateFromWallet();
        const key = ec.keyFromPrivate(privateKey, "hex");
        return key.getPublic().encode("hex");
    }
    else {
        console.log("No private key at: %s", privateKeyFile);
        return "";
    }
}

// generate private key
function generatePrivateKey() {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
}

// get or generate private key
function initWallet() {
    // do not override existing private keys
    if (fs.existsSync(privateKeyFile)) { return; }

    const newPrivateKey = generatePrivateKey();

    // mkdir, if necessary
    if (!fs.existsSync("wallet/")) {
        fs.mkdirSync("wallet/");
    }
    if (!fs.existsSync(privateKeyLocation)) {
        fs.mkdirSync(privateKeyLocation);
    }

    // write file
    fs.writeFileSync(privateKeyFile, newPrivateKey);

    console.log("New wallet with private key created to: %s", privateKeyFile);
}

// create private key
function createWallet() {
    // do not override existing private keys
    if (fs.existsSync(privateKeyFile)) {
        console.log("Wallet already exists at: %s", privateKeyFile);
        return;
    }

    const newPrivateKey = generatePrivateKey();

    // mkdir, if necessary
    if (!fs.existsSync("wallet/")) {
        fs.mkdirSync("wallet/");
    }
    if (!fs.existsSync(privateKeyLocation)) {
        fs.mkdirSync(privateKeyLocation);
    }

    // write file
    fs.writeFileSync(privateKeyFile, newPrivateKey);

    console.log("New wallet with private key created to: %s", privateKeyFile);
}

// delete private key
function deleteWallet() {
    if (fs.existsSync(privateKeyFile)) {
        fs.unlinkSync(privateKeyFile);
    }
    if (fs.existsSync(privateKeyLocation)) {
        fs.rmdirSync(privateKeyLocation);
    }

    console.log("Wallet with private key removed to: %s", privateKeyFile);
}

module.exports = {
    initWallet,
    getPublicFromWallet,
    createWallet,
    deleteWallet
};
