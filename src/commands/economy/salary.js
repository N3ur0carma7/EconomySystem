const { Client, Interaction, EmbedBuilder, time } = require('discord.js');
const User = require('../../models/User');
const Cooldown = require('../../models/RoleCooldown');
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
              content: 'You can only run this command inside a server.',
              ephemeral: true,
            });
            return;
        }

        const userId = interaction.member.id;
        const guildId = interaction.guild.id;

        try {
            await interaction.deferReply();

            let user = await User.findOne({ userId: userId, guildId: guildId });

            if (!user) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${userId}>, vous n'avez pas encore de compte banquaire. Pour en créer un veillez exécuter /daily.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            const userRoles = interaction.member.roles.cache;
            const roleIds = userRoles.map((role) => role.id);
            let hasRole = await Role.find({
                  guildId: guildId, 
                  roleId: { $in: roleIds } 
            });

            if (hasRole.length === 0) {
                embed = new EmbedBuilder()
                    .setTitle('Erreur :')
                    .setDescription(`<@${interaction.user.id}>, vous n'avez aucun salaire.`)
                    .setColor('Red');
                interaction.editReply({ embeds: [embed] });
                return;
            }

            const mainEmbed = new EmbedBuilder()
                    .setTitle('Salaires :')
                    .setDescription(`Voici vos salaires :`)
                    .setColor('Blue');
                
           await Promise.all(hasRole.map(async (role, index) => {
                let cooldown = await Cooldown.findOne({ userId: interaction.user.id, roleId: role.roleId });
                if (!cooldown) {
                    cooldown = new Cooldown({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                        roleId: role.roleId,
                        endsAt: Date.now()+role.cooldown,
                    })

                    await cooldown.save();

                    user.balance += role.salaryAmount;

                    await user.save();

                    roleTime = new Date(cooldown.endsAt);

                    goodTime = time(roleTime);

                    relativeTime = time(roleTime, 'R');

                    mainEmbed.addFields({ name: `${index + 1}. ${role.name}`, value: `**Recupéré !** \n Salaire : **$${role.salaryAmount}** \n Prochain Salaire ${relativeTime}`, inline: false });
                    return;
                } else {
                    if (cooldown.endsAt > Date.now()) {

                        roleTime = new Date(cooldown.endsAt);

                        goodTime = time(roleTime);

                        relativeTime = time(roleTime, 'R');

                        mainEmbed.addFields({ name: `${index + 1}. ${role.name}`, value: `**Cooldown Actif !** \n Le cooldown sur ce rôle est toujours actif, vous pourrez récupérer votre salaire ${relativeTime}.`, inline: false });
                        return;
                    } else {
                        cooldown.endsAt = Date.now() + role.cooldown;

                        user.balance += role.salaryAmount;

                        roleTime = new Date(cooldown.endsAt);

                        goodTime = time(roleTime);

                        relativeTime = time(roleTime, 'R');
                        
                        await cooldown.save();    

                        mainEmbed.addFields({ name: `${index + 1}. ${role.name}`, value: `**Recupéré !** \n Salaire : **$${role.salaryAmount}** \n Prochain Salaire dans ${relativeTime}`, inline: false });
                        return;
                    }
                }
            }));

            await user.save();
        
            mainEmbed.addFields({ name: `- MONTANT SUR LE COMPTE -`, value: `Vous avez maintenant **$${user.balance}** sur votre compte` });

            interaction.editReply({ embeds: [mainEmbed] });


        } catch (error) {
            console.log(`Error with command /salary : ${error}`);
            embed1 = new EmbedBuilder()
                .setTitle('Erreur Code :')
                .setDescription('Une erreur est survenue dans le code. Si cela se reproduit veillez contacter @Kastocarma')
                .setColor('Red');
            interaction.reply({ embeds: [embed1] });
        }
    },

    name: 'salary',
    description: "Permet de recevoir son salaire, seulement si on a un job.",
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
}