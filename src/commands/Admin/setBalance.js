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
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription("Je ne peux pas mettre de l'argent en dessous de 0.");
                interaction.editReply({ embeds: [embed] });
                return;
            }
        
            if (setAmount === user.balance) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription("Le montant que vous avez mis correspond exactement au nombre d'argent de l'utilisateur.");
                interaction.editReply({ embeds: [embed] });
                return;
            }

            user.balance = setAmount;
            await user.save();

            if (trigger === 1) {
                embed = new EmbedBuilder()
                    .setTitle('Modification (Admin) :')
                    .setDescription(`<@${targetUserId}> n'avais pas de compte banquaire. Je lui en ai créé un et il a maintenant **${user.balance}** kastocoins.`);
                interaction.editReply({ embeds: [embed] });
            } else {
                embed = new EmbedBuilder()
                    .setTitle('Modification (Admin) :')
                    .setDescription(`Le compte banquaire de <@${targetUserId}> a maintenant **${user.balance}** kastocoins.`);
                interaction.editReply({ embeds: [embed] });
            }

            trigger = 0
        } catch (error) {
            console.log(`An error occured with /admin-set-balance : ${error}`);
        }
        
    },

    name: 'admin-set-balance',
    description: "Permet de modifier le compte banquaire d'un membre à une certaine valeur.",
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
            description: "Le montant à entrer.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
};