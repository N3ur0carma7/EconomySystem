const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
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
            const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            var array = [1,2,3,4,5,6];

            if (!user) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription("Tu ne peux pas jouer à ce jeux si tu n'a pas de compte banquaire.")
                    .setColor('Red');
                interaction.reply({ embeds: [embed] });
                return;
            }

            if (user.casinoEnd < currentDate) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription("Vous ne pouvez pas exécuter cette commande sans ticket de casino actif.")
                    .setColor('Red');
                interaction.reply({ embeds: [embed] });
                return;
            }

            if (setAmount > user.balance) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`Tu n'a pas assez d'argent pour parier **$${setAmount}**`)
                    .setColor('Red');
                interaction.reply({ embeds: [embed] });
                return;
            }

            const joinButton = new ButtonBuilder()
                .setCustomId('join')
                .setLabel('Rejoindre')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder()
                .addComponents(joinButton);
            
            mainEmbed = new EmbedBuilder()
                .setTitle('Roulette Russe :')
                .setDescription(`Vous pariez **$${setAmount}** <@${interaction.user.id}>... En attente d'autres joueurs...`)
                .setColor('DarkBlue');
            
            const response = await interaction.reply({
                embeds: [mainEmbed],
                components: [row],
            });

            const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });

            collector.on('collect', async i => {
                const selection = i.values[0];
                await i.reply(`${i.user} has selected ${selection}!`);
            });

            
        } catch (error) {
            console.log(`Error with /roulette : ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.followUp({ embeds: [embed1] });
        }
    },

    name: 'roulette-test',
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