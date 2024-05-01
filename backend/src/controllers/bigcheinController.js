const { Ed25519Keypair, Transaction, Connection } = require('bigchaindb-driver');
const base58 = require('bs58');
const API_PATH = 'http://83.222.9.173:9984/api/v1/';

// Функция для генерации ключевой пары из приватного ключа
function generateKeyPairFromPrivateKey(privateKey) {
    const privateKeyBuffer = base58.decode(privateKey);
    return new Ed25519Keypair(privateKeyBuffer);
}

// Функция для загрузки файла и отправки транзакции в BigchainDB
async function uploadFile(fileBuffer, fileName, privateKey) {
    try {
        const fileContentBase64 = fileBuffer.toString('base64');
        const keyPair = generateKeyPairFromPrivateKey(privateKey);

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

        const conn = new Connection(API_PATH);
        const retrievedTx = await conn.postTransactionCommit(txSigned);
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


module.exports = {uploadFile}