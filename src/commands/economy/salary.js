const { Client, Interaction, EmbedBuilder, Message } = require('discord.js');
const User = require('../../models/User');
const Cooldown = require('../../models/Cooldown');
const Role = require('../../models/RoleIncomes');

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

        const userId = interaction.member.id;
        const guildId = interaction.guild.id;

        try {
            interaction.deferReply();

            let user = await User.find({ userId: userId, guildId: guildId });

            if (!user) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${userId}>, vous n'avez pas encore de compte banquaire. Pour en créer un veillez exécuter /daily.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            const userRoles = interaction.member.roles.cache;
            const roleIds = userRoles.map((role) => role.id);
            let hasRole = await Role.find({
                  guildId: guildId, 
                  roleId: { $in: roleIds } 
            });

            if (!hasRole) {
                interaction.editReply('Lol it worked :wink:');
            }

        } catch (error) {
            console.log(`Error with command /salary : ${error}`)
            interaction.deferReply();
            embed = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code de la commande. Si cela se reproduit, veillez contacter @Kastocarma.')
                .setColor('Red');
            interaction.editReply({ embeds: [embed] });
        }
    },

    name: 'salary',
    description: "Permet de recevoir son salaire, seulement si on a un job.",
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
}