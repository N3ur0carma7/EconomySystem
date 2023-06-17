const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Role = require('../../models/RoleIncomes');
const Cooldown = require('../../models/RoleCooldown');
const ms = require('ms');

module.exports = {
    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     */
    callback: async (interaction, client) => {
        if (!interaction.inGuild()) {
            
        }

        const targetRoleId = interaction.options.get('target-role').value;
        const setAmount = interaction.options.get('amount').value;
        const setCooldown = interaction.options.get('cooldown').value;

        try {
            await interaction.deferReply();

            const queryRole = {
                roldId: targetRoleId,
                guildId: interaction.guild.id,
            }

            let role = await Role.findOne(queryRole);
            let cooldown = await Cooldown.findOne(queryRole);

            if (role) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`Le role <@${targetRoleId}> a déjà un salaire attribué.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            if (cooldown) {
                embed = new EmbedBuilder()
                .setTitle('Erreur :')
                .setDescription(`Un cooldown est déjà attribué au rôle <@${targetRoleId}>`)
                .setColor('Red');
                interaction.reply({ embeds: [embed] });
            }

            const msCooldown = ms(setCooldown);

            if (NaN(msCooldown)) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`Veillez entrer un durée correcte.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            if (msCooldown < 3600000 || msCooldown > 2629800000) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription('Le cooldown ne peut pas être en dessous de 1 heure ou au dessus de 1 mois')
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
            }



        } catch (error) {
            console.log(`Error with /admin-add-salary: ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.reply({ embeds: [embed1] });
        }
    },

    name: 'admin-add-salary',
    description: "Ajoute un rôle qui gagnera de l'argent tous les x jours.",
    //devOnly: true,
    //testOnly: true,
    //deleted: true,
    options: [
        {
            name: 'target-role',
            description: "Le rôle à donner un salaire.",
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: 'amount',
            description: "L'argent à recevoir",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'cooldown',
            description: "L'argent pourra être reçu tous les x heures/jours/semaines",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}