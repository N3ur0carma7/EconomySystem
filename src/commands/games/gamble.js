const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    callback: (client, interaction) => {

    },

    name: 'gamble',
    description: "Vous permet de parier de l'argent.",
    devOnly: true,
    //testOnly: true,
    //deleted: true,
    options: [
        {
            name: 'amount',
            description: "Le montant à parier",
            type: ApplicationCommandOptionType.Number,
        }
    ]
}