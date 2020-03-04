"use strict";
import { SHA256, deepCopy } from "./modules"; // utils

// import { db } from "./database";

class BlockHeader {
    constructor(version, index, previousHash, timestamp, merkleRoot, difficulty, nonce) {
        this.version = version;
        this.index = index;
        this._previousHash = previousHash;
        this.timestamp = timestamp;
        this.merkleRoot = merkleRoot;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }

    get previousHash() {
        return this._previousHash.toUpperCase(); // always return upper case letters.
    }

    /**
     * @param {string} newPreviousHash
     */
    set previousHash(newPreviousHash) {
        this._previousHash = newPreviousHash;
    }

    hash() {
        return SHA256([
            this.version,
            this.index,
            this.previousHash,
            this.timestamp,
            this.merkleRoot,
            this.difficulty,
            this.nonce
        ]);
    }

    /**
     * TODO
     */
    // print()
}

class Block {
    constructor(header, data) {
        this.header = deepCopy(header);
        this.data = deepCopy(data);
    }

    hash() {
        return this.header.hash();
    }

    encode() {
        return JSON.stringify(this);
    }

    decode(encodedBlock) {
        decodedBlock = JSON.parse(encodedBlock);
        objectifiedBlock = Object.assign(new Block(), decodedBlock);
        objectifiedBlock.header = Object.assign(new BlockHeader(), objectifiedBlock.header);
        return objectifiedBlock;
    }

    /**
     * TODO
     */
    // save()
    // load()
    // print()
}

export default {
    BlockHeader,
    Block
};
