const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Role = require('../../models/RoleIncomes');
const Cooldown = require('../../models/RoleCooldown');

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

        try {
            await interaction.deferReply();

            roleQuery = {
                roleId: targetRoleId,
                guildId: interaction.guild.id,
            }

            let role = await Role.findOne(roleQuery);

            if (!role) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`Le rôle <@&${targetRoleId}> n'est pas dans la liste des salaires.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            const cooldownQuery = {
                guildId: interaction.guild.id,
                roleId: targetRoleId,
            }

            let cooldown = await Cooldown.find(cooldownQuery);

            if (cooldown.length !== 0) {
                cooldown.forEach(async (cool) => {
                    cool.deleteOne();
                })
            }

            await role.deleteOne();

            embed = new EmbedBuilder()
                .setTitle('Supression Salaire (Admin) :')
                .setDescription(`Le role <@&${targetRoleId}> a bien été enlevé de la liste des salaires et les cooldowns actifs des membres sur ce rôle, ont aussi été supprimés.`)
                .setColor('Blue');
            interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.log(`Error with /admin-remove-salary: ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.editReply({ embeds: [embed1] });
        }
    },

    name: 'admin-remove-salary',
    description: "Permet d'enlever un rôle de la liste des salaires",
    //devOnly: true,
    //testOnly: true,
    //deleted: true,
    options: [
        {
            name: 'target-role',
            description: "Le rôle à enlever.",
            type: ApplicationCommandOptionType.Role,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}