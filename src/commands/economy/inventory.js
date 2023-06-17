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
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });
      return;
    }

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
        console.error(`Error with /inventory: ${error}`);
        embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
        interaction.reply({ embeds: [embed1] });
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