const { Schema, model } = require('mongoose');

const roleIncomeSchema = new Schema({
    name: {
        type: String,
        default: 'Unnamed',
    },
    roleId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    salaryAmount: {
        type: Number,
        required: true,
    },
    cooldown: {
        type: Number,
        required: true,
    },

});

module.exports = model('Role Incomes', roleIncomeSchema);