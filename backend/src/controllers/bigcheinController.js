const { Ed25519Keypair, Transaction, Connection } = require('bigchaindb-driver');
const base58 = require('bs58');
const crypto = require('crypto');
const { Ed25519Sha256 } = require('crypto-conditions');

const API_PATH = 'http://95.164.32.14:9984/';

class UploadController {
    constructor() {
        this.conn = new Connection(API_PATH);
    }

    async uploadFile(fileBuffer, fileName, privateKey) {
        try {
            const fileContentBase64 = fileBuffer.toString('base64');
            const keyPair = this._generateKeyPairFromPrivateKey(privateKey);

            const assetData = {
                fileContent: fileContentBase64,
                filename: fileName
            };

            const metaData = {
                name: fileName
            };

            const txCreate = Transaction.makeCreateTransaction(
                assetData,
                metaData,
                [Transaction.makeOutput(Transaction.makeEd25519Condition(keyPair.publicKey))],
                keyPair.publicKey
            );

            const txSigned = Transaction.signTransaction(txCreate, privateKey);

            const retrievedTx = await this.conn.postTransactionCommit(txSigned);
            return {
                success: true,
                transactionId: retrievedTx.id,
                message: 'Transaction successfully posted.'
            };
        } catch (error) {
            console.error('Error in uploadFile:', error);
            throw new Error('Failed to upload file and post transaction.');
        }
    }

    _generateKeyPairFromPrivateKey(privateKey) {
        const privateKeyBuffer = base58.decode(privateKey);
        return new Ed25519Keypair(privateKeyBuffer);
    }
}

module.exports = {UploadController};