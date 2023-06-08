const User = require('../../models/User');
const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction } = require('discord.js');

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

        const targetUserId = interaction.options.get('target-user').value;
        const setAmount = interaction.options.get('amount').value;
        trigger = 0

        try {
            await interaction.deferReply();

            const query = {
                userId: targetUserId,
                guildId: interaction.guild.id,
            }


            let user = await User.findOne(query);

            if (!user) {
                user = new User({
                    ...query,
                    balance: 0,
                    lastDaily: 0,
                });
                trigger = 1
            }

            if (setAmount < 0) {
                interaction.editReply({
                    content: "Je ne peux pas ajouter de l'argent en dessous de 0.",
                    ephemeral: true,
                });
                return;
            }

            user.balance += setAmount;
            await user.save();

            if (trigger === 1) {
                interaction.editReply(
                    `<@${targetUserId}> n'avais pas de compte banquaire. Je lui en ai créé un, je lui ai rajouté ${setAmount} et il a maintenant ${user.balance} kastocoins.`,
                );
            } else {
                interaction.editReply(
                    `J'ai ajouté ${setAmount} kastocoins au compte banquaire de <@${targetUserId}>. Il a maintenant ${user.balance} kastocoins.`
                );
            }

            trigger = 0
        } catch (error) {
            console.log(`An error occured with /admin-add-money : ${error}`);
        }
        
    },

    name: 'admin-add-money',
    description: "Permet d'ajouter de l'argent au compte banquaire d'un membre.",
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
    options: [
        {
            name: 'target-user',
            description: "L'utilisateur à modifier le compte banquaire.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'amount',
            description: "Le montant à ajouter.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
};