const BankLinked = require("../models/bankLinkedModel");
const bankLinked = async (req, res, next) => {
    const { bank_acc_name, bank_acc_num, routing_num, bank_location } = req.body;
    try {
        const bankCheck = await BankLinked.findOne({ bank_owner: req.user._id })
        if (bankCheck) {
            return res.status(302).json({ error: { "bank": "you have already linked bank!" } })
        }
        const created = await BankLinked.create({
            bank_acc_name, bank_acc_num, routing_num, bank_location, bank_owner: req.user._id,
        })
        return res.status(200).json({ message: 'you have successfully bank linked!', data: created })
    }
    catch (error) {
        next(error)
    }
}
const bankLinkedUpdate = async (req, res, next) => {
    const { bank_acc_name, bank_acc_num, routing_num, bank_location } = req.body;
    try {
        const bankUpdated = await BankLinked.findOneAndUpdate({ _id: req.params.id }, {
            bank_acc_name, bank_acc_num, routing_num, bank_location
        }, { new: true });
        return res.status(200).json({ message: "you have successfully updated bank information!", data: bankUpdated })
    }
    catch (error) {
        next(error)
    }
}

const bankLinkedRemoved = async (req, res, next) => {
    try {
        await BankLinked.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) {
                return res.status(400).json({ error: { bank: 'bank removed failed! please try again! provide valid credentials' } })
            } else {
                return res.status(200).json({ message: "you have successfully removed bank account!" })
            }
        });
    }
    catch (error) {
        next(error)
    }
}
module.exports = { bankLinked, bankLinkedUpdate, bankLinkedRemoved }