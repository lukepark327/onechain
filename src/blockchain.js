"use strict";
const CryptoJS = require("crypto-js");

// block structure
class Block {
    constructor(index, previousHash, timestamp, data, hash, difficulty, nonce) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}

// WARNING!! if you modify any of the following data,
// you may need to obtain a new hash(SHA256) value of them.
// Use this syntax: console.log(calculateHash(0, "", 1535165503, "Genesis block", 0, 0));
function getGenesisBlock() {
    const index = 0;
    const previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
    const timestamp = 1535165503;
    const data = "Genesis block";
    const difficulty = 0;
    const nonce = 0;
    // const hash = calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
    // console.log(hash);
    const hash = "997d082838d06e301961597bb2daabb0a16aae046629d65127ddd4fa0539a1c7";

    return new Block(index, previousHash, timestamp, data, hash, difficulty, nonce);
}

// WARNING!! the current implementation's blockchain is stored in local volatile memory.
// you may need a database to store the data permanently.
var blockchain = [getGenesisBlock()];

function getBlockchain() { return blockchain; }
function getLatestBlock() { return blockchain[blockchain.length - 1]; }

// get new block
// blockData can be anything; transactions, strings, values, etc.
// sometime you may need to implement encoding-decoding methods.
function generateNextBlock(blockData) {
    const previousBlock = getLatestBlock();
    const difficulty = getDifficulty(getBlockchain());
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = Math.round(new Date().getTime() / 1000);
    const newBlock = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);

    return newBlock;
}

// PoW
function findBlock(nextIndex, previoushash, nextTimestamp, blockData, difficulty) {
    var nonce = 0;
    while (true) {
        var hash = calculateHash(nextIndex, previoushash, nextTimestamp, blockData, difficulty, nonce);
        if (hashMatchesDifficulty(hash, difficulty)) {
            return new Block(nextIndex, previoushash, nextTimestamp, blockData, hash, difficulty, nonce);
        }
        nonce++;
    }
}

const BLOCK_GENERATION_INTERVAL = 10;  // in seconds
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10;  // in blocks

function getDifficulty(aBlockchain) {
    const latestBlock = aBlockchain[blockchain.length - 1];
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
        return getAdjustedDifficulty(latestBlock, aBlockchain);
    }
    else {
        return latestBlock.difficulty;
    }
}

function getAdjustedDifficulty(latestBlock, aBlockchain) {
    const prevAdjustmentBlock = aBlockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeTaken = latestBlock.timestamp - prevAdjustmentBlock.timestamp;
    const timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;

    if (timeTaken < timeExpected / 2) {
        return prevAdjustmentBlock.difficulty + 1;
    }
    else if (timeTaken > timeExpected * 2) {
        return prevAdjustmentBlock.difficulty - 1;
    }
    else {
        return prevAdjustmentBlock.difficulty;
    }
}

function hashMatchesDifficulty(hash, difficulty) {
    const ut = require("./utils");

    const hashBinary = ut.hexToBinary(hash);
    const requiredPrefix = '0'.repeat(difficulty);
    return hashBinary.startsWith(requiredPrefix);
}

// get hash
function calculateHashForBlock(block) {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.difficulty, block.nonce);
}

function calculateHash(index, previousHash, timestamp, data, difficulty, nonce) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data + difficulty + nonce).toString();
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
        console.log("Invalid index");
        return false;
    }
    else if (previousBlock.hash !== newBlock.previousHash) {
        console.log("Invalid previoushash");
        return false;
    }
    else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + " " + typeof calculateHashForBlock(newBlock));
        console.log("Invalid hash: " + calculateHashForBlock(newBlock) + " " + newBlock.hash);
        return false;
    }
    return true;
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

// WARNING!! you can modify the following implementaion according to your own consensus design.
// current consensus: the longest chain rule
function replaceChain(newBlocks) {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        const nw = require("./network");

        console.log("Received blockchain is valid. Replacing current blockchain with received blockchain");
        blockchain = newBlocks;
        nw.broadcast(nw.responseLatestMsg());
    } else {
        console.log("Received blockchain invalid");
    }
}

module.exports = {
    generateNextBlock,
    getLatestBlock,
    getBlockchain,
    addBlock,
    replaceChain
};
