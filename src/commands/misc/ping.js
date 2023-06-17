const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    embed = new EmbedBuilder()
      .setTitle('Ping :')
      .setDescription(`Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`)
      .setColor('Blue');

    interaction.editReply({ embeds: [embed] });
  },

  name: 'ping',
  description: 'Replies with the bot ping!',
  // devOnly: true,
  // testOnly: true,
  // deleted: true,
};