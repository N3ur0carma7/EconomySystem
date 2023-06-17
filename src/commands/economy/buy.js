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
                embed1 = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription('La boutique est actuellement vide.')
                    .setColor(0xf50505);
                interaction.editReply({ embeds: [embed1] });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('Boutique')
                .setDescription('Voici les objets disponibles dans la boutique :')
                .setColor(0x02eefa);
            
            shopItems.forEach((item, index) => {
                embed.addFields({ name: `${index + 1}. ${item.name}`, value: `Prix : ${item.price} kastocoins.`, inline: true });
            });

            interaction.editReply({ embeds: [embed] });

            const filter = (message) => message.author.id === userId;
            collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

            collector.on('collect', async (message) => {
                const input = message.content;

                if (input.toLowerCase() === "stop") {
                    collector.stop();
                    embed1 = new EmbedBuilder()
                        .setTitle('Arrêt :')
                        .setDescription(`Vous avez arrêté la session d\'achat manuellement. <@${userId}>`)
                        .setColor(0x02eefa);
                    message.reply({ embeds: [embed1] });
                    return;
                }

                if (isNaN(input)) {
                    embed1 = new EmbedBuilder()
                        .setTitle('Erreur :')
                        .setDescription('Veuillez entrer le numéro de l\'objet que vous souhaitez acheter.')
                        .setColor(0xf50505);
                    message.reply({ embeds: [embed1] });
                    return;
                }

                const itemIndex = parseInt(input) - 1;

                if (itemIndex < 0 || itemIndex >= shopItems.length) {
                    embed1 = new EmbedBuilder()
                        .setTitle('Erreur :')
                        .setDescription('Numéro d\'objet invalide')
                        .setColor(0xf50505);
                    message.reply({ embeds: [embed1] });
                    return;
                }

                const selectedItem = shopItems[itemIndex];
                const totalPrice = selectedItem.price;

                if (user.balance < totalPrice) {
                    embed1 = new EmbedBuilder()
                        .setTitle('Paiement Refusé :')
                        .setDescription(`Vous n\'avez que **${user.balance}** kastocoins, l'item que vous souhaitez coute **${totalPrice}** kastocoins.`)
                        .setColor(0xf50505);
                    message.reply({ embeds: [embed1] });
                    return;
                }

                const existingItem = inventory.items.find(item => item.name === selectedItem.name);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    inventory.items.push({ name: selectedItem.name, quantity: 1, usable: selectedItem.usable });
                }

                user.balance -= totalPrice;

                await inventory.save();
                await user.save();

                embed1 = new EmbedBuilder()
                    .setTitle('Paiement Réussi :')
                    .setDescription(`Vous avez acheté un ${selectedItem.name} pour **${selectedItem.price}** kastocoins. Il vous reste **${user.balance}** kastocoins sur votre compte`)
                    .setColor(0x3cfa02);
                message.reply({ embeds: [embed1] });
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    if (collected.size === 0) {
                        embed1 = new EmbedBuilder()
                            .setTitle('Achat Expiré :')
                            .setDescription(`<@${interaction.user.id}>**La session d\'achat a expiré. Veuillez réessayer.**`)
                            .setColor(0xf50505);
                        interaction.followUp({ embeds: [embed1] });
                    } else {
                        embed1 = new EmbedBuilder()
                            .setTitle('Achat Terminé :')
                            .setDescription(`Session d'achat terminée <@${interaction.user.id}> ! Si tu souhaites voir/utiliser tes items, fait /inventory.`)
                            .setColor(0x02eefa);
                        interaction.followUp({ embeds: [embed1] });
                    }
                }
            });
        } catch (error) {
            console.error(`Error with /buy: ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.reply({ embeds: [embed1] });
        }
    },

    name: 'buy',
    description: "Affiche les objets de la boutique et permet d'acheter des objets.",
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
};
