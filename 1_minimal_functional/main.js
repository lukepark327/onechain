/*
// WARNING!! there are no implementation that can interact with the user.
// use the second implementation(2/main.js) to communicate over HTTP.
*/

'use strict';
var CryptoJS = require("crypto-js");

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
function getGenesisBlock(){
    return new Block(0, "", 1535165503, "Genesis block", "a12eab42aa059b74b1ee08310a88b56e64c3d90cf803445250dc2f209833d6d2");
};

// WARNING!! the current implementation is stored in local volatile memory.
// you may need a database to store the data permanently.
var blockchain = [getGenesisBlock()];

// get new block
// blockData can be anything; transactions, strings, values, etc.
function generateNextBlock(blockData){
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};

// get hash
function calculateHashForBlock(block){
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};

function calculateHash(index, previousHash, timestamp, data){
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

// add new block
// need validation test
function addBlock(newBlock){
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};

// validation test of new block
function isValidNewBlock(newBlock, previousBlock){
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

// validation test of blockchain
function isValidChain(blockchainToValidate){
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
function getLatestBlock(){return blockchain[blockchain.length - 1]};
