const driver = require('bigchaindb-driver')


function generateEd25519KeyPair() {
    return new driver.Ed25519Keypair();
}

module.exports = {generateEd25519KeyPair}
