const ut = require("./utils");

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
        return ut.SHA256([
            this.version,
            this.index,
            this.previousHash,
            this.timestamp,
            this.merkleRoot,
            this.difficulty,
            this.nonce
        ]);
    }
}

class Block {
    constructor(header, data) {
        this.header = ut.deepCopy(header);
        this.data = ut.deepCopy(data);
    }

    hash() {
        return this.header.hash();
    }

    /**
     * TODO
     */
    // save()
    // load()
    // encode()
    // decode()
}

module.exports = {
    BlockHeader,
    Block
};
