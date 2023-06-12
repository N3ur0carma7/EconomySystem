const { Client, Interaction } = require('discord.js');
const Inventory = require('../../models/Inventory');

module.exports = {
    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     */
    callback: async (interaction, client) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'Vous ne pouvez exécuter cette commande que dans un serveur.',
                ephemeral: true,
            });
            return;
        }

        const targetUser = interaction.user.id;
        try {
            await interaction.deferReply();
            
            const inventory = await Inventory.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            if (!inventory) {
                interaction.editReply(`Vous n'avez pas d'inventaire <@${interaction.user.id}> !`);
                return;
            }
            const embed = new EmbedBuilder()
                .setTitle(`Utiliser :`)
                .setDescription(`Voici les objets dans votre inventaire :`);

            inventory.items.forEach((item) => {
                if (item.usable === false) {
                    useAble = "Non.";
                } else {
                    useAble = "Oui.";
                }
            embed.addFields({ name : item.name, value: `Quantité : ${item.quantity} \n Utilisable : ${useAble}`});
        });

        interaction.editReply({ embeds: [embed] });

        const filter = (message) => message.author.id === targetUserId;
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la commande "use":', error);
            interaction.followUp('Une erreur s\'est produite lors de l\'exécution de la commande. Veuillez réessayer ultérieurement.');
        }
    },

    name: 'use',
    description: "Permet d'utiliser un item (Utilisable) de votre inventaire.",
    // devOnly: true,
    testOnly: true,
    // deleted: true,
}