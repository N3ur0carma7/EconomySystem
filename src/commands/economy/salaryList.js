const { Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Role = require('../../models/RoleIncomes');


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

        try {
            await interaction.deferReply();

            let roleList = await Role.find({ guildId: interaction.guild.id });

            if (roleList.length === 0) {
                embed = new EmbedBuilder()
                    .setTitle('Error :')
                    .setDescription("There is no role incomes yet in this server.")
                    .setColor('Red')
                interaction.editReply({ embeds: [embed] });
                return;
            } 

            const { default: prettyMs } = await import('pretty-ms');

            const mainEmbed = new EmbedBuilder()
                .setTitle('Liste des salaires :')
                .setDescription('Voici la liste des salaires dans le serveur :')
                .setColor('Blue');
            
            roleList.forEach((item, index) => {
                mainEmbed.addFields({ name: `${index + 1}. ${item.name}`, value: `Role : <@&${item.roleId}> \n Montant : **${item.salaryAmount}** \n Cooldown : **${prettyMs(item.cooldown, { verbose: true })}**`, inline: true })
            });

            interaction.editReply({ embeds: [mainEmbed] });

        } catch (error) {
            console.log(`Error with /salary-list: ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit, veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.editReply({ embeds: [embed1] });
        }

    },

    name: 'salary-list',
    description: "Permet de voir les salaires attribués aux rôles.",
    //devOnly: true,
    //testOnly: true,
    //deleted: true,
}