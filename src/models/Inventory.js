const { Schema, model } = require('mongoose');

const inventorySchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    items: [
        {
            name: String,
            quantity: {
                type: Number,
                default: 0,
            },
            usable: Boolean,
        },
    ],
});

module.exports = new model('Inventory', inventorySchema);