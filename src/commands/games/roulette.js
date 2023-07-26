const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const getRandomWithManyExclusion = require('../../functions/games/getRandomWithManyExclusion');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "Vous ne pouvez que exécuter cette commande dans un serveur",
                ephemeral: true,
            });
            return;
        }

        const setAmount = interaction.options.get('amount').value;
        const currentDate = Date.now();
        trigger = 0;

        try {
            await interaction.deferReply();

            const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            var array = [1,2,3,4,5,6];

            if (!user) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription("Tu ne peux pas jouer à ce jeux si tu n'a pas de compte banquaire.")
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

            if (setAmount > user.balance) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`Tu n'a pas assez d'argent pour parier **$${setAmount}**`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            mainEmbed = new EmbedBuilder()
                .setTitle('Roulette Russe :')
                .setDescription(`Vous pariez **$${setAmount}** <@${interaction.user.id}>... Le pistolet est prêt à faire feu pour **3** essais...`)
                .setColor('DarkBlue');
            interaction.editReply({ embeds: [mainEmbed] });

            const timer = ms => new Promise(res => setTimeout(res, ms));

            for (let loop = 0; loop < 3; loop++) {
                if (trigger === 1) {
                    break;
                }
                if (trigger === 0 && loop === 3) {
                    embed1 = new EmbedBuilder()
                        .setTitle('Ouf !')
                        .setDescription("Bravo tu as tenu sans te faire tuer !")
                        .setColor('Green');
                    await interaction.followUp({ embeds: [embed1] });
                    break; 
                }
                var num = [0];
                randomNum = getRandomWithManyExclusion(array, num);
                num.push(randomNum);
                console.log(randomNum);
                if (randomNum === 1 || randomNum === 2) {
                    user.balance -= setAmount;
                    await user.save();
                    embed1 = new EmbedBuilder()
                        .setTitle('Oh non !')
                        .setDescription(`Malheureusement, la malchance te rattrappe et tu est mort... Tu as perdu **$${setAmount}**. Ton compte set maintenant à **$${user.balance}**`)
                        .setColor('DarkRed');
                    trigger = 1;
                } else {
                    embed1 = new EmbedBuilder()
                        .setTitle('Ouf !')
                        .setDescription("Tu as survécu...")
                        .setColor('DarkGreen');
                }
                await timer(3000);
                await interaction.followUp({ embeds: [embed1] });
            }

            if (trigger === 0) {
                const amountWon = Number((setAmount * (Math.random() + 1.5)).toFixed(0));
                user.balance += amountWon;
                await user.save();
                const winEmbed = new EmbedBuilder()
                    .setTitle('Chanceux !')
                    .setDescription(`Grâce à ta chance <@${interaction.user.id}>, tu as réussi à gagner **+ $${amountWon}** ! Ton compte est maintenant à **$${user.balance}**`)
                    .setColor('Green');
                await interaction.followUp({ embeds: [winEmbed] });
            } else {
                return;
            }
        } catch (error) {
            console.log(`Error with /roulette : ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.editReply({ embeds: [embed1] });
        }
    },

    name: 'roulette',
    description: "Permet de parier avec la roulette russe",
    devOnly: true,
    //testOnly: true,
    //deleted: true,
    options: [
        {
            name: 'amount',
            description: "Le montant à parier sur la roulette.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ]
}