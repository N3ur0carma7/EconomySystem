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
                content: "Tu ne peux que exécuter cette commande dans un serveur.",
                ephemeral: true,
            });
            return;
        }

        const setAmount = interaction.options.get('amount').value;
        const currentDate = Date.now();

        try {
            await interaction.deferReply();

            let user = await User.findOne({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            });

            if (!user) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription("Vous ne pouvez pas parier de l'argent sans compte banquaire...  Pour vous en créer un, veillez exécuter la commande : /daily.")
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            if (user.casinoEnd < currentDate) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription("Vous ne pouvez pas exécuter cette commande sans ticket de casino actif.")
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            if (setAmount < 10) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription("Tu est obligé de parier au moins **$10** !")
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            if (setAmount > user.balance) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`Vous n'avez pas assez d'argent pour parier **$${setAmount}**.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            const didWin = Math.random() > 0.75;

            if (!didWin) {
                user.balance -= setAmount;
                await user.save();

                embed = new EmbedBuilder()
                    .setTitle('Dommage :')
                    .setDescription(`Quel dommage ! Votre pari a échoué et vous avez perdu **$${setAmount}**.`)
                    .setColor('DarkRed');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            const amountWon = Number((setAmount * (Math.random() + 0.55)).toFixed(0));

            user.balance += amountWon;
            await user.save();

            embed = new EmbedBuilder()
                .setTitle('Chanceux :')
                .setDescription(`Bravo ! Tu as eu beaucoup de chance et tu as gagné **+ $${amountWon}** ! Votre compte est maintenant à **$${user.balance}**.`)
                .setColor('Green');
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(`Error with /pari : ${error}`);
            const errEmbed = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.editReply({ embeds: [errEmbed] });
        }
    },

    name: 'pari',
    description: "Vous permet de parier de l'argent.",
    //devOnly: true,
    //testOnly: true,
    //deleted: true,
    options: [
        {
            name: 'amount',
            description: "Le montant à parier",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ]
}