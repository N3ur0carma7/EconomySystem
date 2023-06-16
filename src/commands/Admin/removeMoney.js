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

        const targetUserId = interaction.options.get('target-user').value;
        const setAmount = interaction.options.get('amount').value;

        try {
            await interaction.deferReply();

            const query = {
                userId: targetUserId,
                guildId: interaction.guild.id,
            }


            let user = await User.findOne(query);

            if (!user) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${targetUserId}> n'a pas encore de compte banquaire. Pour lui en ajouter un manuellement, veillez exécuter la commande : /admin-add-account`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            const amountDifference = user.balance - setAmount

            if (setAmount < 0) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription("NON JE NE PEUX PAS ENLEVER DE L'ARGENT NÉGATIF !")
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            if (amountDifference < 0) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
<<<<<<< HEAD
                    .setDescription(`Je ne peux pas enlever autant d'argent à cet utilisateur car il n'a que **${user.balance}** kastocoins.`)
                    .setColor('Red');

                interaction.editReply({ embeds: [embed] });
=======
                    .setDescription(`Je ne peux pas enlever autant d'argent à cet utilisateur car il n'a que ${user.balance} kastocoins.`)
                    .setColor('Red');
                amountDifference = 0
>>>>>>> 872a922cb3cbeed640c13a4d4998bdb998cdc6ad
                return;
            }

            user.balance -= setAmount;
            await user.save();

            embed = new EmbedBuilder()
                    .setTitle('Retirer (Admin) :')
                    .setDescription(`J'ai enlevé **${setAmount}** kastocoins au compte banquaire de <@${targetUserId}>. Il a maintenant **${user.balance}** kastocoins.`)
<<<<<<< HEAD
                    .setColor('Blue');
=======
                    .setColor('Green');
>>>>>>> 872a922cb3cbeed640c13a4d4998bdb998cdc6ad

            interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.log(`An error occured with /admin-remove-money : ${error}`);
        }
        
    },

    name: 'admin-remove-money',
    description: "Permet d'enlever de l'argent au compte banquaire d'un membre.",
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
            description: "Le montant à enlever.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
};