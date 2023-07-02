const { Schema, model } = require('mongoose');

const roleCooldownSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    roleId: {           
        type: String,
        required: true,
    },
    endsAt: {
        type: Date,
        default: 0,
    }
});

module.exports = model('Role Cooldown', roleCooldownSchema);