const { Schema, model } = require('mongoose');

const roleIncomeSchema = new Schema({
    roleId: {
        type: String,
        required: true,
    },
    cooldown: {
        type: Number,
        required: true,
    },
    salaryAmount: {
        type: Number,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
});

module.exports = model('Role Incomes', roleIncomeSchema);