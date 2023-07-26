const { Client, Interaction, EmbedBuilder } = require('discord.js');
const shopItems = require('../../shopItems.json');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'Vous ne pouvez exécuter cette commande que dans un serveur.',
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            if (shopItems.length === 0) {
                interaction.editReply('La boutique ne contient aucun items pour le moment.');
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('Shop')
                .setDescription('Items en vente dans la boutique :')
                .setColor('Blue');
            
            shopItems.forEach(item => {
                embed.addFields({ name:`${item.name}`, value: `Prix : **$${item.price}**.`, inline: true });
            });

            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`Error while executing /shop command : ${error}`);
            embed = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code de la commande. Si cela se reproduit, veillez contacter @Kastocarma.')
                .setColor('Red');
            interaction.reply({ embeds: [embed] });
        }
    },

    name: 'shop',
    description: "Shows shop items.",
};