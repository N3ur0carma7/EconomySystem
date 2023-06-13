const { Client, Interaction, EmbedBuilder } = require('discord.js');
const Inventory = require('../../models/Inventory');
/**
 * 
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
module.exports = async (client, interaction, userId, guildId) => {
    try {
        const inventory = await Inventory.findOne({ userId, guildId });
        const randomCardNumber = Math.floor(Math.random() * 10)+1;
        const existingItem = inventory.items.find(item => item.name === `Carte ${randomCardNumber}`);
        if (!existingItem) {
            inventory.items.push({ name: `Carte ${randomCardNumber}`, quantity: 1, usable: true });
        } else {
            existingItem.quantity++;
        }
        interaction.followUp(`Tu as gagné la carte ${randomCardNumber} ! <@${userId}> !`);

        await inventory.save();
    } catch (error) {
        console.log(`Error executing function "lootboxOpen" : ${error}`);
        interaction.followUp(`Une erreur est survenue lors de l'utilisation de votre Lootbox <@${userId}>`);
    }
    
}