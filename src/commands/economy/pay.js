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

        const targetUserId = interaction.options.get('target-user').value;
        const setAmount = interaction.options.get('amount').value;

        try {
            await interaction.deferReply();

            if (targetUserId === interaction.member.id) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur...?')
                    .setDescription('A quoi bon effectuer un virement pour toi ? :wink:')
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            const ownQuery = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
            }

            const targetQuery = {
                userId: targetUserId,
                guildId: interaction.guild.id,
            }

            let ownUser = await User.findOne(ownQuery);
            let targetUser = await User.findOne(targetQuery);

            if (!ownUser) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${interaction.member.id}> Vous ne pouvez pas effectuer de virement quand votre ordinateur est infecté par un virus 😷🦠💻`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            if (!targetUser) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${targetUserId}> n'a pas encore de compte banquaire, vous ne pouvez pas effectuer de virement sur un compte inexistant.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            if (setAmount < 0) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${interaction.member.id}>... POURQUOI TU ESSAIES DE PAYER UN MONTANT NÉGATIF ?!`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            moneyDifference = ownUser.balance - setAmount

            if (moneyDifference < 0) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${interaction.member.id}>, tu n'as pas assez d'argent pour effectuer de virement.`)
                    .setColor('Red')
                interaction.editReply({ embeds: [embed] });
                return;
            }

            ownUser.balance -= setAmount
            targetUser.balance += setAmount
            await ownUser.save();
            await targetUser.save();

            embed = new EmbedBuilder()
                .setTitle('Virement :')
                .setDescription(`<@${interaction.member.id}> a effectué un virment de **${setAmount}** kastocoins à <@${targetUserId}>. 
                \n <@${interaction.member.id}> a maintenant **${ownUser.balance}** kastocoins sur son compte.
                \n <@${targetUserId}> a maintenant **${targetUser.balance}** kastocoins sur son compte.`)
                .setColor('Green');

            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(`Error with /pay : ${error}`);
            embed = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue lors de l\'exécution de cette commande. Si cela se reproduit, veillez contacter @Kastocarma.')
                .setColor('Red');
            interaction.reply({ embeds: [embed] });
        }

    },

    name: 'pay',
    description: "Pays another member with your money.",
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
    options: [
        {
            name: 'target-user',
            description: "L'utilisateur à payer.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'amount',
            description: "L'argent à donner à l'utilisateur.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
};