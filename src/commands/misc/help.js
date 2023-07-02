const { EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "Vous ne pouvez que exécuter cette commande dans un serveur.",
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            const embed = new EmbedBuilder()
                .setTitle("Aide :")
                .setDescription(
                    "Voici les commandes du serveur : \n \n **Economie :** \n /balance - Permet de voir son argent. \n /daily - Permet de récolter son argent quotidien. \n /shop - Permet de VOIR les objets disponibles à la boutique. \n /buy - Permet d'ACHETER des objets disponibles au shop. \n /inventory - Permet de VOIR les objets de votre inventaire. \n /use - Permet d'UTILISER des objets de votre inventaire. \n /pay - Permet de donner de l'argent à une personne de son choix. \n /salary - Permet de récolter son salaire. \n /salaryList - Permet de voir la liste des salaires. \n \n **Entreprises :** \n /company-create - **WIP** Permet de créer une entreprise pour 20 000 kastocoins. \n \n **Autres :** \n /ping - Permet de vérifier si le bot est vivant... \n /help - Permet d'afficher cette liste de commandes. \n \n**Autres Informations :** \n Ce bot a été développé par <@580160894395219968>.")
                .setColor('Blue');
            
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(`Error with /help: ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.editReply({ embeds: [embed1] });
        }
    },

    name: 'help',
    description: "Permet de voir la liste des commandes du bot.",
    //testOnly: true,
    //devOnly: true,
    //deleted: true,
}