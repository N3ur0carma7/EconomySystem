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
        embed1 = new EmbedBuilder()
          .setTitle('Erreur :')
          .setDescription(`<@${targetUser}> n'a pas de compte banquaire, et donc d'items.`)
          .setColor('Red');
        interaction.editReply({ embeds: [embed1] });
        return;
      }

      const inventory = await Inventory.findOne({ userId: user.userId });
      if (!inventory) {
        embed1 = new EmbedBuilder()
          .setTitle('Erreur :')
          .setDescription(`<@${targetUser}> n'a pas d'inventaire.`)
          .setColor('Red');
        interaction.editReply({ embeds: [embed1] });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`Inventaire :`)
        .setDescription(`Voici les objets dans l\'inventaire de <@${targetUser}> :`)
        .setColor('Blue');

      inventory.items.forEach((item) => {
        if (item.usable === false) {
          useAble = "Non.";
        } else {
          useAble = "Oui.";
        }
        embed.addFields({ name : item.name, value: `Quantité : ${item.quantity} \n Utilisable : ${useAble}`, inline: true });
      });

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande "inventory":', error);
        embed1 = new EmbedBuilder()
          .setTitle('Erreur Code :')
          .setDescription(`Une erreur s'est produite dans le code de la commande. Si cela se reproduit, veillez contacter @Kastocarma.`)
          .setColor('Red');
        interaction.followUp({ embeds: [embed1] });
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
  // devOnly: true,
  // testOnly: true,
  // deleted: true,
};