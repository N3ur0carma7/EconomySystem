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
                .setDescription(`Voici les objets de votre inventaire, <@${userId}> :`)
                .setColor('Blue');
            
            inventory.items.forEach((item, index) => {
                if (item.usable === false) {
                    useAble = "Non."
                } else {
                    useAble = "Oui."
                }
                embed.addFields({ name: `${index + 1}. ${item.name}`, value: `Quantitée : ${item.quantity}. \n Utilisable : ${useAble}`, inline: true });
            });

            interaction.editReply({ embeds: [embed] });

            const filter = (message) => message.author.id === userId;
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

            collector.on('collect', async (message) => {
                const input = message.content;

                if (input.toLowerCase() === "stop") {
                    collector.stop();
                    embed1 = new EmbedBuilder()
                        .setTitle('Arrêt :')
                        .setDescription(`Vous avez arrêté la session d\'utilisation manuellement. <@${userId}>`)
                        .setColor('Blue');
                    message.reply({ embeds: [embed1] });
                    return;
                }

                if (isNaN(input)) {
                    embed1 = new EmbedBuilder()
                        .setTitle('Erreur :')
                        .setDescription('Veuillez entrer le numéro de l\'objet que vous souhaitez utiliser.')
                        .setColor('Red');
                    message.reply({ embeds: [embed1] });
                    return;
                }

                const itemIndex = parseInt(input) - 1;
                const inventoryItems = await inventory.items.find(item1 => item1.name)
                const itemNumbers = await inventoryItems.length;

                if (itemIndex < 0 || itemIndex > itemNumbers) {
                    embed1 = new EmbedBuilder()
                        .setTitle('Erreur :')
                        .setDescription('Numéro de l\'objet invalide.')
                        .setColor('Red');
                    message.reply({ embeds: [embed1] });
                    return;
                }

                const selectedItem = await inventory.items[itemIndex];

                if (selectedItem?.usable === false) {
                    embed1 = new EmbedBuilder()
                        .setTitle('Erreur :')
                        .setDescription('Vous ne pouvez pas utiliser un item inutilisable :/')
                        .setColor('Red');
                    message.reply({ embeds: [embed1] });
                    return;
                }

                const existingItem = inventory.items.find(item => item.name === selectedItem?.name);

                if (!existingItem || existingItem.quantity <= 0) {
                    embed1 = new EmbedBuilder()
                        .setTitle('Erreur :')
                        .setDescription('Cet item n\'est pas dans votre inventaire ou n\'existe pas.')
                        .setColor('Red');
                    message.reply({ embeds: [embed1] });
                    return;
                } else {
                    existingItem.quantity--;
                }

                await inventory.save();

                if (existingItem.name === "Lootbox Cartes") {
                    lootboxOpen(client, interaction, userId, guildId);
                }

                embed1 = new EmbedBuilder()
                    .setTitle('Succès :')
                    .setDescription(`Vous avez utilisé un(e) **${selectedItem.name}**! Il vous en reste **${selectedItem.quantity}** !`)
                    .setColor('Green')
                message.reply({ embeds: [embed1] });
            });

            collector.on('end', (used, reason) => {
                if (reason === 'time') {
                    if (used.size === 0) {
                        embed1 = new EmbedBuilder()
                            .setTitle('Session expiré :')
                            .setDescription(`La session d'utilisation a expiré. Veillez réessayer <@${userId}>.`)
                            .setColor('Red');
                        interaction.followUp({ embeds: [embed1] });
                    } else {
                        embed1 = new EmbedBuilder()
                            .setTitle('Session terminée :')
                            .setDescription(`La session d'utilisation est terminée <@${userId}>.`)
                            .setColor('Blue');
                        interaction.followUp({ embeds: [embed1] });
                    }
                }
            })

        } catch (error) {
            console.error(`Error with /use: ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.reply({ embeds: [embed1] });
        }
    },

    name: 'use',
    description: "Affiche les objets de ton inventaire et te permet de les utiliser.",
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
};
