const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
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
                content: 'Vous ne pouvez que exécuter cette commande dans un serveur.',
                ephemeral: true,
            });
            return;
        }

        const targetUserId = interaction.options.get('target-user')?.value || interaction.member.id;

        await interaction.deferReply();

        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

        if (!user) {
            interaction.editReply(`<@${targetUserId}> n'a pas encore de compte banquaire.`);
            return;
        }

        const ownEmbed = new EmbedBuilder()
            .setTitle('Balance :')
            .setDescription(`<@${targetUserId}>, vous avez actuellement **${user.balance}** kastocoins sur votre compte.`);

        const targetEmbed = new EmbedBuilder()
            .setTitle('Balance :')
            .setDescription(`<@${targetUserId}> a actuellement **${user.balance}** kastocoins sur son compte.`);
        
        if (targetUserId === interaction.member.id) {
            interaction.editReply({ embeds: [ownEmbed] })
        } else {
            interaction.editReply({ embeds: [targetEmbed] })
        }
    }, 

    name: 'balance',
    description: "Show the balance of a user.",
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
    options:[
        {
            name: 'target-user',
            description: "Choisisez un utilisateur pour regarder son nombre de kastocoins.",
            type: ApplicationCommandOptionType.User,
        }
    ]
}