const User = require('../../models/User');
const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction, EmbedBuilder } = require('discord.js');

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

        const targetUser = interaction.options.get('target-user').value;

        try {
            await interaction.deferReply();

            const query = {
                userId: targetUser,
                guildId: interaction.guild.id,
            }

            let user = await User.findOne(query);

            if (user) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${targetUser}> a déjà un compte bancaire.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            user = new User({
                ...query,
                balance: 100,
                lastDaily: 0,
            });

            await user.save();

            embed = new EmbedBuilder()
                .setTitle('Création (Admin) :')
                .setDescription(`Le compte bancaire de <@${targetUser}> à bien été créé. Il part avec un montant de **${user.balance}** kastocoins.`)
                .setColor('Blue');
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(`An error occured with /admin-add-account : ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.reply({ embeds: [embed1] });
        }
    },

    name: 'admin-create-account',
    description: "Permet de créer manuellement le compte bancaire d'un membre",
    options: [
        {
            name: 'target-user',
            description: "Veillez entrer l'utilisateur.",
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}