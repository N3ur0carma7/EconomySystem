const { Schema, model, models } = require('mongoose');

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

models.exports = model('Role Incomes', roleIncomeSchema);