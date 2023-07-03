const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "Vous ne pouvez que exécuter cette commande dans un serveur.",
                ephemeral: true,
            });
        };
    },

    name: 'company-create',
    description: "Permet de créer sa propre entreprise.",
    //testOnly: true,
    devOnly: true,
    //deleted: true,
}