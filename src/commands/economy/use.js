const { Client, Interaction, EmbedBuilder } = require('discord.js');
const Inventory = require('../../models/Inventory');
const lootboxOpen = require('../../functions/use/lootbox');


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

            const userId = interaction.user.id;
            const guildId = interaction.guild.id; // Modification : utilisation de interaction.guild.id au lieu de interaction.guildId

            const inventory = await Inventory.findOne({ userId: userId });

            if (!inventory) {
                inventory = new Inventory({ userId, guildId });
                await inventory.save();
            }

            const embed = new EmbedBuilder()
                .setTitle('Utiliser :')
                .setDescription(`Voici les objets de votre inventaire, <@${userId}> :`);
            
            inventory.items.forEach((item, index) => {
                if (item.usable === false) {
                    useAble = "Non."
                } else {
                    useAble = "Oui."
                }
                embed.addFields({ name: `${index + 1}. ${item.name}`, value: `Quantitée : ${item.quantity}. \n Utilisable : ${useAble}`});
            });

            interaction.editReply({ embeds: [embed] });

            const filter = (message) => message.author.id === userId;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

            collector.on('collect', async (message) => {
                const input = message.content;

                if (isNaN(input)) {
                    message.reply('Veuillez entrer le numéro de l\'objet que vous souhaitez utiliser.');
                    return;
                }

                const itemIndex = parseInt(input) - 1;
                const inventoryItems = await inventory.items.find(item1 => item1.name)
                const itemNumbers = inventoryItems.length;

                if (itemIndex < 0 || itemIndex > itemNumbers) {
                    message.reply('Invalid object number.');
                    return;
                }

                const selectedItem = inventory.items[itemIndex];

                if (selectedItem?.usable === false) {
                    message.reply('Vous ne pouvez pas utiliser un item inutilisable :/');
                    return;
                }

                const existingItem = inventory.items.find(item => item.name === selectedItem?.name);

                if (!existingItem || existingItem.quantity <= 0) {
                    message.reply('Cet item n\'est pas dans votre inventaire ou n\'existe pas.');
                    return;
                } else {
                    existingItem.quantity--;
                }

                await inventory.save();

                if (existingItem.name === "Lootbox Cartes") {
                    lootboxOpen(client, interaction, userId, guildId);
                }

                message.reply(`Vous avez utilisé un ${selectedItem.name}!`);
            });

            collector.on('end', (used) => {
                if (used.size === 0) {
                    interaction.followUp(`La session d'utilisation a expiré. Veillez réessayer <@${userId}>.`)
                } else {
                    interaction.followUp(`La session d'utilisation est terminée <@${userId}>.`)
                }
            })

        } catch (error) {
            console.error('Erreur lors de l\'exécution de la commande "use":', error);
            interaction.editReply('Une erreur s\'est produite lors de l\'exécution de la commande. Veuillez réessayer ultérieurement.');
        }
    },

    name: 'use',
    description: "Affiche les objets de ton inventaire et te permet de les utiliser.",
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
};
