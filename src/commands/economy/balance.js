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
        try {
            await interaction.deferReply();

            const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

            if (!user) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${targetUserId}> n'a pas encore de compte banquaire.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

        const ownEmbed = new EmbedBuilder()
            .setTitle('Balance :')
            .setDescription(`<@${targetUserId}>, vous avez actuellement **$${user.balance}** sur votre compte.`)
            .setColor('Blue');

        const targetEmbed = new EmbedBuilder()
            .setTitle('Balance :')
            .setDescription(`<@${targetUserId}> a actuellement **$${user.balance}** sur son compte.`)
            .setColor('Blue');
        
            if (targetUserId === interaction.member.id) {
                interaction.editReply({ embeds: [ownEmbed] })
            } else {
                interaction.editReply({ embeds: [targetEmbed] })
            }
        } catch (error) {
            console.log(`An error occured with /balance : ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.reply({ embeds: [embed1] });
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
            description: "Choisisez un utilisateur pour regarder l'argent qu'il a sur son compte.",
            type: ApplicationCommandOptionType.User,
        }
    ]
}