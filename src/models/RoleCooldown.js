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
    roles: [
        {
            roleId: {
                type: String,
            },
            endsAt: {
                type: Date,
            },
        }
    ],
});

module.exports = model('Role Cooldown', roleCooldownSchema);