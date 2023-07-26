const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "Vous ne pouvez que exécuter cette commande dans un serveur",
                ephemeral: true,
            });
        }

        const setAmount = interaction.options.get('amount').value;

        try {
            await interaction.deferReply();

            
        } catch (error) {
            console.log(`Error with /roulette : ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.editReply({ embeds: [embed1] });
        }
    },

    name: 'roulette',
    description: "Permet de parier avec la roulette russe",
    devOnly: true,
    //testOnly: true,
    //deleted: true,
    options: [
        {
            name: 'amount',
            description: "Le montant à parier sur la roulette.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ]
}