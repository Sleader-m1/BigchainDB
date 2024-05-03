const driver = require('bigchaindb-driver')
const API_PATH = 'http://95.164.32.14:9984//api/v1/'
const conn = new driver.Connection(API_PATH)

const alice = new driver.Ed25519Keypair()
const bob = new driver.Ed25519Keypair()
const chris = new driver.Ed25519Keypair()

console.log('Alice: ', alice.publicKey)
console.log('Bob: ', bob.publicKey)
console.log('Chris: ', chris.publicKey)

// Define the asset to store, in this example
// we store a bicycle with its serial number and manufacturer
assetdata = {
    'bicycle': {
        'serial_number': 'cde',
        'manufacturer': 'Bicycle Inc.',
    }
}

var txTransferBobSigned;

// Construct a transaction payload
const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
    assetdata,
    {'meta': 'meta'},
    // A transaction needs an output
    [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(alice.publicKey))
    ],
    alice.publicKey
)

// Sign the transaction with private keys of Alice to fulfill it
const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)
console.log('\n\nPosting signed create transaction for Alice:\n', txCreateAliceSimpleSigned)

conn.postTransactionCommit(txCreateAliceSimpleSigned)

    // Transfer bicycle from Alice to Bob
    .then(() => {
        const txTransferBob = driver.Transaction.makeTransferTransaction(
            [{ tx: txCreateAliceSimpleSigned, output_index: 0 }],
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(bob.publicKey))],
            {'newOwner': 'Bob'}
        )

        // Sign with alice's private key
        txTransferBobSigned = driver.Transaction.signTransaction(txTransferBob, alice.privateKey)
        console.log('\n\nPosting signed transaction to Bob:\n', txTransferBobSigned)

        // Post with commit so transaction is validated and included in a block
        return conn.postTransactionCommit(txTransferBobSigned)
    })

    // Second transfer of bicycle from Bob to Chris
    .then(tx => {
        const txTransferChris = driver.Transaction.makeTransferTransaction(
            [{ tx: txTransferBobSigned, output_index: 0 }],
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(chris.publicKey))],
            {'newOwner': 'Chris'}
        )

        // Sign with bob's private key
        let txTransferChrisSigned = driver.Transaction.signTransaction(txTransferChris, bob.privateKey)
        console.log('\n\nPosting signed transaction to Chris:\n', txTransferChrisSigned)

        // Post with commit so transaction is validated and included in a block
        return conn.postTransactionCommit(txTransferChrisSigned)
    })
    .then(() => conn.listOutputs(alice.publicKey, true))
    .then(listSpentOutputs => {
        console.log("\nSpent outputs for Alice: ", listSpentOutputs.length) // Spent outputs: 1
        return conn.listOutputs(alice.publicKey, false)
    })
    .then(listUnspentOutputs => {
        console.log("Unspent outputs for Alice: ", listUnspentOutputs.length) // Unspent outputs: 0
        return conn.listOutputs(bob.publicKey, true)
    })
    .then(listSpentOutputs => {
        console.log("\nSpent outputs for Bob: ", listSpentOutputs) // Spent outputs: 1
        return conn.listOutputs(bob.publicKey, false)
    })
    .then(listUnspentOutputs => {
        console.log("Unspent outputs for Bob: ", listUnspentOutputs) // Unspent outputs: 0
        return conn.listOutputs(chris.publicKey, true)
    })
    .then(listSpentOutputs => {
        console.log("\nSpent outputs for Chris: ", listSpentOutputs) // Spent outputs: 0
        return conn.listOutputs(chris.publicKey, false)
    })
    .then(listUnspentOutputs => {
        console.log("Unspent outputs for Chris: ", listUnspentOutputs.length) // Unspent outputs: 1
    })
    .catch(res => {console.log(res)})