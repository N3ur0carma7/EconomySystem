const { Client, Interaction, EmbedBuilder, time } = require('discord.js');
const Inventory = require('../../models/Inventory');
const User = require('../../models/User');
/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */
module.exports = async (client, interaction, userId, guildId) => {
    try {
        const inventory = await Inventory.findOne({ userId: userId, guildId: guildId });
        const currentVersionInventory = inventory.__v;
        const user = await User.findOne({ userId: userId, guildId: guildId });
        const currentVersionUser = user.__v;
        const currentDate = Date.now();
        const existingItem = await inventory.items.find(item => item.name === `Ticket du Casino`);

        if (user.casinoEnd > currentDate) {
            existingItem.quantity++;

            await inventory.save();

            const updatedInventory = await Inventory.findOneAndUpdate(
                { userId: userId, guildId: guildId, __v: currentVersionInventory },
                { items: inventory.items },
                { new: true }
            );

            if (!updatedInventory) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription('Vous utilisez trop vite vos Tickets de casino ! Si vous continuez, vous êtes susceptible d\'en perdre.')
                    .setColor(0xf50505);
                interaction.reply({ embeds: [embed] });
                return; 
            };

            embed = new EmbedBuilder()
                .setTitle('Erreur :')
                .setDescription("Vous avez déjà un ticket de casino actif. Le ticket que vous venez d'utiliser vous a été remboursé.")
                .setColor('Red');
            interaction.followUp({ embeds: [embed] });
        } else {
            const gameTime = currentDate+3600000;

            user.casinoEnd = gameTime;

            await user.save();

            const updatedUser = await User.findOneAndUpdate(
                { userId: userId, guildId: guildId, __v: currentVersionUser },
                { casinoEnd: gameTime },
                { new: true }
            );

            if (!updatedUser) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription('Vous utilisez trop vite vos Tickets de casino ! Si vous continuez, vous êtes susceptible d\'en perdre.')
                    .setColor(0xf50505);
                interaction.reply({ embeds: [embed] });
                return; 
            };

            embed = new EmbedBuilder()
                .setTitle('Succès :')
                .setDescription(`Votre ticket à été consommé avec succès ! \n Vous pouvez jouer aux jeux d'argents pendant 1 heure.`)
                .setColor('Green');
            interaction.followUp({ embeds: [embed] });
        }

    } catch (error) {
        errEmbed = new EmbedBuilder()
            .setTitle('Erreur Code :')
            .setDescription("Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma")
            .setColor('Red');
        interaction.followUp({ embeds: [errEmbed] });
        console.log(`Error while using "CasinoTicket" : ${error}`);
    }
}