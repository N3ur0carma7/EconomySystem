const { Client, Interaction, EmbedBuilder } = require('discord.js');
const Inventory = require('../../models/Inventory');
/**
 * 
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
module.exports = async (client, interaction, userId, guildId) => {
    try {
        const inventory = await Inventory.findOne({ userId: userId, guildId: guildId });
        const currentVersion = inventory.__v;
        const randomCardNumber = Math.floor(Math.random() * 10)+1;
        const existingItem = inventory.items.find(item => item.name === `Carte ${randomCardNumber}`);
        if (!existingItem) {
            inventory.items.push({ name: `Carte ${randomCardNumber}`, quantity: 1, usable: true });
        } else {
            existingItem.quantity++;
        }

        const updatedInventory = await Inventory.findOneAndUpdate(
            { userId: userId, guildId: guildId, __v: currentVersion },
            { items: inventory.items },
            { new: true }
          );
          
          if (!updatedInventory) {
            embed = new EmbedBuilder()
                .setTitle('Erreur :')
                .setDescription('Vous utilisez trop vite vos LootBox ! Si vous continuez, vous êtes susceptible d\'en perdre.')
                .setColor(0xf50505);
            interaction.reply({ embeds: [embed] });
            return; 
          }
          
          embed = new EmbedBuilder()
            .setTitle('Surprise...')
            .setDescription(`Tu as gagné la carte ${randomCardNumber} ! <@${userId}> !`)
            .setColor(0x02eefa);
          interaction.followUp({ embeds: [embed] });
    } catch (error) {
        console.log(`Error executing function "lootboxOpen" : ${error}`);
        embed = new EmbedBuilder()
            .setTitle('Erreur Code :')
            .setDescription(`Une erreur est survenue lors de l'utilisation de votre Lootbox <@${userId}>. Si cela se reproduit, veillez contacter @Kastocarma.`);
        interaction.followUp({ embeds: [embed] });
    }
    
}