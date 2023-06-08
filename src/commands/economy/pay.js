const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
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
                interaction.editReply("N'y pense même pas :/");
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
                interaction.editReply(`<@${interaction.member.id}> Vous ne pouvez pas donner de l'argent à un autre personne quand votre ordinateur est infecté par un virus 😷🦠💻`)
                return;
            }

            if (!targetUser) {
                interaction.editReply(`<@${targetUserId}> n'a pas encore de compte banquaire, vous ne pouvez pas lui donner de l'argent.`,);
                return;
            }

            if (setAmount < 0) {
                interaction.editReply(`<@${interaction.member.id}>... POURQUOI TU ESSAIES DE PAYER UN MONTANT NÉGATIF ?!`)
                return;
            }

            moneyDifference = ownUser.balance - setAmount

            if (moneyDifference < 0) {
                interaction.editReply(`<@${interaction.member.id}>, tu n'as pas assez d'argent pour payer autant.`);
                return;
            }

            ownUser.balance -= setAmount
            targetUser.balance += setAmount
            await ownUser.save();
            await targetUser.save();

            interaction.editReply(`
            <@${interaction.member.id}> a donné  **${setAmount}** kastocoins<@${targetUserId}>. 
            \n <@${interaction.member.id}> a maintenant **${ownUser.balance}** kastocoins sur son compte.
            \n <@${targetUserId}> a maintenant **${targetUser.balance}** kastocoins sur son compte.
            `)
        } catch (error) {
            console.log(`Error with /pay : ${error}`);
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