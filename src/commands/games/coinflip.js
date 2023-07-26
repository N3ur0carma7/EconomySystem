const { Client, Interaction, EmbedBuilder,  } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const { id } = interaction.user;

        try {
            await interaction.deferReply();

            const randomNum = Math.round(Math.random()); //between 0 and 1
            const result = randomNum ? "Pile" : "Face";

            const embed = new EmbedBuilder()
                .setTitle('Pile ou Face :')
                .setDescription(`La pièce a atterit sur.... **${result}!**`)
                .setColor('Green');
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(`Error with /coinflip : ${error}`);
            const errEmbed = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.editReply({ embeds: [errEmbed] });
        }
    },

    name: 'coinflip',
    description: "Faites tourner la pièce de la décision avec ce pile ou face.",
    //devOnly: true,
    //testOnly: true,
    //deleted: true,
}