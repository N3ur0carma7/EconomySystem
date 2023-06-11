const { Client, Interaction, EmbedBuilder } = require('discord.js');
const shopItems = require('../../shopItems.json');
const Inventory = require('../../models/Inventory');
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
                content: 'Vous ne pouvez exécuter cette commande que dans un serveur.',
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            const userId = interaction.user.id;
            const guildId = interaction.guild.id; // Modification : utilisation de interaction.guild.id au lieu de interaction.guildId

            let inventory = await Inventory.findOne({ userId, guildId });
            let user = await User.findOne({ userId });

            if (!user) {
                user = new User({ userId });
                await user.save();
            }

            if (!inventory) {
                inventory = new Inventory({ userId, guildId });
                await inventory.save();
            }

            if (shopItems.length === 0) {
                interaction.editReply('La boutique est actuellement vide.');
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('Boutique')
                .setDescription('Voici les objets disponibles dans la boutique :');
            
            shopItems.forEach((item, index) => {
                embed.addFields({ name: `${index + 1}. ${item.name}`, value: `Prix : ${item.price} kastocoins.`});
            });

            interaction.editReply({ embeds: [embed] });

            const filter = (message) => message.author.id === userId;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

            collector.on('collect', async (message) => {
                const input = message.content;

                if (isNaN(input)) {
                    message.reply('Veuillez entrer le numéro de l\'objet que vous souhaitez acheter.');
                    return;
                }

                const itemIndex = parseInt(input) - 1;

                if (itemIndex < 0 || itemIndex >= shopItems.length) {
                    message.reply('Numéro d\'objet invalide.');
                    return;
                }

                const selectedItem = shopItems[itemIndex];
                const totalPrice = selectedItem.price;

                if (user.balance < totalPrice) {
                    message.reply('Vous n\'avez pas assez de kastocoins pour acheter cet objet.');
                    return;
                }

                const existingItem = inventory.items.find(item => item.name === selectedItem.name);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    inventory.items.push({ name: selectedItem.name, quantity: 1 });
                }

                user.balance -= totalPrice;

                await inventory.save();
                await user.save();

                message.reply(`Vous avez acheté un ${selectedItem.name} pour **${selectedItem.price}** kastocoins.`);
            });

            collector.on('end', (collected) => {
                if (collected.size === 0) {
                    interaction.editReply(`<@${interaction.user.id}>**La session d\'achat a expiré. Veuillez réessayer.**`);
                } else {
                    interaction.followUp(`Session d'achat terminée <@${interaction.user.id}>. Tu as acheté **${collected.size}** items.`);
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la commande "shop":', error);
            interaction.editReply('Une erreur s\'est produite lors de l\'exécution de la commande. Veuillez réessayer ultérieurement.');
        }
    },

    name: 'buy',
    description: "Affiche les objets de la boutique et permet d'acheter des objets.",
};
