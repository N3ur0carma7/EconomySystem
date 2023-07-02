const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction, EmbedBuilder } = require('discord.js');
const Role = require('../../models/RoleIncomes');
const ms = require('ms');

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

        const targetRoleId = interaction.options.get('target-role').value;
        const setAmount = interaction.options.get('amount').value;
        const setCooldown = interaction.options.get('cooldown').value;
        const setName = interaction.options.get('name').value;
    
        try {
            await interaction.deferReply();
    
            const queryRole = {
                roleId: targetRoleId,
                guildId: interaction.guild.id,
            }
    
            let role = await Role.findOne(queryRole);
    
            if (role) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`Le role <@&${targetRoleId}> a déjà un salaire attribué.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            if (setAmount < 0) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`Vous ne pouvez pas mettre un salaire négatif.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }
    
            const msCooldown = ms(setCooldown);
    
            if (isNaN(msCooldown)) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`Veillez entrer une durée correcte.`)
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
                return;
            }

            const { default: prettyMs } = await import('pretty-ms');

            role = new Role({
                name: setName,
                roleId: targetRoleId,
                guildId: interaction.guild.id,
                salaryAmount: setAmount,
                cooldown: msCooldown,
            });

            await role.save();

            embed = new EmbedBuilder()
                .setTitle('Ajout Salaire (Admin) :')
                .setDescription(`Le role <@&${targetRoleId}> a bien été ajouté à la liste des salaires avec comme nom : **${setName}**. \n Montant tous les **${prettyMs(msCooldown, { verbose: true })}** : **${setAmount}** kastocoins.`)
                .setColor('Green');
            interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.log(`Error with /admin-add-salary: ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit, veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.editReply({ embeds: [embed1] });
        }
        
    },

    name: 'admin-add-salary',
    description: "Permet d'ajouter un salaire à un rôle. (Cooldown Customisable)",
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
    options: [
        {
            name: 'target-role',
            description: "Le role associé au salaire.",
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: 'amount',
            description: "Montant du salaire.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'cooldown',
            description: "Le coolodwn (1h, 3d, 1d, 24d,...)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'name',
            description: "Le nom à donner au salaire.",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
};