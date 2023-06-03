const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    run: ({ interaction }) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'user') {
            interaction.reply("configuring user...");
        }
    },
    
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription("Configure some stuff..")
        .addSubcommandGroup((subcommandGroup) => 
            subcommandGroup
                .setName('user')
                .setDescription("Configure a user.")
                .addSubcommand((subcommand) => 
                    subcommand
                        .setName('role')
                        .setDescription("The role you want to give to the user.")
                        .addUserOption((option) => 
                            option
                                .setName('target-user')
                                .setDescription("The user you want to configure.")
                                .setRequired(true)
                            )
                        .addRoleOption((option) => 
                            option
                                .setName('target-role')
                                .setDescription("The role you want to configure for a user.")
                                .setRequired(true)
                            )
                )
        ),
                
    // /configure user
};