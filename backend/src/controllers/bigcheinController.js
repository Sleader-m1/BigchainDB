const { Ed25519Keypair, Transaction, Connection } = require('bigchaindb-driver');
const base58 = require('bs58');
const API_PATH = 'http://95.164.32.14:9984//api/v1/';

function generateKeyPairFromPrivateKey(privateKey) {
    if (typeof privateKey !== 'string') {
        throw new TypeError('privateKey must be a string');
    }
    const privateKeyBuffer = base58.decode(privateKey);
    return new Ed25519Keypair(privateKeyBuffer);
}

async function uploadFile(fileBuffer, fileName, privateKey) {
    try {
        console.log("Received privateKey:", privateKey); // Логируем ключ, чтобы убедиться в его наличии и формате
        console.log("Type of privateKey:", typeof privateKey); // Проверяем тип ключа

        if (typeof privateKey !== 'string') {
            throw new TypeError('privateKey must be a string and it is required');
        }

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
async function fetchTransactions(publicKey) {
    const conn = new Connection(API_PATH);
    try {
        // Поиск всех транзакций, где данный ключ использовался для создания ассетов
        const transactions = await conn.searchAssets(publicKey);
        return transactions;
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        throw error; // Передача ошибки на уровень выше для обработки
    }
}

async function getUploadedFiles(req, res) {
    const publicKey = req.query.publicKey;
    const conn = new Connection(API_PATH);
    if (!publicKey) {
        return res.status(400).json({ error: 'Public key parameter is required' });
    }

    try {
        // Получаем список непотраченных выходов для данного публичного ключа
        const unspentOutputs = await conn.listOutputs(publicKey, false);

        // Параллельно получаем детальную информацию о каждой транзакции
        const transactions = await Promise.all(
            unspentOutputs.map(output => 
                conn.getTransaction(output.transaction_id).catch(err => {
                    console.error(`Failed to fetch transaction details for ID: ${output.transaction_id}`, err);
                    return null; // Возвращаем null в случае ошибки, чтобы не останавливать весь процесс
                })
            )
        );

        // Фильтруем null значения, которые могли возникнуть из-за ошибок
        const validTransactions = transactions.filter(tx => tx !== null);

        res.json({
            message: 'Unspent transactions retrieved successfully',
            transactions: validTransactions
        });
    } catch (error) {
        console.error('Error in getting unspent transactions:', error);
        res.status(500).json({ error: 'Failed to fetch unspent transaction details' });
    }
};

module.exports = { uploadFile, getUploadedFiles};

