"use strict";
import { recursiveMkdir } from "./modules"; // utils
import { ec } from "./modules"; // crypto

import { existsSync, writeFileSync, readFileSync } from "fs";

const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || process.env.P2P_PORT || 6001);
const privateKeyFile = privateKeyLocation + "/private_key";

function generatePrivateKey() {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
}

function initWallet() {
    if (existsSync(privateKeyFile)) {
        console.log("Load wallet with private key from: " + privateKeyFile);
        return;
    }

    recursiveMkdir(privateKeyLocation);

    const newPrivateKey = generatePrivateKey();
    writeFileSync(privateKeyFile, newPrivateKey);
    console.log("Create new wallet with private key to: " + privateKeyFile);
}

function getPrivateFromWallet() {
    const buffer = readFileSync(privateKeyFile, "utf8");
    return buffer.toString();
}

function getPublicFromWallet() {
    const privateKey = getPrivateFromWallet();
    const key = ec.keyFromPrivate(privateKey, "hex");
    return key.getPublic().encode("hex");
}

export default {
    initWallet,
    getPublicFromWallet
};
