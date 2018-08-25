const CryptoJS = require("crypto-js");
const _calculateHashForBlock = require("./main");




const BLOCK_GENERATION_INTERVAL=10;
const DIFFICULTY_ADJUSTMENT_INTERVAL=10;


function _hashMatchesDifficulty(hash,difficulty){
    const hashInBinary=parseInt(hash,16).toString(2);  //hash in hex to binary
    const requiredPrefix='0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
}
exports._hashMatchesDifficulty = _hashMatchesDifficulty;


function _findBlock(index, previousHash, timestamp, data,difficulty){

    let nonce=0;
    while(ture){
        const hash=this.calculateHashForBlock(index, hash, previousHash, timestamp, data,difficulty,nonce)  
        if (this.hashMatchesDifficulty(hash,difficulty)){
            return new Block(index, hash, previousHash, timestamp, data,difficulty,nonce);
        }
        nonce++
    }
}
exports._findBlock=_findBlock;


function _getdifficulty(){
    const latestBlock=this.chain[this.chain.length-1];
    if(latestBlock.index%DIFFICULTY_ADJUSTMENT_INTERVAL===0&&latestBlock.index!==0){
        return getAdjustedDifficulty(latestBlock);
    }else{
        return latestBlock.difficulty;
    }
}
exports._getdifficulty=_getdifficulty;

function _getAdjustedDifficulty(latestBlock){
    const preAdjustmentBLock=this.chain[this.chain.length-DIFFICULTY_INTERVAL];
    const timeExpected =BLOCK_GENERATION_INTERVAL*DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken=latestBlock.timestamp-preAdjustedBlock.timestamp;
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
exports._getAdjustedDifficulty=_getAdjustedDifficulty;
