const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    event: { type: String, required: true },
    blockHash: { type: String, required: true },
    blockNumber: { type: String, required: true },
    transactionHash: { type: String, required: true },
    gasUsed: { type: String, required: true },
    timestamp: { type: String, required: true },
    numberPlate: { type: String, required: true },
    marca: { type: String, required: false },
    modelo: { type: String, required: false },
    color: { type: String, required: true },
    serialNumber: { type: String, required: true },
    motorNumber: { type: String, required: true },
    reason: { type: String, required: true },
    photos: { type: String, required: false },
    documents: { type: String, required: false },
    ownersId: { type: String, required: true },
    ownersNames: { type: String, required: true },
    employeeAddress: { type: String, required: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);