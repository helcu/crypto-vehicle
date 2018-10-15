const express = require('express');
const router = express.Router();

const Transaction = require('../models/transaction');

router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json({
            data: transactions,
            status: 'Tasks listed'
        });
    }
    catch (err) {
        console.error(err);
        res.send(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            event, blockHash, blockNumber, transactionHash, gasUsed, timestamp,
            numberPlate, marca, modelo, color, serialNumber, motorNumber,
            reason, photos, documents, ownersId, ownersNames, employeeAddress
        } = req.body;
        const transaction = new Transaction({
            event, blockHash, blockNumber, transactionHash, gasUsed, timestamp,
            numberPlate, marca, modelo, color, serialNumber, motorNumber,
            reason, photos, documents, ownersId, ownersNames, employeeAddress,
        });
        await transaction.save();
        res.json({
            data: transaction,
            status: 'Task saved'
        });
    } catch (err) {
        console.error(err);
        res.send(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {
            event, blockHash, blockNumber, transactionHash, gasUsed, timestamp,
            numberPlate, marca, modelo, color, serialNumber, motorNumber,
            reason, photos, documents, ownersId, ownersNames, employeeAddress
        } = req.body;
        const transaction = {
            event, blockHash, blockNumber, transactionHash, gasUsed, timestamp,
            numberPlate, marca, modelo, color, serialNumber, motorNumber,
            reason, photos, documents, ownersId, ownersNames, employeeAddress,
        };
        await Transaction.findByIdAndUpdate(req.params.id, transaction);
        res.json({
            data: transaction,
            status: 'Task updated'
        });
    } catch (err) {
        console.error(err);
        res.send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndRemove(req.params.id);
        res.json({
            data: req.params.id,
            status: 'Task deleted'
        });
    } catch (err) {
        console.error(err);
        res.send(err);
    }
});

module.exports = router