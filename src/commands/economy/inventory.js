const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const Inventory = require('../../models/Inventory');

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    const targetUser = interaction.options.get('user')?.value || interaction.user.id;

    try {
        await interaction.deferReply();
      const user = await User.findOne({ userId: targetUser });
      if (!user) {
        interaction.editReply("L'utilisateur spécifié n'a pas de compte banquaire, et donc d'items.");
        return;
      }

      const inventory = await Inventory.findOne({ userId: user.userId });
      if (!inventory) {
        interaction.editReply("L'utilisateur spécifié n'a pas d'inventaire.");
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`Inventaire :`)
        .setDescription(`Voici les objets dans l\'inventaire de <@${targetUser}> :`);

      inventory.items.forEach((item) => {
        embed.addFields({ name : item.name, value: `Quantité : ${item.quantity}`});
      });

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors de l\'exécution de la commande "inventory":', error);
      interaction.followUp('Une erreur s\'est produite lors de l\'exécution de la commande. Veuillez réessayer ultérieurement.');
    }
  },

  name: 'inventory',
  description: "Affiche l'inventaire d'un utilisateur.",
  options: [
    {
      name: 'user',
      description: 'Utilisateur dont vous souhaitez afficher l\'inventaire',
      type: ApplicationCommandOptionType.User,
    },
  ],
};