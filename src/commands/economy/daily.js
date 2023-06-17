const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

const dailyAmount = 1000;

module.exports = {
  name: 'daily',
  description: 'Collecte ta récompense quotidienne.',
  // devOnly: true,
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

    try {
      trigger = 0;
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          embed = new EmbedBuilder()
            .setTitle('Capitaliste !')
            .setDescription(`Tu as déjà récupéré ta récompense quotidienne <@${interaction.member.id}>! Reviens demain! :money_with_wings: :money_with_wings: :money_with_wings: `)
            .setColor('Red')
          interaction.editReply({ embeds: [embed] });
          return;
        }
        
        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          balance: 100,
          lastDaily: new Date(),
        });
        trigger = 1;
      }

      user.balance += dailyAmount;
      await user.save();

      if (trigger === 1) {
        embed = new EmbedBuilder()
          .setTitle('Récompense Quotidienne :')
          .setDescription(`<@${interaction.member.id}>, votre compte banquaire a été créé. La récompense quotidienne vous donne **${dailyAmount}** kastocoins sur votre compte, vous avez donc au total **${user.balance}** kastocoins.`)
          .setColor('Green');
      } else {
        embed = new EmbedBuilder()
          .setTitle('Récompense Quotidienne :')
          .setDescription(`**${dailyAmount}** kastocoins ont été ajoutés à votre compte <@${interaction.member.id}>. Le nouveau montant de votre compte est de **${user.balance}** kastocoins.`)
          .setColor('Green');
      }

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /daily: ${error}`);
      embed1 = new EmbedBuilder()
        .setTitle('Erreur Code :')
        .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
        .setColor('Red');
      interaction.reply({ embeds: [embed1] });
    }
  },
};